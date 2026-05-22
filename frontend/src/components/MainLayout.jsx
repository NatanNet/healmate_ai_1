import Header from './Header';
import Sidebar from './Sidebar';
import { useUIStore } from '../stores/uiStore';

export default function MainLayout({ title, children }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`
        flex-1 flex flex-col transition-all duration-300
        ${sidebarOpen ? 'ml-0' : 'ml-0'}
      `}>
        <Header title={title} />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
