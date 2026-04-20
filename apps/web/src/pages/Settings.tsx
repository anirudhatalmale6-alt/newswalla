import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  User, Link2, Globe, Key, Eye, EyeOff, Save, CheckCircle, AlertCircle,
  Languages, Plus, Trash2, X, Power, PowerOff
} from 'lucide-react';
import { t, LangCode, languages } from '../i18n/translations';
import { themes, applyTheme } from '../i18n/themes';
import api from '../api/client';
import toast from 'react-hot-toast';

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

interface PlatformAccount {
  id: string;
  platform: string;
  platform_user_id: string;
  platform_username: string;
  page_id: string | null;
  page_name: string | null;
  is_active: number;
  created_at: string;
}

const platformTypes = [
  { id: 'facebook_page', name: 'Facebook Page', color: '#1877F2', icon: '📄' },
  { id: 'facebook_group', name: 'Facebook Group', color: '#1877F2', icon: '👥' },
  { id: 'facebook_profile', name: 'Facebook Profile', color: '#1877F2', icon: '👤' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F', icon: '📷' },
  { id: 'youtube', name: 'YouTube Channel', color: '#FF0000', icon: '🎬' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  { id: 'tiktok', name: 'TikTok', color: '#000000', icon: '🎵' },
  { id: 'pinterest', name: 'Pinterest', color: '#BD081C', icon: '📌' },
];

export default function Settings() {
  const { user, isAdmin, updateUser } = useAuthStore();
  const lang = (user?.language || 'en') as LangCode;
  const admin = isAdmin();
  const [tab, setTab] = useState<'profile' | 'connections' | 'apikeys'>('profile');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ platform: 'facebook_page', accountName: '', accountId: '', pageName: '' });
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    timezone: user?.timezone || 'UTC',
    language: user?.language || 'en',
    theme: user?.theme || 'blue',
  });

  useEffect(() => {
    if (tab === 'apikeys' && admin) loadApiKeys();
    if (tab === 'connections') loadAccounts();
  }, [tab]);

  const loadApiKeys = async () => {
    setLoadingKeys(true);
    try {
      const { data } = await api.get('/settings/api-keys');
      setApiKeys(data.keys || {});
      const configured: Record<string, boolean> = {};
      Object.entries(data.keys || {}).forEach(([k, v]) => { configured[k] = !!(v as string); });
      setSavedKeys(configured);
    } catch { /* */ }
    finally { setLoadingKeys(false); }
  };

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const { data } = await api.get('/accounts');
      setAccounts(data);
    } catch { /* */ }
    finally { setLoadingAccounts(false); }
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
    } catch { toast.error('Failed to save API keys'); }
    finally { setSaving(false); }
  };

  const savePlatformKeys = async (config: ApiKeyConfig) => {
    setSaving(true);
    try {
      const keys: Record<string, string> = {};
      config.keys.forEach(k => { if (apiKeys[k.key]) keys[k.key] = apiKeys[k.key]; });
      await api.put('/settings/api-keys', { keys });
      toast.success(`${config.name} keys saved!`);
      loadApiKeys();
    } catch { toast.error('Failed to save keys'); }
    finally { setSaving(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/me', profileData);
      updateUser(data);
      if (profileData.theme) applyTheme(profileData.theme);
      toast.success(t('saveChanges', lang));
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const handleAddAccount = async () => {
    if (!newAccount.accountName || !newAccount.accountId) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await api.post('/accounts', {
        platform: newAccount.platform,
        accountName: newAccount.accountName,
        accountId: newAccount.accountId,
        pageName: newAccount.pageName || newAccount.accountName,
      });
      toast.success('Account added!');
      setShowAddAccount(false);
      setNewAccount({ platform: 'facebook_page', accountName: '', accountId: '', pageName: '' });
      loadAccounts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add account');
    }
  };

  const handleToggleAccount = async (account: PlatformAccount) => {
    try {
      await api.put(`/accounts/${account.id}`, { is_active: !account.is_active });
      toast.success(account.is_active ? 'Account disabled' : 'Account enabled');
      loadAccounts();
    } catch { toast.error('Failed to update account'); }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Remove this connected account?')) return;
    try {
      await api.delete(`/accounts/${accountId}`);
      toast.success('Account removed');
      loadAccounts();
    } catch { toast.error('Failed to remove account'); }
  };

  const getPlatformInfo = (platformId: string) => {
    return platformTypes.find(p => p.id === platformId) || { id: platformId, name: platformId, color: '#666', icon: '🔗' };
  };

  // Group accounts by platform base (facebook, youtube, etc.)
  const groupedAccounts = accounts.reduce((groups, acc) => {
    const base = acc.platform.startsWith('facebook') ? 'facebook' : acc.platform;
    if (!groups[base]) groups[base] = [];
    groups[base].push(acc);
    return groups;
  }, {} as Record<string, PlatformAccount[]>);

  const tabs = [
    { key: 'profile' as const, icon: User, label: t('profile', lang) },
    ...(admin ? [{ key: 'apikeys' as const, icon: Key, label: t('apiKeys', lang) }] : []),
    { key: 'connections' as const, icon: Link2, label: t('connectedAccounts', lang) },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('settings', lang)}</h1>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {tabs.map(({ key, icon: Icon, label }) => (
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

      {/* PROFILE TAB */}
      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName', lang)}</label>
            <input
              value={profileData.fullName}
              onChange={e => setProfileData({...profileData, fullName: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email', lang)}</label>
            <input defaultValue={user?.email} disabled className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('timezone', lang)}</label>
            <select
              value={profileData.timezone}
              onChange={e => setProfileData({...profileData, timezone: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            >
              {['UTC','Europe/Stockholm','Europe/London','America/New_York','America/Los_Angeles','Asia/Kolkata','Asia/Karachi','Asia/Dubai'].map(tz => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Languages className="w-4 h-4 inline mr-1" />
              {t('language', lang)}
            </label>
            <select
              value={profileData.language}
              onChange={e => setProfileData({...profileData, language: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('theme', lang)}</label>
            <div className="grid grid-cols-4 gap-2">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setProfileData({...profileData, theme: theme.id})}
                  className={`p-2 rounded-lg border-2 text-center text-xs font-medium transition-all ${
                    profileData.theme === theme.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-0.5 mb-1 justify-center">
                    {[theme.colors[500], theme.colors[600], theme.colors[700]].map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? t('loading', lang) : t('saveChanges', lang)}
          </button>
        </div>
      )}

      {/* API KEYS TAB (admin only) */}
      {tab === 'apikeys' && admin && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              Configure your social media platform API credentials here. These are needed to connect and publish to each platform.
              Follow the API Connection Guide for step-by-step setup instructions.
            </p>
          </div>

          {loadingKeys ? (
            <div className="text-center py-8 text-gray-500">{t('loading', lang)}</div>
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
                        <CheckCircle className="w-3 h-3" /> {t('configured', lang)}
                      </span>
                    ) : config.keys.some(k => savedKeys[k.key]) ? (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Partial
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">{t('notConfigured', lang)}</span>
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
                        <button onClick={() => toggleShowSecret(key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
                    {saving ? t('loading', lang) : `${t('save', lang)} ${config.name}`}
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-end">
            <button onClick={saveApiKeys} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50">
              <Save className="w-5 h-5" />
              {saving ? t('loading', lang) : `${t('save', lang)} All API Keys`}
            </button>
          </div>
        </div>
      )}

      {/* CONNECTED ACCOUNTS TAB */}
      {tab === 'connections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Connect your social media accounts to schedule and publish posts.
              You can add multiple pages, groups, profiles, and channels.
            </p>
            <button
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Account
            </button>
          </div>

          {loadingAccounts ? (
            <div className="text-center py-8 text-gray-500">{t('loading', lang)}</div>
          ) : accounts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No accounts connected yet.</p>
              <p className="text-gray-400 text-xs mt-1">Click "Add Account" to connect your social media pages, groups, and channels.</p>
            </div>
          ) : (
            <>
              {/* Facebook accounts */}
              {groupedAccounts['facebook'] && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#1877F215' }}>
                      <Globe className="w-3.5 h-3.5" style={{ color: '#1877F2' }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Facebook</span>
                    <span className="text-xs text-gray-400 ml-auto">{groupedAccounts['facebook'].length} account(s)</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {groupedAccounts['facebook'].map(acc => {
                      const info = getPlatformInfo(acc.platform);
                      return (
                        <div key={acc.id} className="px-6 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{info.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{acc.platform_username}</p>
                              <p className="text-xs text-gray-500">{info.name} &middot; ID: {acc.platform_user_id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${acc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {acc.is_active ? 'Active' : 'Disabled'}
                            </span>
                            <button onClick={() => handleToggleAccount(acc)} className="p-1.5 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50" title={acc.is_active ? 'Disable' : 'Enable'}>
                              {acc.is_active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleDeleteAccount(acc.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other platform accounts */}
              {Object.entries(groupedAccounts)
                .filter(([base]) => base !== 'facebook')
                .map(([base, accs]) => {
                  const info = getPlatformInfo(accs[0].platform);
                  return (
                    <div key={base} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: info.color + '15' }}>
                          <Globe className="w-3.5 h-3.5" style={{ color: info.color }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{info.name.split(' ')[0]}</span>
                        <span className="text-xs text-gray-400 ml-auto">{accs.length} account(s)</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {accs.map(acc => (
                          <div key={acc.id} className="px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{info.icon}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{acc.platform_username}</p>
                                <p className="text-xs text-gray-500">ID: {acc.platform_user_id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${acc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {acc.is_active ? 'Active' : 'Disabled'}
                              </span>
                              <button onClick={() => handleToggleAccount(acc)} className="p-1.5 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50">
                                {acc.is_active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                              </button>
                              <button onClick={() => handleDeleteAccount(acc.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add Social Account</h2>
              <button onClick={() => setShowAddAccount(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Type</label>
              <select
                value={newAccount.platform}
                onChange={e => setNewAccount({...newAccount, platform: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              >
                <optgroup label="Facebook">
                  <option value="facebook_page">Facebook Page</option>
                  <option value="facebook_group">Facebook Group</option>
                  <option value="facebook_profile">Facebook Profile</option>
                </optgroup>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube Channel</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="pinterest">Pinterest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {newAccount.platform === 'youtube' ? 'Channel Name' :
                 newAccount.platform === 'facebook_page' ? 'Page Name' :
                 newAccount.platform === 'facebook_group' ? 'Group Name' :
                 'Account Name'}
              </label>
              <input
                value={newAccount.accountName}
                onChange={e => setNewAccount({...newAccount, accountName: e.target.value})}
                placeholder="e.g. My Business Page"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {newAccount.platform === 'youtube' ? 'Channel ID' :
                 newAccount.platform.startsWith('facebook') ? 'Page/Group/Profile ID' :
                 'Account ID / Username'}
              </label>
              <input
                value={newAccount.accountId}
                onChange={e => setNewAccount({...newAccount, accountId: e.target.value})}
                placeholder="e.g. 123456789"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">
                {newAccount.platform === 'youtube'
                  ? 'Find in YouTube Studio > Settings > Channel > Advanced'
                  : newAccount.platform.startsWith('facebook')
                  ? 'Find in Page/Group Settings > About section'
                  : 'Your account username or ID from the platform'}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowAddAccount(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t('cancel', lang)}
              </button>
              <button onClick={handleAddAccount} className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
