// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  Timestamp,
  connectFirestoreEmulator,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
  connectAuthEmulator
} from 'firebase/auth';
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator
} from 'firebase/functions';
import type { CMSPage, CollectionType } from '../types';

// Environment-based configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
};

// Validate required configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing required Firebase configuration');
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Development emulator configuration
if (import.meta.env.DEV || process.env.NODE_ENV === 'development') {
  const emulatorHost = 'localhost';
  
  // Uncomment to use emulators in development
  // connectFirestoreEmulator(db, emulatorHost, 8080);
  // connectAuthEmulator(auth, `http://${emulatorHost}:9099`);
  // connectFunctionsEmulator(functions, emulatorHost, 5001);
}

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  console.warn('Firebase persistence error:', err.code);
});

// --- AUTH HELPERS (CLIENT-SIDE) ---

let cachedUser: User | null = null;
let authStateReady = false;

const authPromise = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, (user) => {
    cachedUser = user;
    authStateReady = true;
    resolve();
  });
});

/**
 * Returns the last known Firebase Auth user (or null).
 */
export const getCurrentUser = (): User | null => {
  return cachedUser;
};

/**
 * Wait for auth state to be ready
 */
export const waitForAuth = (): Promise<void> => {
  return authPromise;
};

/**
 * Signs out the current user.
 */
export const signOutAdmin = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Checks if the current user has custom claim role === 'admin'.
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  await waitForAuth();
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    const token = await user.getIdTokenResult(true); // Force refresh to get latest claims
    return token.claims.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// --- CMS / PAGES HELPERS ---

/**
 * Fetches all CMS pages for the admin dashboard, ordered by updatedAt desc.
 */
export const getAdminPages = async (): Promise<CMSPage[]> => {
  try {
    const q = query(collection(db, 'pages'), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap) =>
        ({
          id: docSnap.id,
          ...docSnap.data(),
        } as CMSPage)
    );
  } catch (error) {
    console.error('Error fetching admin pages:', error);
    throw new Error('Failed to fetch pages');
  }
};

/**
 * Fetch a single page by slug for public view.
 */
export const getPageBySlug = async (slug: string): Promise<CMSPage | null> => {
  try {
    const ref = doc(db, 'pages', slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) } as CMSPage;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    throw new Error('Failed to fetch page');
  }
};

/**
 * Create or update a page document.
 */
export const savePage = async (page: CMSPage): Promise<void> => {
  try {
    const pageRef = doc(db, 'pages', page.id);
    await setDoc(
      pageRef,
      {
        ...page,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving page:', error);
    throw new Error('Failed to save page');
  }
};

/**
 * Delete a page by slug.
 */
export const deletePage = async (slug: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'pages', slug));
  } catch (error) {
    console.error('Error deleting page:', error);
    throw new Error('Failed to delete page');
  }
};

// --- GENERIC COLLECTION HELPERS ---

/**
 * Fetch all documents from a collection and return as plain objects with id.
 */
export const getCollectionItems = async (
  collectionName: CollectionType
): Promise<any[]> => {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw new Error(`Failed to fetch ${collectionName}`);
  }
};

/**
 * Simple client‑side bulk import.
 */
export const bulkImportContent = async (
  collectionName: CollectionType,
  items: any[]
): Promise<void> => {
  try {
    const colRef = collection(db, collectionName);

    const writes = items.map((item) =>
      addDoc(colRef, {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );

    await Promise.all(writes);
  } catch (error) {
    console.error('Error with bulk import:', error);
    throw new Error('Failed to import content');
  }
};

// --- WRAPPERS FOR CALLABLE CLOUD FUNCTIONS ---

const createCallableFunction = <T = any, R = any>(name: string) => {
  const func = httpsCallable<T, R>(functions, name);
  return async (data: T): Promise<R> => {
    try {
      const result = await func(data);
      return result.data;
    } catch (error: any) {
      console.error(`Error calling ${name}:`, error);
      throw new Error(error.message || `Failed to execute ${name}`);
    }
  };
};

// Export callable functions
export const callImportJobsFromExcel = createCallableFunction<{ fileData: string }>('importJobsFromExcel');
export const callImportJobsFromURL = createCallableFunction<{ url: string }>('importJobsFromURL');
export const callCreateLearningContent = createCallableFunction('createLearningContent');
export const callManageFreelanceRequest = createCallableFunction('manageFreelanceRequest');
export const callCreateConsultantProfile = createCallableFunction('createConsultantProfile');
export const callApproveAIAccess = createCallableFunction('approveAIAccess');
export const callCreateEditPage = createCallableFunction('createEditPage');
export const callDeletePage = createCallableFunction<{ slug: string }>('deletePage');
export const callBulkImportContent = createCallableFunction('bulkImportContent');
export const callGetPagePreview = createCallableFunction<{ content: string }>('getPagePreview');
export const callGetSystemStatus = createCallableFunction('getSystemStatus');
export const callAdminDeleteCollection = createCallableFunction<{ collectionName: string }>('adminDeleteCollection');
export const callAdminDeleteStorage = createCallableFunction<{ path: string }>('adminDeleteStorage');

// Admin-specific function with role check
export const callAdminFunction = async <T = any, R = any>(
  functionName: string, 
  data: T
): Promise<R> => {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return createCallableFunction<T, R>(functionName)(data);
};