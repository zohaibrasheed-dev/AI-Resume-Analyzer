import { create } from 'zustand';

interface JobData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}

interface ResumeStore {
  imageBlob: Blob | null;
  jobData: JobData | null;
  setImageBlob: (blob: Blob | null) => void;
  setJobData: (data: JobData | null) => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  imageBlob: null,
  jobData: null,
  setImageBlob: (blob) => set({ imageBlob: blob }),
  setJobData: (data) => set({ jobData: data }),
  resetResume: () => set({ imageBlob: null, jobData: null }),
}));