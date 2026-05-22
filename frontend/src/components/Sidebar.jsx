import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import Modal from './Modal';

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Chat', path: '/chat', icon: '💬' },
    { label: 'Mood Tracker', path: '/mood', icon: '😊' },
    { label: 'Time Capsule', path: '/capsule', icon: '📦' },
    { label: 'Goals', path: '/goals', icon: '🎯' }
  ];

  return (
    <>
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-primary-dark text-white
          transform transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-primary-light">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🌱 HealMate
          </h1>
          <p className="text-accent text-sm mt-2">Your Recovery Companion</p>
        </div>

        <nav className="flex-1 px-4 py-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-light transition-colors mb-2"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-primary-light p-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white font-medium"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <Modal
        isOpen={showLogoutModal}
        title="Yakin Logout?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        confirmText="Ya"
        cancelText="Batal"
      >
        <p className="text-gray-700">Anda akan keluar dari aplikasi. Lanjutkan?</p>
      </Modal>
    </>
  );
}
