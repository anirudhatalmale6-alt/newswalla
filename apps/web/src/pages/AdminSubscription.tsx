import { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Users, Star, Settings2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { t, LangCode } from '../i18n/translations';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function AdminSubscription() {
  const { user } = useAuthStore();
  const lang = (user?.language || 'en') as LangCode;
  const [stripeKey, setStripeKey] = useState('');
  const [stripeSecret, setStripeSecret] = useState('');
  const [proPriceId, setProPriceId] = useState('');
  const [teamPriceId, setTeamPriceId] = useState('');
  const [saving, setSaving] = useState(false);

  // Subscription settings
  const [subSettings, setSubSettings] = useState({
    maxUsers: '50',
    freePostLimit: '5',
    freeAccountLimit: '2',
    proPrice: '5',
    teamPrice: '10',
    teamMaxUsers: '5',
    registrationOpen: 'true',
  });
  const [savingSub, setSavingSub] = useState(false);

  useEffect(() => {
    loadStripeSettings();
    loadSubSettings();
  }, []);

  const loadStripeSettings = async () => {
    try {
      const { data } = await api.get('/settings/api-keys');
      const keys = data.keys || {};
      if (keys.stripe_publishable_key) setStripeKey(keys.stripe_publishable_key);
      if (keys.stripe_price_id) setProPriceId(keys.stripe_price_id);
      if (keys.stripe_team_price_id) setTeamPriceId(keys.stripe_team_price_id);
    } catch { /* not configured */ }
  };

  const loadSubSettings = async () => {
    try {
      const { data } = await api.get('/admin/subscription-settings');
      setSubSettings(data);
    } catch { /* not configured */ }
  };

  const handleSaveSubSettings = async () => {
    setSavingSub(true);
    try {
      await api.put('/admin/subscription-settings', subSettings);
      toast.success('Subscription settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSavingSub(false); }
  };

  const handleSaveStripe = async () => {
    setSaving(true);
    try {
      await api.put('/settings/api-keys', {
        keys: {
          stripe_publishable_key: stripeKey,
          stripe_secret_key: stripeSecret,
          stripe_price_id: proPriceId,
          stripe_team_price_id: teamPriceId,
        }
      });
      toast.success('Stripe settings saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="w-7 h-7 text-brand-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('subscription', lang)}</h1>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900">{t('free', lang)}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$0<span className="text-sm font-normal text-gray-500">{t('perMonth', lang)}</span></p>
          <ul className="mt-4 space-y-2.5">
            {[
              '5 scheduled posts/month',
              '2 social accounts',
              'Basic analytics',
              'Single user',
            ].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="bg-brand-50 rounded-xl border-2 border-brand-600 p-6 relative">
          <div className="absolute -top-3 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> Popular
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('pro', lang)}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">$5<span className="text-sm font-normal text-gray-500">{t('perMonth', lang)}</span></p>
          <ul className="mt-4 space-y-2.5">
            {[
              'Unlimited scheduled posts',
              'Unlimited social accounts',
              'Advanced analytics',
              'AI content generation',
              'Video scheduling',
              'Priority support',
              '1 user',
            ].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Team */}
        <div className="bg-gradient-to-br from-purple-50 to-brand-50 rounded-xl border-2 border-purple-500 p-6 relative">
          <div className="absolute -top-3 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Users className="w-3 h-3" /> Best Value
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Team</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">$10<span className="text-sm font-normal text-gray-500">{t('perMonth', lang)}</span></p>
          <p className="text-xs text-purple-600 font-medium mt-1">$2 per user / month</p>
          <ul className="mt-4 space-y-2.5">
            {[
              'Everything in Pro',
              '5 team members',
              'Team collaboration',
              'Approval workflows',
              'Shared content calendar',
              'Role-based access',
              'Dedicated support',
            ].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-purple-600 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stripe Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Stripe Configuration</h3>
        <p className="text-sm text-gray-500">Configure Stripe to enable paid subscriptions. Create two products in your Stripe dashboard: Pro ($5/month) and Team ($10/month for 5 users).</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Publishable Key</label>
            <input
              type="password"
              value={stripeKey}
              onChange={e => setStripeKey(e.target.value)}
              placeholder="pk_live_..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Secret Key</label>
            <input
              type="password"
              value={stripeSecret}
              onChange={e => setStripeSecret(e.target.value)}
              placeholder="sk_live_..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-mono"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pro Price ID ($5/month)</label>
            <input
              type="text"
              value={proPriceId}
              onChange={e => setProPriceId(e.target.value)}
              placeholder="price_..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Price ID ($10/month)</label>
            <input
              type="text"
              value={teamPriceId}
              onChange={e => setTeamPriceId(e.target.value)}
              placeholder="price_..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-mono"
            />
          </div>
        </div>
        <button
          onClick={handleSaveStripe}
          disabled={saving}
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : t('saveChanges', lang)}
        </button>
      </div>
      {/* Subscription Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Subscription Settings</h3>
        </div>
        <p className="text-sm text-gray-500">Control registration, user limits, and plan pricing.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Allowed Users (Total)</label>
            <input
              type="number"
              value={subSettings.maxUsers}
              onChange={e => setSubSettings({ ...subSettings, maxUsers: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Free Plan - Posts/Month</label>
            <input
              type="number"
              value={subSettings.freePostLimit}
              onChange={e => setSubSettings({ ...subSettings, freePostLimit: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Free Plan - Max Accounts</label>
            <input
              type="number"
              value={subSettings.freeAccountLimit}
              onChange={e => setSubSettings({ ...subSettings, freeAccountLimit: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pro Price ($/month)</label>
            <input
              type="number"
              value={subSettings.proPrice}
              onChange={e => setSubSettings({ ...subSettings, proPrice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Price ($/month)</label>
            <input
              type="number"
              value={subSettings.teamPrice}
              onChange={e => setSubSettings({ ...subSettings, teamPrice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Max Users</label>
            <input
              type="number"
              value={subSettings.teamMaxUsers}
              onChange={e => setSubSettings({ ...subSettings, teamMaxUsers: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={subSettings.registrationOpen === 'true'}
              onChange={e => setSubSettings({ ...subSettings, registrationOpen: e.target.checked ? 'true' : 'false' })}
              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Registration Open (allow new users to sign up)
          </label>
        </div>
        <button
          onClick={handleSaveSubSettings}
          disabled={savingSub}
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {savingSub ? 'Saving...' : 'Save Subscription Settings'}
        </button>
      </div>
    </div>
  );
}
