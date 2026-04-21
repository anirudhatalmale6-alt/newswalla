import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PenSquare, Calendar, Inbox, BarChart3,
  Users, Settings, Zap, LogOut, Shield, UserCog, Palette, CreditCard,
  Bell, CheckSquare, Languages, MessageSquare, Menu, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { t, LangCode } from '../../i18n/translations';
import api from '../../api/client';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuthStore();
  const lang = (user?.language || 'en') as LangCode;
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/approvals/notifications');
        setUnreadCount(data.unreadCount || 0);
      } catch { /* ignore */ }
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const nav = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard', lang) },
    { to: '/compose', icon: PenSquare, label: t('compose', lang) },
    { to: '/calendar', icon: Calendar, label: t('calendar', lang) },
    { to: '/inbox', icon: Inbox, label: t('inbox', lang) },
    { to: '/analytics', icon: BarChart3, label: t('analytics', lang) },
    { to: '/team', icon: Users, label: t('team', lang) },
    { to: '/settings', icon: Settings, label: t('settings', lang) },
  ];

  const adminNav = [
    { to: '/admin/approvals', icon: CheckSquare, label: 'Approvals' },
    { to: '/admin/users', icon: UserCog, label: t('userManagement', lang) },
    { to: '/admin/theme', icon: Palette, label: t('colorTheme', lang) },
    { to: '/admin/languages', icon: Languages, label: 'Languages' },
    { to: '/admin/subscription', icon: CreditCard, label: t('subscription', lang) },
    { to: '/admin/messages', icon: MessageSquare, label: 'Support Messages' },
  ];

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-brand-600" />
            <span className="text-xl font-bold text-gray-900">NewsWalla</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Social Media Scheduler</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}

        {isAdmin() && (
          <>
            <div className="pt-4 pb-2">
              <div className="flex items-center gap-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                {t('admin', lang)}
              </div>
            </div>
            {adminNav.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm">
            {user?.fullName?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <NavLink to={isAdmin() ? '/admin/approvals' : '/dashboard'} className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 w-full px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t('signOut', lang)}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-brand-600" />
          <span className="text-lg font-bold text-gray-900">NewsWalla</span>
        </div>
        <NavLink to={isAdmin() ? '/admin/approvals' : '/dashboard'} className="relative p-2">
          <Bell className="w-5 h-5 text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[16px] h-[16px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavLink>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <aside
            className="w-72 bg-white flex flex-col h-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
