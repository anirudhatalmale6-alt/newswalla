import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Settings as SettingsIcon, User, Link2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'twitter', name: 'X (Twitter)', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'pinterest', name: 'Pinterest', color: '#BD081C' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
];

export default function Settings() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'profile' | 'connections'>('profile');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {[
          { key: 'profile' as const, icon: User, label: 'Profile' },
          { key: 'connections' as const, icon: Link2, label: 'Connected Accounts' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors ${
              tab === key ? 'text-brand-700 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              defaultValue={user?.fullName}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              defaultValue={user?.email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              defaultValue={user?.timezone}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            >
              <option>UTC</option>
              <option>Europe/Stockholm</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>Asia/Kolkata</option>
            </select>
          </div>
          <button
            onClick={() => toast.success('Profile updated!')}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
          >
            Save Changes
          </button>
        </div>
      )}

      {tab === 'connections' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Connect your social media accounts to schedule and publish posts.</p>
          {socialPlatforms.map(platform => (
            <div key={platform.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: platform.color + '15' }}>
                  <Globe className="w-5 h-5" style={{ color: platform.color }} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{platform.name}</h4>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
