import { NewsItem, StaffMember, FileItem, MeetingRecord } from './types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 1,
    date: '2025-11-27',
    title: '114年度「人體研究倫理講習班」報名開始',
    description: '地點：三重院區五樓視聽中心 | 時間：14:00-17:00'
  },
  {
    id: 2,
    date: '2025-11-20',
    title: '公告本中心最新組織章程修訂',
    description: '請至中心簡介或SOP專區下載最新版本。'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 1,
    role: '主任委員',
    name: 'XXX 醫師',
    description: '負責督導中心業務運作及綜理受試者保護相關事宜。',
    icon: 'user-md'
  },
  {
    id: 2,
    role: '執行幹事',
    name: '王建贏',
    description: '負責行政業務聯繫、案件受理與排程。',
    icon: 'user'
  }
];

export const INITIAL_FILES: FileItem[] = [
  { id: 1, name: '01. 受試者保護中心設置辦法.pdf', date: '2025/08/28', type: 'pdf' },
  { id: 2, name: '02. 利益衝突申報表.docx', date: '2025/09/01', type: 'doc' },
  { id: 3, name: '03. 通報流程圖.pdf', date: '2025/08/28', type: 'pdf' },
];

export const INITIAL_MEETINGS: MeetingRecord[] = [
  { id: 1, name: '114年度第一次中心會議', date: '2025-01-15' },
  { id: 2, name: '113年度年終檢討會議', date: '2024-12-20' },
];

export const SYSTEM_INSTRUCTION = `
You are the AI Assistant for the New Taipei City Hospital Human Research Protection Center (HRPC).
Your goal is to answer questions about the center, its SOPs, meetings, and contact info based on the provided context.
- Location: Sanchong Branch, 5th Floor, No. 3, Sec. 1, New Taipei Blvd.
- Phone: (02) 2982-9111 ext 3181
- Opening Hours: Mon-Fri 08:00 - 17:00
- Functions: Protect research subjects, manage ethics review, handle conflicts of interest.
- Be polite, professional, and concise. Answer in Traditional Chinese (Taiwan).
`;

// --- 系統設定 ---
// 您可以在此修改管理員登入密碼
export const ADMIN_PASSWORD = 'admin';