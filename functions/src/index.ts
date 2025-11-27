/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
const ExcelJS = require("exceljs");
import { Readable } from "stream";

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();
const storage = getStorage();

// --- TYPES ---
interface AuthContext {
  auth?: {
    uid: string;
    token: {
      role?: string;
    };
  };
}

interface JobData {
  title: string;
  company: string;
  location?: string;
  type?: string;
  salary?: string;
  tags?: string[] | string;
  description?: string;
}

interface BatchHandler {
  set: (docRef: FirebaseFirestore.DocumentReference, data: object) => Promise<void>;
  commit: () => Promise<void>;
  getOperationCount: () => number;
}

// --- AUTH HELPER ---
const assertAdmin = (context: AuthContext): void => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new Error("Must be an admin");
  }
};

// --- UTILITY FUNCTIONS ---
const createBatchHandler = (): BatchHandler => {
  let batch = db.batch();
  let operationCount = 0;
  const maxBatchSize = 400;
  const handler = {
    async set(docRef: FirebaseFirestore.DocumentReference, data: object) {
      batch.set(docRef, data);
      operationCount++;
      if (operationCount >= maxBatchSize) {
        await handler.commit();
      }
    },
    async commit() {
      if (operationCount > 0) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    },
    getOperationCount: () => operationCount,
  };
  return handler;
};

const normalizeJobData = (job: Record<string, unknown>) => ({
  title: (job.Title || job.title || "") as string,
  company: (job.Company || job.company || "") as string,
  location: (job.Location || job.location || "") as string,
  type: (job.Type || job.type || "Remote") as string,
  salary: (job.Salary || job.salary || "") as string,
  description: (job.Description || job.description || "") as string,
  tags: job.Tags
    ? String(job.Tags).split(",").map((tag: string) => tag.trim()).filter(Boolean)
    : [],
  published: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
});

// Helper function for paginated collection deletion
const deleteCollectionWithPagination = async (collectionName: string): Promise<void> => {
  const collectionRef = db.collection(collectionName);
  const query = collectionRef.limit(400);
  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
};

const deleteQueryBatch = async (
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  resolve: () => void
): Promise<void> => {
  const snapshot = await query.get();
  if (snapshot.size === 0) {
    resolve();
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  // Recurse on the next process tick
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
};

// --- JOB MANAGEMENT FUNCTIONS ---
/**
 * Create a single Job post
 */
export const createJobPost = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {title, company, location, type, salary, tags, description} = request.data as JobData;
  if (!title || !company) {
    throw new Error("title and company are required");
  }
  try {
    const jobRef = db.collection("jobs").doc();
    await jobRef.set({
      title: title.trim(),
      company: company.trim(),
      location: (location || "").trim(),
      type: type || "Remote",
      salary: salary || "",
      description: (description || "").trim(),
      tags: Array.isArray(tags)
        ? tags.map((tag: string) => tag.trim()).filter(Boolean)
        : typeof tags === "string"
          ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
          : [],
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      success: true,
      message: "Job post created successfully",
      id: jobRef.id,
    };
  } catch (error) {
    logger.error("createJobPost error:", error);
    throw new Error("Failed to create job post");
  }
});

/**
 * Import Jobs from Excel/CSV (Base64 file or byte array)
 */
export const importJobsFromExcel = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {fileData} = request.data as {fileData: string | number[]};
  if (!fileData) {
    throw new Error("fileData is required");
  }
  try {
    let buffer: Buffer;
    if (typeof fileData === "string") {
      // Base64 string
      buffer = Buffer.from(fileData, "base64");
    } else if (Array.isArray(fileData)) {
      // Array of bytes from Uint8Array
      buffer = Buffer.from(new Uint8Array(fileData as number[]));
    } else {
      throw new Error("fileData must be a base64 string or byte array");
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.worksheets[0];
    const jobs: Record<string, unknown>[] = [];
    worksheet.eachRow((row: any, rowNumber: number) => {

      if (rowNumber === 1) return; // Skip header
      const rowData: Record<string, unknown> = {};
      row.eachCell((cell: any, colNumber: number) => {
        const headerValue = worksheet.getRow(1).getCell(colNumber).value;
        if (headerValue !== null && headerValue !== undefined) {
          rowData[headerValue.toString()] = cell.value;
        }
      });
      jobs.push(rowData);
    });
    if (!jobs.length) {
      throw new Error("No job data found in the file");
    }
    const batchHandler = createBatchHandler();
    let importedCount = 0;
    let failedCount = 0;
    for (const job of jobs) {
      try {
        // Validate required fields
        const jobRecord = job as Record<string, unknown>;
        if (!jobRecord.Title && !jobRecord.title) {
          failedCount++;
          continue;
        }
        const docRef = db.collection("jobs").doc();
        await batchHandler.set(docRef, normalizeJobData(jobRecord));
        importedCount++;
      } catch (error) {
        logger.error("Error processing job row:", error);
        failedCount++;
      }
    }
    // Commit any remaining operations
    await batchHandler.commit();
    const result: {
      success: boolean;
      message: string;
      importedCount: number;
      failedCount: number;
      totalProcessed: number;
      warning?: string;
    } = {
      success: true,
      message: `Successfully imported ${importedCount} jobs`,
      importedCount,
      failedCount,
      totalProcessed: importedCount + failedCount,
    };
    if (failedCount > 0) {
      result.warning = `${failedCount} jobs failed to import`;
    }
    return result;
  } catch (error) {
    logger.error("importJobsFromExcel error:", error);
    throw error;
  }
});

