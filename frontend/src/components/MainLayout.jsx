import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }) {
  // Pindahkan state buka-tutup sidebar ke sini
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F8F8] font-['Poppins'] text-[#333] overflow-hidden relative">
      
      {/* Overlay Background Hitam Transparan Saat Sidebar HP Terbuka */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header Component */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Area ini yang akan berganti-ganti (Dashboard / Chat / Kapsul) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-2 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}