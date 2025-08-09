import React, { useEffect, useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'applications', label: 'Applications (Real-time)' },
  { id: 'media', label: 'Media Manager' },
  { id: 'pages', label: 'Pages' },
  { id: 'events', label: 'Events' },
  { id: 'policies', label: 'Policies' },
  { id: 'theme', label: 'Theme & Fonts' },
  { id: 'users', label: 'Users & Roles' },
  { id: 'settings', label: 'Settings' },
  { id: 'audit', label: 'Audit Logs' },
];

export default function AdminLayout({
  activeTab,
  onChangeTab,
  onSecurityClick,
  onLogout,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    // Force light mode for admin panel
    root.classList.remove('dark');
  }, []);

  useEffect(() => {
    const fmt = () => new Date().toLocaleString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      weekday: 'short', month: 'short', day: '2-digit'
    });
    setCurrentTime(fmt());
    const t = setInterval(() => setCurrentTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white border-b border-gray-200/70">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="touch-friendly px-3 py-2 rounded-md hover:bg-blue-50 text-blue-700 border border-transparent hover:border-blue-200"
              aria-label="Toggle sidebar"
            >
              Menu
            </button>
            <div className="flex items-center gap-2">
              <img src={'/app_logo-removebg-preview.png'} alt="Uddaan Agencies" className="w-8 h-8 rounded-lg" />
              <div>
                <div className="font-semibold text-blue-700">Uddaan Admin Panel</div>
                <div className="text-xs text-blue-600/70">Secure Management Console</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
              {currentTime}
            </div>
            <button
              onClick={onSecurityClick}
              className="text-blue-700 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
              type="button"
            >
              Security
            </button>
            <button
              onClick={onLogout}
              className="text-blue-700 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={classNames(
          'transition-all border-r border-gray-200 bg-white',
          sidebarOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'
        )}>
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeTab && onChangeTab(item.id)}
                className={classNames(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-blue-50',
                  activeTab === item.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-700'
                )}
              >
                <span className={classNames('truncate', sidebarOpen ? 'inline' : 'hidden md:inline')}>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Command Palette removed for cleaner admin */}
    </div>
  );
}


