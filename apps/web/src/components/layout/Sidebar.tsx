import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, PenSquare, Calendar, Inbox, BarChart3,
  Users, Settings, Zap, LogOut, Shield, UserCog, Palette, CreditCard
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { t, LangCode } from '../../i18n/translations';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuthStore();
  const lang = (user?.language || 'en') as LangCode;

  const nav = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard', lang) },
    { to: '/compose', icon: PenSquare, label: t('compose', lang) },
    { to: '/calendar', icon: Calendar, label: t('calendar', lang) },
    { to: '/inbox', icon: Inbox, label: t('inbox', lang) },
    { to: '/analytics', icon: BarChart3, label: t('analytics', lang) },
    { to: '/team', icon: Users, label: t('team', lang) },
    { to: '/settings', icon: Settings, label: t('settings', lang) },
  ];

  const adminNav = [
    { to: '/admin/users', icon: UserCog, label: t('userManagement', lang) },
    { to: '/admin/theme', icon: Palette, label: t('colorTheme', lang) },
    { to: '/admin/subscription', icon: CreditCard, label: t('subscription', lang) },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">NewsWalla</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Social Media Scheduler</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
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
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 w-full px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t('signOut', lang)}
        </button>
      </div>
    </aside>
  );
}
