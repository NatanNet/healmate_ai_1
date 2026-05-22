import { useUIStore } from '../stores/uiStore';

export default function Header({ title }) {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-primary-dark">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">HealMate AI</span>
        </div>
      </div>
    </header>
  );
}
