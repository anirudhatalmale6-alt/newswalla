import { useState } from 'react';
import { CreditCard, Check, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { t, LangCode } from '../i18n/translations';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function AdminSubscription() {
  const { user } = useAuthStore();
  const lang = (user?.language || 'en') as LangCode;
  const [stripeKey, setStripeKey] = useState('');
  const [priceId, setPriceId] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveStripe = async () => {
    setSaving(true);
    try {
      await api.put('/settings/api-keys', {
        keys: {
          stripe_publishable_key: stripeKey,
          stripe_price_id: priceId,
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="w-7 h-7 text-brand-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('subscription', lang)}</h1>
      </div>

      {/* Pricing Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900">{t('free', lang)}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$0<span className="text-sm font-normal text-gray-500">{t('perMonth', lang)}</span></p>
          <ul className="mt-4 space-y-2">
            {['5 scheduled posts/month', '2 social accounts', 'Basic analytics', 'Single user'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-brand-50 rounded-xl border-2 border-brand-600 p-6 relative">
          <div className="absolute -top-3 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> Popular
          </div>
          <h3 className="text-lg font-bold text-gray-900">{t('pro', lang)}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$5<span className="text-sm font-normal text-gray-500">{t('perMonth', lang)}</span></p>
          <ul className="mt-4 space-y-2">
            {['Unlimited scheduled posts', 'Unlimited social accounts', 'Advanced analytics', 'Team collaboration', 'AI content generation', 'Video scheduling', 'Priority support'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-brand-600" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stripe Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Stripe Configuration</h3>
        <p className="text-sm text-gray-500">Configure Stripe to enable paid subscriptions. Create a product with $5/month pricing in your Stripe dashboard.</p>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Price ID ($5/month)</label>
          <input
            type="text"
            value={priceId}
            onChange={e => setPriceId(e.target.value)}
            placeholder="price_..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-mono"
          />
        </div>
        <button
          onClick={handleSaveStripe}
          disabled={saving}
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : t('saveChanges', lang)}
        </button>
      </div>
    </div>
  );
}
