// adminService.ts

import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getCountFromServer,
  writeBatch,
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { 
  ref, 
  listAll, 
  deleteObject,
  getMetadata
} from 'firebase/storage';
import { db, storage } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Types
interface AnalyticsData {
  size: string;
  documents?: number;
  files?: number;
}

interface UserAnalytics {
  total: number;
  active: number;
  newThisMonth: number;
}

interface APIRequests {
  count: number;
  last24h: number;
}

interface UserActivity {
  id: string;
  [key: string]: any;
}

// Analytics Services
export const getFirestoreUsage = async (): Promise<AnalyticsData> => {
  try {
    const collections = [
      'pages', 'jobs', 'universities', 'countries', 
      'ai_tools', 'courses', 'freelance_gigs', 'consultants'
    ];
    let totalDocuments = 0;
    let estimatedSize = 0;

    for (const collectionName of collections) {
      try {
        const snapshot = await getCountFromServer(collection(db, collectionName));
        const count = snapshot.data().count;
        totalDocuments += count;
        // Rough estimation: 1KB per document on average
        estimatedSize += count * 1024;
      } catch (error) {
        console.warn(`Error counting ${collectionName}:`, error);
      }
    }

    return {
      size: `${(estimatedSize / (1024 * 1024)).toFixed(2)} MB`,
      documents: totalDocuments
    };
  } catch (error) {
    console.error('Error getting Firestore usage:', error);
    return { size: '0 MB', documents: 0 };
  }
};

export const getStorageUsage = async (): Promise<AnalyticsData> => {
  try {
    const storageRef = ref(storage);
    const allFolders = await listAll(storageRef);
    
    let totalFiles = 0;
    let totalSize = 0;

    for (const folderRef of allFolders.prefixes) {
      try {
        const folderContents = await listAll(folderRef);
        totalFiles += folderContents.items.length;
        
        for (const itemRef of folderContents.items) {
          try {
            const metadata = await getMetadata(itemRef);
            totalSize += metadata.size;
          } catch (error) {
            console.log('Error getting file metadata:', error);
          }
        }
      } catch (error) {
        console.warn(`Error processing folder ${folderRef.name}:`, error);
      }
    }

    return {
      size: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
      files: totalFiles
    };
  } catch (error) {
    console.error('Error getting storage usage:', error);
    return { size: '0 MB', files: 0 };
  }
};

export const getAPIRequests = async (): Promise<APIRequests> => {
  try {
    // This would typically come from your API gateway or Cloud Functions logs
    // For now, return mock data
    return {
      count: Math.floor(Math.random() * 10000) + 5000,
      last24h: Math.floor(Math.random() * 1000) + 500
    };
  } catch (error) {
    console.error('Error getting API requests:', error);
    return { count: 0, last24h: 0 };
  }
};

export const getUserAnalytics = async (): Promise<UserAnalytics> => {
  try {
    const usersSnapshot = await getCountFromServer(collection(db, 'users'));
    const totalUsers = usersSnapshot.data().count;

    // Get active users (logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeQuery = query(
      collection(db, 'users'), 
      where('lastLogin', '>=', thirtyDaysAgo)
    );
    const activeSnapshot = await getCountFromServer(activeQuery);
    const activeUsers = activeSnapshot.data().count;

    // Get new users this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    
    const newUsersQuery = query(
      collection(db, 'users'), 
      where('createdAt', '>=', oneMonthAgo)
    );
    const newUsersSnapshot = await getCountFromServer(newUsersQuery);
    const newThisMonth = newUsersSnapshot.data().count;

    return {
      total: totalUsers,
      active: activeUsers,
      newThisMonth
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    return { total: 0, active: 0, newThisMonth: 0 };
  }
};

export const getUserActivities = async (): Promise<UserActivity[]> => {
  try {
    const activitiesRef = collection(db, 'user_activities');
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const q = query(activitiesRef, where('timestamp', '>=', oneWeekAgo));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString()
    })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error getting user activities:', error);
    return [];
  }
};

// Backend Connection Management
export const getBackendStatus = async (): Promise<{ connected: boolean }> => {
  try {
    // Check if backend is connected by attempting a simple operation
    await getCountFromServer(collection(db, 'pages'));
    return { connected: true };
  } catch (error) {
    return { connected: false };
  }
};

