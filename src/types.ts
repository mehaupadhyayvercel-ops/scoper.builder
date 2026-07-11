export type Step = 'welcome' | 'business' | 'project' | 'preferences' | 'processing' | 'summary';

export interface BusinessInfo {
  fullName: string;
  email: string;
  companyName: string;
  country: string;
  industry: string;
  companySize: string;
}

export interface Preferences {
  platforms: string[];
  capabilities: string[];
  timeline: string;
  budget: string;
}

export interface AssessmentData {
  business: BusinessInfo;
  projectDescription: string;
  preferences: Preferences;
}

export const INITIAL_DATA: AssessmentData = {
  business: {
    fullName: '',
    email: '',
    companyName: '',
    country: '',
    industry: '',
    companySize: ''
  },
  projectDescription: '',
  preferences: {
    platforms: [],
    capabilities: [],
    timeline: '',
    budget: ''
  }
};
