export enum Tab {
  HOME = 'home',
  ABOUT = 'about',
  SOP = 'sop',
  MEETING = 'meeting',
  CONTACT = 'contact'
}

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
}

export interface StaffMember {
  id: number;
  role: string;
  name: string;
  description: string;
  icon: string;
}

export interface FileItem {
  id: number;
  name: string;
  date: string;
  type: 'pdf' | 'doc';
}

export interface MeetingRecord {
  id: number;
  name: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}