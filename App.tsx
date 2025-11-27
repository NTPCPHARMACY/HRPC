
import React, { useState, useEffect } from 'react';
import { Tab, NewsItem, StaffMember, FileItem, MeetingRecord } from './types';
import { StorageService } from './services/storageService';
import { ADMIN_PASSWORD } from './constants';
import EditableText from './components/EditableText';
import GeminiChat from './components/GeminiChat';
import EditModal from './components/EditModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [isEditing, setIsEditing] = useState(false);

  // Data States
  const [news, setNews] = useState<NewsItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'news' | 'staff' | 'file' | 'meeting' | null;
    mode: 'add' | 'edit';
    data?: any;
  }>({ isOpen: false, type: null, mode: 'add' });

  // Load initial data
  useEffect(() => {
    setNews(StorageService.getNews());
    setStaff(StorageService.getStaff());
    setFiles(StorageService.getFiles());
    setMeetings(StorageService.getMeetings());
  }, []);

  // --- CRUD Operations ---

  const handleSaveModal = (data: any) => {
    const id = modalConfig.mode === 'edit' ? modalConfig.data.id : Date.now();
    const newItem = { ...data, id };

    if (modalConfig.type === 'news') {
      const updated = modalConfig.mode === 'edit' 
        ? news.map(i => i.id === id ? newItem : i) 
        : [newItem, ...news];
      setNews(updated);
      StorageService.saveNews(updated);
    } else if (modalConfig.type === 'staff') {
      const updated = modalConfig.mode === 'edit' 
        ? staff.map(i => i.id === id ? newItem : i) 
        : [...staff, newItem];
      setStaff(updated);
      StorageService.saveStaff(updated);
    } else if (modalConfig.type === 'file') {
      const updated = modalConfig.mode === 'edit' 
        ? files.map(i => i.id === id ? newItem : i) 
        : [...files, newItem];
      setFiles(updated);
      StorageService.saveFiles(updated);
    } else if (modalConfig.type === 'meeting') {
      const updated = modalConfig.mode === 'edit' 
        ? meetings.map(i => i.id === id ? newItem : i) 
        : [newItem, ...meetings];
      setMeetings(updated);
      StorageService.saveMeetings(updated);
    }
  };

  const handleDelete = (type: 'news' | 'staff' | 'file' | 'meeting', id: number) => {
    if (!window.confirm('確定要刪除此項目嗎？')) return;
    
    if (type === 'news') {
      const updated = news.filter(i => i.id !== id);
      setNews(updated);
      StorageService.saveNews(updated);
    } else if (type === 'staff') {
      const updated = staff.filter(i => i.id !== id);
      setStaff(updated);
      StorageService.saveStaff(updated);
    } else if (type === 'file') {
      const updated = files.filter(i => i.id !== id);
      setFiles(updated);
      StorageService.saveFiles(updated);
    } else if (type === 'meeting') {
      const updated = meetings.filter(i => i.id !== id);
      setMeetings(updated);
      StorageService.saveMeetings(updated);
    }
  };

  const handleInlineUpdate = (type: 'news' | 'staff' | 'file' | 'meeting', id: number, field: string, value: string) => {
    if (type === 'news') {
      const updated = news.map(i => i.id === id ? { ...i, [field]: value } : i);
      setNews(updated);
      StorageService.saveNews(updated);
    } else if (type === 'staff') {
      const updated = staff.map(i => i.id === id ? { ...i, [field]: value } : i);
      setStaff(updated);
      StorageService.saveStaff(updated);
    }
    // ... add others if needed
  };

  // --- Modal Helpers ---

  const openAddModal = (type: 'news' | 'staff' | 'file' | 'meeting') => {
    setModalConfig({ isOpen: true, type, mode: 'add' });
  };

  const openEditModal = (type: 'news' | 'staff' | 'file' | 'meeting', data: any) => {
    setModalConfig({ isOpen: true, type, mode: 'edit', data });
  };

  const toggleMaintenance = () => {
    if (!isEditing) {
      const password = prompt(`請輸入管理員密碼 (預設: ${ADMIN_PASSWORD}):`);
      if (password === ADMIN_PASSWORD) {
        setIsEditing(true);
        // Optional: Show a toast or small alert
      } else if (password !== null) {
        alert("密碼錯誤，請重試。");
      }
    } else {
      setIsEditing(false);
    }
  };

  // --- Fields Configuration for Modal ---
  const getModalFields = () => {
    switch (modalConfig.type) {
      case 'news': return [
        { name: 'date', label: '日期', type: 'date' },
        { name: 'title', label: '標題', type: 'text' },
        { name: 'description', label: '內容描述', type: 'textarea' }
      ];
      case 'staff': return [
        { name: 'role', label: '職稱', type: 'text' },
        { name: 'name', label: '姓名', type: 'text' },
        { name: 'description', label: '簡介', type: 'textarea' },
        { name: 'icon', label: '圖標 (FontAwesome)', type: 'select', options: ['user-md', 'user', 'user-nurse', 'user-tie'] }
      ];
      case 'file': return [
        { name: 'name', label: '檔案名稱', type: 'text' },
        { name: 'date', label: '更新日期', type: 'text' }, // keeping text for flexibility
        { name: 'type', label: '類型', type: 'select', options: ['pdf', 'doc'] }
      ];
      case 'meeting': return [
        { name: 'name', label: '會議名稱', type: 'text' },
        { name: 'date', label: '日期', type: 'date' }
      ];
      default: return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* 頂部導覽列 */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className={`text-white px-4 py-1 text-sm flex justify-between items-center transition-colors ${isEditing ? 'bg-accent' : 'bg-dark'}`}>
          <span>新北市立聯合醫院官方網站</span>
          <span className="opacity-90 font-bold flex items-center gap-2">
            {isEditing && <i className="fas fa-tools animate-pulse"></i>}
            {isEditing ? '管理員維護模式' : '訪客模式'}
          </span>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-dark">
            <i className="fas fa-hospital-symbol text-3xl md:text-4xl text-primary"></i>
            <div>
              <div className="text-xl md:text-2xl font-bold leading-tight tracking-tight">新北市立聯合醫院</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">臨床研究受試者保護中心 (HRPC)</div>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-1 md:gap-2">
            {[
              { id: Tab.HOME, label: '首頁公告' },
              { id: Tab.ABOUT, label: '中心簡介' },
              { id: Tab.SOP, label: 'SOP下載' },
              { id: Tab.MEETING, label: '會議紀錄' },
              { id: Tab.CONTACT, label: '聯絡我們' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold transition-all duration-200 text-sm md:text-base ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-lg transform -translate-y-0.5' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 animate-fade-in pb-24">
        
        {/* HOME SECTION */}
        {activeTab === Tab.HOME && (
          <div className="space-y-8 animate-slide-up">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-xl bg-cover bg-center h-64 md:h-80 flex items-center justify-center text-center px-4 group"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,77,64,0.7), rgba(0,77,64,0.6)), url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1350&q=80')` 
              }}
            >
              <div className="text-white space-y-3 relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold shadow-black drop-shadow-md">致力於受試者保護與臨床倫理</h1>
                <p className="text-lg md:text-xl font-light tracking-widest opacity-90">Human Research Protection Center</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 border-l-4 border-primary pl-4">
                <h2 className="text-2xl font-bold text-dark flex items-center">
                  <i className="fas fa-bullhorn mr-3 text-accent"></i> 最新消息與課程
                </h2>
                {isEditing && (
                  <button 
                    onClick={() => openAddModal('news')}
                    className="bg-accent hover:bg-pink-700 text-white px-3 py-1 rounded shadow-md text-sm transition-colors"
                  >
                    <i className="fas fa-plus mr-1"></i> 新增公告
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-dashed divide-gray-200">
                {news.length === 0 && <div className="p-8 text-center text-gray-400">目前沒有公告</div>}
                {news.map(item => (
                  <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4 items-start group relative">
                    <div className="bg-light text-dark font-bold px-3 py-1 rounded text-sm whitespace-nowrap shadow-sm border border-teal-100">
                      {item.date}
                    </div>
                    <div className="flex-1 pr-8">
                      <EditableText 
                        initialValue={item.title} 
                        isEditing={isEditing} 
                        onSave={(val) => handleInlineUpdate('news', item.id, 'title', val)}
                        className="text-lg font-bold text-gray-800 mb-1 block"
                      />
                      <EditableText 
                        initialValue={item.description} 
                        isEditing={isEditing} 
                        onSave={(val) => handleInlineUpdate('news', item.id, 'description', val)}
                        className="text-gray-600 text-sm leading-relaxed block"
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    {isEditing ? (
                      <div className="flex gap-2 opacity-100 transition-opacity">
                         <button onClick={() => openEditModal('news', item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><i className="fas fa-edit"></i></button>
                         <button onClick={() => handleDelete('news', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><i className="fas fa-trash-alt"></i></button>
                      </div>
                    ) : (
                       <button className="hidden md:block border border-primary text-primary px-4 py-1 rounded hover:bg-primary hover:text-white transition-all text-sm self-center whitespace-nowrap opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                        詳情
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT SECTION */}
        {activeTab === Tab.ABOUT && (
          <div className="space-y-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-dark border-l-4 border-primary pl-4">
              組織架構與成員
            </h2>
            
            <div className="bg-white p-10 rounded-xl shadow-sm border-2 border-dashed border-gray-300 text-center flex flex-col items-center justify-center gap-4 group hover:border-primary transition-colors cursor-pointer">
               <i className="fas fa-sitemap text-6xl text-gray-200 group-hover:text-primary transition-colors"></i>
               <h3 className="text-xl font-bold text-gray-500">【組織架構圖】</h3>
               <p className="text-sm text-gray-400 max-w-md">
                  {isEditing ? "點擊此處上傳新的架構圖片 (圖片上傳功能模擬中)" : "完整呈現中心各部門職能與層級關係"}
               </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <h3 className="text-xl font-bold text-gray-700">中心成員</h3>
              {isEditing && (
                  <button 
                    onClick={() => openAddModal('staff')}
                    className="bg-accent hover:bg-pink-700 text-white px-3 py-1 rounded shadow-md text-sm"
                  >
                    <i className="fas fa-plus mr-1"></i> 新增成員
                  </button>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {staff.map(member => (
                <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary flex items-start gap-4 transition-all hover:shadow-md relative group">
                  <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center flex-shrink-0 text-primary shadow-inner">
                    <i className={`fas fa-${member.icon} text-3xl`}></i>
                  </div>
                  <div className="flex-1">
                    <EditableText 
                      tagName="h4" 
                      initialValue={`${member.role}：${member.name}`} 
                      isEditing={isEditing} 
                      className="text-xl font-bold text-gray-800 mb-2"
                    />
                    <EditableText 
                      tagName="p" 
                      initialValue={member.description} 
                      isEditing={isEditing} 
                      onSave={(val) => handleInlineUpdate('staff', member.id, 'description', val)}
                      className="text-gray-600 leading-relaxed text-sm"
                    />
                  </div>
                  {isEditing && (
                      <div className="absolute top-2 right-2 flex gap-1">
                         <button onClick={() => openEditModal('staff', member)} className="text-blue-500 hover:bg-blue-50 w-8 h-8 rounded-full"><i className="fas fa-edit"></i></button>
                         <button onClick={() => handleDelete('staff', member.id)} className="text-red-500 hover:bg-red-50 w-8 h-8 rounded-full"><i className="fas fa-trash-alt"></i></button>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOP SECTION */}
        {activeTab === Tab.SOP && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center border-l-4 border-primary pl-4">
                <h2 className="text-2xl font-bold text-dark">標準作業程序 (SOP) 下載</h2>
                {isEditing && (
                  <button 
                    onClick={() => openAddModal('file')}
                    className="bg-accent hover:bg-pink-700 text-white px-3 py-1 rounded shadow-md text-sm"
                  >
                    <i className="fas fa-plus mr-1"></i> 上傳文件
                  </button>
                )}
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
              <i className="fas fa-info-circle mt-1"></i>
              <p className="text-sm">
                請定期確認版本更新。點擊文件圖標即可預覽或下載。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map(file => (
                <div key={file.id} className="relative group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all flex items-center gap-4">
                  <i className={`fas fa-file-${file.type === 'pdf' ? 'pdf text-red-600' : 'word text-blue-600'} text-4xl group-hover:scale-110 transition-transform`}></i>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold text-gray-800 group-hover:text-primary transition-colors mb-1 truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-400">更新日期：{file.date}</div>
                  </div>
                  {isEditing && (
                      <div className="flex flex-col gap-1">
                         <button onClick={() => openEditModal('file', file)} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><i className="fas fa-edit"></i></button>
                         <button onClick={() => handleDelete('file', file.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><i className="fas fa-trash-alt"></i></button>
                      </div>
                  )}
                </div>
              ))}
              {isEditing && (
                <div 
                  onClick={() => openAddModal('file')}
                  className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-primary hover:text-primary transition-all min-h-[100px]"
                >
                  <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                  <span>點擊上傳新 SOP</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MEETING SECTION */}
        {activeTab === Tab.MEETING && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-bold text-dark">歷次會議紀錄</h2>
              {isEditing && (
                  <button 
                    onClick={() => openAddModal('meeting')}
                    className="bg-accent hover:bg-pink-700 text-white px-3 py-1 rounded shadow-md text-sm"
                  >
                    <i className="fas fa-plus mr-1"></i> 新增紀錄
                  </button>
                )}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-light text-dark">
                  <tr>
                    <th className="p-4 font-bold w-2/3">會議名稱</th>
                    <th className="p-4 font-bold hidden md:table-cell">日期</th>
                    <th className="p-4 font-bold w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting, index) => (
                    <tr key={meeting.id} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{meeting.name}</div>
                        <div className="md:hidden text-xs text-gray-500 mt-1">{meeting.date}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-gray-600">
                        {meeting.date}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex gap-3">
                             <button onClick={() => openEditModal('meeting', meeting)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                             <button onClick={() => handleDelete('meeting', meeting.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash-alt"></i></button>
                          </div>
                        ) : (
                          <a href="#" className="text-primary hover:text-dark font-medium flex items-center gap-2 group">
                            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs group-hover:scale-110 transition-transform"><i className="fas fa-download"></i></span> 
                            <span className="hidden sm:inline">下載</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                  {meetings.length === 0 && (
                     <tr><td colSpan={3} className="p-8 text-center text-gray-400">目前沒有會議紀錄</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTACT SECTION */}
        {activeTab === Tab.CONTACT && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-dark border-l-4 border-primary pl-4">
              聯絡資訊
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm space-y-6 h-full flex flex-col justify-center">
                {[
                  { icon: 'map-marker-alt', text: '新北市三重區新北大道一段3號5樓 (三重院區)' },
                  { icon: 'phone', text: '(02) 2982-9111 分機 3181' },
                  { icon: 'envelope', text: 'ao4256@ntpc.gov.tw' },
                  { icon: 'clock', text: '週一至週五 08:00 - 17:00' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <i className={`fas fa-${item.icon} text-xl text-primary mt-1 w-8 text-center`}></i>
                    <div className="text-lg text-gray-700">{item.text}</div>
                  </div>
                ))}
                
                <hr className="border-gray-100 my-4" />
                <div className="bg-light p-5 rounded-xl border border-teal-100">
                  <strong className="text-dark block mb-2 text-lg"><i className="fas fa-subway mr-2"></i>交通資訊：</strong>
                  <p className="text-gray-700 leading-relaxed">捷運新蘆線菜寮站 3 號出口，步行約 3 分鐘。</p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-xl min-h-[300px] flex flex-col items-center justify-center text-gray-500 relative overflow-hidden group shadow-inner">
                {/* Mock Map Background */}
                <div 
                  className="absolute inset-0 opacity-20 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ backgroundImage: "url('https://picsum.photos/600/600?blur=1')" }}
                ></div>
                <div className="relative z-10 bg-white/80 p-6 rounded-full backdrop-blur-sm text-center shadow-lg">
                    <i className="fas fa-map-marked-alt text-5xl mb-3 text-primary"></i>
                    <div className="font-bold text-gray-800">Google Maps 載入中...</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-auto text-sm text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="mb-2">© 2025 新北市立聯合醫院 臨床研究受試者保護中心 版權所有</p>
          <div className="flex justify-center gap-4 mt-4">
             <button onClick={() => StorageService.resetAll()} className="text-xs text-gray-600 hover:text-white underline">重置所有資料</button>
          </div>
        </div>
      </footer>

      {/* CMS Toggle Button */}
      <button 
        onClick={toggleMaintenance}
        className={`fixed bottom-5 left-5 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-white font-bold transition-all transform hover:scale-105 active:scale-95 ${
          isEditing ? 'bg-accent ring-4 ring-pink-200' : 'bg-gray-800 hover:bg-gray-700'
        }`}
      >
        <i className={`fas ${isEditing ? 'fa-sign-out-alt' : 'fa-user-cog'}`}></i>
        <span>{isEditing ? '退出維護' : '管理登入'}</span>
      </button>

      {/* Edit Modal */}
      <EditModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        onSave={handleSaveModal}
        title={modalConfig.mode === 'add' ? '新增項目' : '編輯項目'}
        fields={getModalFields() as any}
        initialData={modalConfig.data}
      />

      {/* Gemini AI Chat Widget */}
      <GeminiChat />

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
