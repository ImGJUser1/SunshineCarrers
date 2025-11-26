// services/geminiService.ts

import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Server-side AI functions through Cloud Functions
const createAICallable = <T = any, R = any>(name: string) => {
  const func = httpsCallable<T, R>(functions, name);
  return async (data: T): Promise<R> => {
    try {
      const result = await func(data);
      return result.data;
    } catch (error: any) {
      console.error(`Error in AI function ${name}:`, error);
      throw new Error(error.message || `AI service error: ${name}`);
    }
  };
};

// AI Service functions that call Cloud Functions (server-side)
export const checkStudyAbroadEligibility = createAICallable<{
  gpa: string;
  country: string;
  degree: string;
  englishScore: string;
}>('checkStudyAbroadEligibility');

export const analyzeResume = createAICallable<{
  resumeText: string;
  jobDescription: string;
}>('analyzeResume');

export const generateSOP = createAICallable<{
  university: string;
  course: string;
  background: string;
}>('generateSOP');

export const analyzeJobFit = createAICallable<{
  resumeText: string;
  jobData: any;
}>('analyzeJobFit');

export const generateCoverLetter = createAICallable<{
  jobData: any;
  applicantData: any;
}>('generateCoverLetter');

// Client-side form submission (saves to Firestore for admin processing)
export const submitAIAccessRequest = async (formData: any) => {
  try {
    // In production, this would save to Firestore for admin review
    const requestData = {
      ...formData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      type: 'ai_access_request'
    };

    // Simulate API call - replace with actual Firestore save
    console.log('AI Access Request Data:', requestData);
    
    return {
      success: true,
      message: 'Access request submitted successfully. Our team will review your request and contact you within 24 hours.',
      referenceId: `AI-REQ-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error submitting AI access request:", error);
    return {
      success: false,
      message: 'Failed to submit access request. Please try again or contact support.',
      referenceId: null,
      timestamp: new Date().toISOString()
    };
  }
};

// Validation helpers for AI inputs
export const validateStudyAbroadInput = (input: any) => {
  const errors: string[] = [];
  
  if (!input.gpa || input.gpa.trim() === '') {
    errors.push('GPA is required');
  }
  
  if (!input.country || input.country.trim() === '') {
    errors.push('Country is required');
  }
  
  if (!input.degree || input.degree.trim() === '') {
    errors.push('Degree program is required');
  }
  
  return errors;
};

export const validateResumeAnalysisInput = (resumeText: string, jobDescription: string) => {
  const errors: string[] = [];
  
  if (!resumeText || resumeText.trim().length < 50) {
    errors.push('Resume text must be at least 50 characters');
  }
  
  if (!jobDescription || jobDescription.trim().length < 20) {
    errors.push('Job description must be at least 20 characters');
  }
  
  return errors;
};