/**
 * Import Jobs from URL (JSON array)
 */
export const importJobsFromURL = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {url} = request.data as {url: string};
  if (!url) {
    throw new Error("URL is required");
  }
  try {
    // @ts-ignore - fetch is available in Node.js 18+ used by Functions v2
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs from URL: ${response.statusText}`);
    }
    const jobsData = await response.json();
    if (!Array.isArray(jobsData)) {
      throw new Error("Expected JSON array of jobs from URL");
    }
    const batchHandler = createBatchHandler();
    let importedCount = 0;
    let failedCount = 0;
    for (const job of jobsData) {
      try {
        if (!job.title || !job.company) {
          failedCount++;
          continue;
        }
        const docRef = db.collection("jobs").doc();
        await batchHandler.set(docRef, {
          ...job,
          published: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        importedCount++;
      } catch (error) {
        logger.error("Error processing job from URL:", error);
        failedCount++;
      }
    }
    await batchHandler.commit();
    const result: {
      success: boolean;
      message: string;
      importedCount: number;
      failedCount: number;
      totalProcessed: number;
      warning?: string;
    } = {
      success: true,
      message: `Successfully imported ${importedCount} jobs from URL`,
      importedCount,
      failedCount,
      totalProcessed: importedCount + failedCount,
    };
    if (failedCount > 0) {
      result.warning = `${failedCount} jobs failed to import`;
    }
    return result;
  } catch (error) {
    logger.error("importJobsFromURL error:", error);
    throw error;
  }
});

// --- LEARNING CONTENT FUNCTIONS ---
/**
 * Create Learning Content (courses collection)
 */
export const createLearningContent = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {
    title,
    instructor,
    duration,
    level,
    description,
    type,
    contentUrl,
  } = request.data as {
    title: string;
    instructor: string;
    duration?: string;
    level?: string;
    description?: string;
    type?: string;
    contentUrl?: string;
  };
  if (!title || !instructor) {
    throw new Error("Title and instructor are required");
  }
  try {
    const docRef = db.collection("courses").doc();
    await docRef.set({
      title: title.trim(),
      instructor: instructor.trim(),
      duration: duration || "",
      level: level || "Beginner",
      description: (description || "").trim(),
      type: type || "static",
      contentUrl: contentUrl || null,
      rating: 0,
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      success: true,
      message: "Learning content created successfully",
      id: docRef.id,
    };
  } catch (error) {
    logger.error("createLearningContent error:", error);
    throw new Error("Failed to create learning content");
  }
});

// --- FREELANCE MANAGEMENT FUNCTIONS ---
/**
 * Manage Freelance Requests (approve / reject)
 */
export const manageFreelanceRequest = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {action, requestId} = request.data as {action: string; requestId: string};
  if (!action || !requestId) {
    throw new Error("action and requestId are required");
  }
  if (!["approve", "reject"].includes(action)) {
    throw new Error("action must be 'approve' or 'reject'");
  }
  try {
    const requestRef = db.collection("freelance_requests").doc(requestId);
    const requestDoc = await requestRef.get();
    if (!requestDoc.exists) {
      throw new Error("Request not found");
    }
    if (action === "approve") {
      const requestData = requestDoc.data();
      if (!requestData) {
        throw new Error("Request data not found");
      }
      const gigRef = db.collection("freelance_gigs").doc();
      await db.runTransaction(async (transaction) => {
        transaction.set(gigRef, {
          title: requestData.title,
          freelancer: requestData.freelancer,
          price: requestData.price,
          category: requestData.category,
          description: requestData.description,
          rating: requestData.rating || 0,
          approved: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        transaction.delete(requestRef);
      });
      return {success: true, message: "Request approved and gig created"};
    } else {
      await requestRef.update({
        status: "rejected",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {success: true, message: "Request rejected"};
    }
  } catch (error) {
    logger.error("manageFreelanceRequest error:", error);
    throw error;
  }
});

// --- CONSULTANT MANAGEMENT FUNCTIONS ---
/**
 * Create Consultant Profile
 */
export const createConsultantProfile = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {name, expertise, rate, image, verified} = request.data as {
    name: string;
    expertise: string | string[];
    rate?: string;
    image?: string;
    verified?: boolean;
  };
  if (!name || !expertise) {
    throw new Error("name and expertise are required");
  }
  try {
    const consultantRef = db.collection("consultants").doc();
    await consultantRef.set({
      name: name.trim(),
      expertise: Array.isArray(expertise) ? expertise : [expertise.trim()],
      rate: rate || "",
      image: image || "https://picsum.photos/200/200",
      verified: verified || false,
      rating: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      success: true,
      message: "Consultant profile created successfully",
      id: consultantRef.id,
    };
  } catch (error) {
    logger.error("createConsultantProfile error:", error);
    throw new Error("Failed to create consultant profile");
  }
});

// --- AI ACCESS MANAGEMENT FUNCTIONS ---
/**
 * Approve AI Tool Access
 */
export const approveAIAccess = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {requestId, userData} = request.data as {
    requestId: string;
    userData: {email: string; [key: string]: unknown};
  };
  if (!requestId || !userData || !userData.email) {
    throw new Error("requestId and userData.email are required");
  }
  try {
    const accessRef = db.collection("ai_access_requests").doc(requestId);
    await accessRef.set({
      ...userData,
      status: "approved",
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedBy: request.auth?.uid,
    });
    // TODO: Implement email notification
    // await sendAIAccessApprovalEmail(userData.email);
    return {
      success: true,
      message: "AI access approved successfully",
    };
  } catch (error) {
    logger.error("approveAIAccess error:", error);
    throw error;
  }
});

// --- CMS FUNCTIONS ---
/**
 * Create or Edit a Page (CMS)
 * Handles versioning and history automatically.
 */
export const createEditPage = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {slug, title, content, meta, published, featuredImage} = request.data as {
    slug: string;
    title: string;
    content?: string;
    meta?: object;
    published?: boolean;
    featuredImage?: string | null;
  };
  if (!slug || !title) {
    throw new Error("Slug and Title are required");
  }
  try {
    const pageRef = db.collection("pages").doc(slug);
    const doc = await pageRef.get();
    let version = 1;
    const batch = db.batch();
    if (doc.exists) {
      const currentData = doc.data();
      if (currentData) {
        version = (currentData.version || 1) + 1;
        // Archive current version to history
        const historyRef = pageRef
          .collection("history")
          .doc(String(currentData.version));
        batch.set(historyRef, {
          content: currentData.content,
          updatedAt: currentData.updatedAt,
          changedBy: currentData.authorId,
          version: currentData.version,
        });
      }
    }
    batch.set(pageRef, {
      slug,
      title: title.trim(),
      content: content || "",
      excerpt: (content || "").substring(0, 150) + "...",
      meta: meta || {},
      published: published || false,
      featuredImage: featuredImage || null,
      authorId: request.auth?.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      version: version,
    });
    await batch.commit();
    return {success: true, slug, version};
  } catch (error) {
    logger.error("createEditPage error:", error);
    throw error;
  }
});

/**
 * Delete Page (with shallow history cleanup)
 */
export const deletePage = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {slug} = request.data as {slug: string};
  if (!slug) {
    throw new Error("slug is required");
  }
  try {
    const pageRef = db.collection("pages").doc(slug);
    const pageDoc = await pageRef.get();
    if (!pageDoc.exists) {
      throw new Error("Page not found");
    }
    // Shallow delete of history (first 50 docs)
    const historySnap = await pageRef.collection("history").limit(50).get();
    const batch = db.batch();
    historySnap.forEach((doc) => batch.delete(doc.ref));
    batch.delete(pageRef);
    await batch.commit();
    return {success: true, message: "Page deleted successfully"};
  } catch (error) {
    logger.error("deletePage error:", error);
    throw error;
  }
});

// --- BULK OPERATIONS FUNCTIONS ---
/**
 * Bulk Import Content (CSV from URL)
 */
export const bulkImportContent = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {collectionName, fileUrl} = request.data as {
    collectionName: string;
    fileUrl: string;
  };
  if (!collectionName || !fileUrl) {
    throw new Error("collectionName and fileUrl are required");
  }
  try {
    // @ts-ignore - fetch is available in Node.js 18+ used by Functions v2
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
    }
    const csvText = await response.text();
    const workbook = new ExcelJS.Workbook();
    const stream = Readable.from(csvText);
    const worksheet = await workbook.csv.read(stream);
    const items: Record<string, any>[] = [];
    worksheet.eachRow((row: any, rowNumber: number) => {
      if (rowNumber === 1) return; // Skip header
      const rowData: Record<string, any> = {};
      row.eachCell((cell: any, colNumber: number) => {
        const headerValue = worksheet.getRow(1).getCell(colNumber).value;
        if (headerValue !== null && headerValue !== undefined) {
          rowData[headerValue.toString()] = cell.value;
        }
      });
      items.push(rowData);
    });
    const batchHandler = createBatchHandler();
    let importedCount = 0;
    for (const item of items) {
      const docRef = db.collection(collectionName).doc();
      await batchHandler.set(docRef, {
        ...item,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      importedCount++;
    }
    await batchHandler.commit();
    return {
      success: true,
      message: `Successfully imported ${importedCount} items to ${collectionName}`,
      count: importedCount,
    };
  } catch (error) {
    logger.error("bulkImportContent error:", error);
    throw error;
  }
});

/**
 * Get Page Preview (Markdown passthrough)
 */
export const getPagePreview = onCall((request) => {
  assertAdmin(request.auth as AuthContext);
  const {content} = request.data as {content: string};
  if (!content) {
    throw new Error("content is required");
  }
  // In production, render markdown to safe HTML on the server
  // For now, return plain text preview
  return {
    html: content.substring(0, 500) + (content.length > 500 ? "..." : ""),
    totalLength: content.length,
  };
});

// --- SYSTEM HEALTH FUNCTIONS ---
/**
 * Get System Status
 */
export const getSystemStatus = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  try {
    // Test database connection
    const testRef = db.collection("system").doc("health_check");
    await testRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    await testRef.delete();
    // Get collection counts
    const collections = ["pages", "jobs", "courses", "freelance_gigs", "consultants"];
    const counts: Record<string, unknown> = {};
    for (const collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).count().get();
        counts[collectionName] = snapshot.data().count;
      } catch (error) {
        counts[collectionName] = "Error";
      }
    }
    return {
      success: true,
      database: "connected",
      timestamp: new Date().toISOString(),
      counts,
    };
  } catch (error) {
    logger.error("getSystemStatus error:", error);
    throw error;
  }
});

// --- ADMIN SECURITY FUNCTIONS ---
/**
 * Secure collection deletion with pagination
 */
export const adminDeleteCollection = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {collectionName} = request.data as {collectionName: string};
  if (!collectionName) {
    throw new Error("collectionName is required");
  }
  const allowedCollections = [
    "pages", "jobs", "universities", "countries",
    "ai_tools", "courses", "freelance_gigs", "consultants",
  ];
  if (!allowedCollections.includes(collectionName) && collectionName !== "all") {
    throw new Error(
      `Invalid collection name. Allowed: ${allowedCollections.join(", ")} or 'all'`
    );
  }
  try {
    if (collectionName === "all") {
      for (const collection of allowedCollections) {
        await deleteCollectionWithPagination(collection);
      }
    } else {
      await deleteCollectionWithPagination(collectionName);
    }
    return {
      success: true,
      message: `Successfully deleted ${collectionName} collection(s)`,
    };
  } catch (error) {
    logger.error("adminDeleteCollection error:", error);
    throw error;
  }
});

/**
 * Secure storage deletion
 */
export const adminDeleteStorage = onCall(async (request) => {
  assertAdmin(request.auth as AuthContext);
  const {path} = request.data as {path: string};
  if (!path) {
    throw new Error("path is required");
  }
  try {
    const bucket = storage.bucket();
    if (path === "all") {
      // Delete all files (with caution)
      const [files] = await bucket.getFiles();
      const deletePromises = files.map((file) => file.delete());
      await Promise.all(deletePromises);
    } else {
      // Delete specific path
      const [files] = await bucket.getFiles({prefix: path});
      const deletePromises = files.map((file) => file.delete());
      await Promise.all(deletePromises);
    }
    return {
      success: true,
      message: `Successfully deleted storage path: ${path}`,
    };
  } catch (error) {
    logger.error("adminDeleteStorage error:", error);
    throw error;
  }
});
// TEMPORARY: Set admin claim for a user
export const setAdminClaim = onCall(async (request) => {
  const { uid } = request.data;

  if (!uid) {
    throw new Error("UID is required");
  }

  await admin.auth().setCustomUserClaims(uid, { role: "admin" });

  return { success: true, uid };
});
