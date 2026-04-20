import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Link2, Globe, Key, Eye, EyeOff, Save, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'pinterest', name: 'Pinterest', color: '#BD081C' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
];

interface ApiKeyConfig {
  platform: string;
  name: string;
  color: string;
  keys: { key: string; label: string; placeholder: string }[];
}

const apiKeyConfigs: ApiKeyConfig[] = [
  {
    platform: 'facebook', name: 'Facebook & Instagram (Meta)', color: '#1877F2',
    keys: [
      { key: 'facebook_app_id', label: 'App ID', placeholder: 'Enter Meta App ID' },
      { key: 'facebook_app_secret', label: 'App Secret', placeholder: 'Enter Meta App Secret' },
    ]
  },
  {
    platform: 'linkedin', name: 'LinkedIn', color: '#0A66C2',
    keys: [
      { key: 'linkedin_client_id', label: 'Client ID', placeholder: 'Enter LinkedIn Client ID' },
      { key: 'linkedin_client_secret', label: 'Client Secret', placeholder: 'Enter LinkedIn Client Secret' },
    ]
  },
  {
    platform: 'tiktok', name: 'TikTok', color: '#000000',
    keys: [
      { key: 'tiktok_client_key', label: 'Client Key', placeholder: 'Enter TikTok Client Key' },
      { key: 'tiktok_client_secret', label: 'Client Secret', placeholder: 'Enter TikTok Client Secret' },
    ]
  },
  {
    platform: 'pinterest', name: 'Pinterest', color: '#BD081C',
    keys: [
      { key: 'pinterest_app_id', label: 'App ID', placeholder: 'Enter Pinterest App ID' },
      { key: 'pinterest_app_secret', label: 'App Secret', placeholder: 'Enter Pinterest App Secret' },
    ]
  },
  {
    platform: 'youtube', name: 'YouTube (Google)', color: '#FF0000',
    keys: [
      { key: 'youtube_client_id', label: 'Client ID', placeholder: 'Enter Google Client ID' },
      { key: 'youtube_client_secret', label: 'Client Secret', placeholder: 'Enter Google Client Secret' },
    ]
  },
  {
    platform: 'ai', name: 'AI Content Generation', color: '#8B5CF6',
    keys: [
      { key: 'openai_api_key', label: 'OpenAI API Key', placeholder: 'sk-...' },
      { key: 'anthropic_api_key', label: 'Anthropic API Key', placeholder: 'sk-ant-...' },
    ]
  },
];

export default function Settings() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'profile' | 'connections' | 'apikeys'>('profile');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(false);

  useEffect(() => {
    if (tab === 'apikeys') {
      loadApiKeys();
    }
  }, [tab]);

  const loadApiKeys = async () => {
    setLoadingKeys(true);
    try {
      const { data } = await api.get('/settings/api-keys');
      setApiKeys(data.keys || {});
      const configured: Record<string, boolean> = {};
      Object.entries(data.keys || {}).forEach(([k, v]) => {
        configured[k] = !!(v as string);
      });
      setSavedKeys(configured);
    } catch {
      // No keys saved yet
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleKeyChange = (key: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  const toggleShowSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveApiKeys = async () => {
    setSaving(true);
    try {
      await api.put('/settings/api-keys', { keys: apiKeys });
      toast.success('API keys saved successfully!');
      loadApiKeys();
    } catch {
      toast.error('Failed to save API keys');
    } finally {
      setSaving(false);
    }
  };

  const savePlatformKeys = async (config: ApiKeyConfig) => {
    setSaving(true);
    try {
      const keys: Record<string, string> = {};
      config.keys.forEach(k => {
        if (apiKeys[k.key]) keys[k.key] = apiKeys[k.key];
      });
      await api.put('/settings/api-keys', { keys });
      toast.success(`${config.name} keys saved!`);
      loadApiKeys();
    } catch {
      toast.error('Failed to save keys');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {[
          { key: 'profile' as const, icon: User, label: 'Profile' },
          { key: 'apikeys' as const, icon: Key, label: 'API Keys' },
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

      {tab === 'apikeys' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              Configure your social media platform API credentials here. These are needed to connect and publish to each platform.
              Follow the API Connection Guide for step-by-step setup instructions.
            </p>
          </div>

          {loadingKeys ? (
            <div className="text-center py-8 text-gray-500">Loading API keys...</div>
          ) : (
            apiKeyConfigs.map(config => (
              <div key={config.platform} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: config.color + '15' }}>
                      <Globe className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    <h3 className="font-medium text-gray-900">{config.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {config.keys.every(k => savedKeys[k.key]) ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Configured
                      </span>
                    ) : config.keys.some(k => savedKeys[k.key]) ? (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Partial
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not configured</span>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {config.keys.map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <div className="relative">
                        <input
                          type={showSecrets[key] ? 'text' : 'password'}
                          value={apiKeys[key] || ''}
                          onChange={e => handleKeyChange(key, e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        />
                        <button
                          onClick={() => toggleShowSecret(key)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => savePlatformKeys(config)}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : `Save ${config.name} Keys`}
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-end">
            <button
              onClick={saveApiKeys}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving All...' : 'Save All API Keys'}
            </button>
          </div>
        </div>
      )}

      {tab === 'connections' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Connect your social media accounts to schedule and publish posts. Make sure you have configured API keys first.</p>
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