export const toggleBackendConnection = async (connect: boolean): Promise<{ success: boolean }> => {
  try {
    const statusRef = doc(db, 'system', 'backend_status');
    
    if (connect) {
      await setDoc(statusRef, {
        connected: true,
        lastConnected: serverTimestamp()
      });
    } else {
      await setDoc(statusRef, {
        connected: false,
        lastConnected: serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling backend connection:', error);
    throw error;
  }
};

// Data Deletion Services
export const deleteCollectionData = async (collectionName: string): Promise<{ success: boolean }> => {
  try {
    if (collectionName === 'all') {
      const collections = [
        'pages', 'jobs', 'universities', 'countries', 
        'ai_tools', 'courses', 'freelance_gigs', 'consultants'
      ];
      
      for (const collection of collections) {
        await deleteCollection(collection);
      }
    } else {
      await deleteCollection(collectionName);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting collection data:', error);
    throw error;
  }
};

const deleteCollection = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  
  if (querySnapshot.empty) return;
  
  const batch = writeBatch(db);
  querySnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
};

export const deleteStorageData = async (path: string): Promise<{ success: boolean }> => {
  try {
    const storageRef = ref(storage, path);
    const items = await listAll(storageRef);
    
    const deletePromises = items.items.map(item => deleteObject(item));
    const folderDeletePromises = items.prefixes.map(folder => deleteFolder(folder));
    
    await Promise.all([...deletePromises, ...folderDeletePromises]);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting storage data:', error);
    throw error;
  }
};

const deleteFolder = async (folderRef: any): Promise<void> => {
  const items = await listAll(folderRef);
  
  const deletePromises = items.items.map(item => deleteObject(item));
  const folderDeletePromises = items.prefixes.map(folder => deleteFolder(folder));
  
  await Promise.all([...deletePromises, ...folderDeletePromises]);
};

// Content Management Services
export const createJobPost = async (jobData: any): Promise<any> => {
  try {
    const createJob = httpsCallable(functions, 'createJobPost');
    const result = await createJob(jobData);
    return result.data;
  } catch (error) {
    console.error('Error creating job post:', error);
    throw error;
  }
};

export const importJobsFromExcel = async (fileData: ArrayBuffer): Promise<any> => {
  try {
    const importJobs = httpsCallable(functions, 'importJobsFromExcel');
    const result = await importJobs({ fileData: Array.from(new Uint8Array(fileData)) });
    return result.data;
  } catch (error) {
    console.error('Error importing jobs from Excel:', error);
    throw error;
  }
};

export const importJobsFromURL = async (url: string): Promise<any> => {
  try {
    const importJobs = httpsCallable(functions, 'importJobsFromURL');
    const result = await importJobs({ url });
    return result.data;
  } catch (error) {
    console.error('Error importing jobs from URL:', error);
    throw error;
  }
};

export const createLearningContent = async (contentData: any): Promise<any> => {
  try {
    const createContent = httpsCallable(functions, 'createLearningContent');
    const result = await createContent(contentData);
    return result.data;
  } catch (error) {
    console.error('Error creating learning content:', error);
    throw error;
  }
};

export const manageFreelanceRequests = async (action: string, requestId: string): Promise<any> => {
  try {
    const manageRequest = httpsCallable(functions, 'manageFreelanceRequest');
    const result = await manageRequest({ action, requestId });
    return result.data;
  } catch (error) {
    console.error('Error managing freelance request:', error);
    throw error;
  }
};

export const createConsultantProfile = async (consultantData: any): Promise<any> => {
  try {
    const createConsultant = httpsCallable(functions, 'createConsultantProfile');
    const result = await createConsultant(consultantData);
    return result.data;
  } catch (error) {
    console.error('Error creating consultant profile:', error);
    throw error;
  }
};

export const approveAIAccess = async (requestId: string, userData: any): Promise<any> => {
  try {
    const approveAccess = httpsCallable(functions, 'approveAIAccess');
    const result = await approveAccess({ requestId, userData });
    return result.data;
  } catch (error) {
    console.error('Error approving AI access:', error);
    throw error;
  }
};

export const createEditPage = async (pageData: any): Promise<any> => {
  try {
    const createEditPageFn = httpsCallable(functions, 'createEditPage');
    const result = await createEditPageFn(pageData);
    return result.data;
  } catch (error) {
    console.error('Error creating/editing page:', error);
    throw error;
  }
};

export const deletePage = async (slug: string): Promise<any> => {
  try {
    const deletePageFn = httpsCallable(functions, 'deletePage');
    const result = await deletePageFn({ slug });
    return result.data;
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};

export const getPagePreview = async (content: string): Promise<any> => {
  try {
    const getPreview = httpsCallable(functions, 'getPagePreview');
    const result = await getPreview({ content });
    return result.data;
  } catch (error) {
    console.error('Error getting page preview:', error);
    throw error;
  }
};

export const getSystemStatus = async (): Promise<any> => {
  try {
    const getStatus = httpsCallable(functions, 'getSystemStatus');
    const result = await getStatus();
    return result.data;
  } catch (error) {
    console.error('Error getting system status:', error);
    throw error;
  }
};

export const bulkImportContent = async (collectionName: string, fileUrl: string): Promise<any> => {
  try {
    const bulkImport = httpsCallable(functions, 'bulkImportContent');
    const result = await bulkImport({ collectionName, fileUrl });
    return result.data;
  } catch (error) {
    console.error('Error with bulk import:', error);
    throw error;
  }
};