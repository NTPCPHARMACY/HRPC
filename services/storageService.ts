
import { NewsItem, StaffMember, FileItem, MeetingRecord } from '../types';
import { INITIAL_NEWS, INITIAL_STAFF, INITIAL_FILES, INITIAL_MEETINGS } from '../constants';

const STORAGE_KEYS = {
  NEWS: 'hrpc_news',
  STAFF: 'hrpc_staff',
  FILES: 'hrpc_files',
  MEETINGS: 'hrpc_meetings'
};

// Helper to get data or default
const getOrInit = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const StorageService = {
  // NEWS
  getNews: (): NewsItem[] => getOrInit(STORAGE_KEYS.NEWS, INITIAL_NEWS),
  saveNews: (data: NewsItem[]) => localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(data)),
  
  // STAFF
  getStaff: (): StaffMember[] => getOrInit(STORAGE_KEYS.STAFF, INITIAL_STAFF),
  saveStaff: (data: StaffMember[]) => localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(data)),

  // FILES
  getFiles: (): FileItem[] => getOrInit(STORAGE_KEYS.FILES, INITIAL_FILES),
  saveFiles: (data: FileItem[]) => localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(data)),

  // MEETINGS
  getMeetings: (): MeetingRecord[] => getOrInit(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS),
  saveMeetings: (data: MeetingRecord[]) => localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(data)),
  
  // Reset
  resetAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
