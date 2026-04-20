import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { t, LangCode } from '../i18n/translations';
import { themes, applyTheme } from '../i18n/themes';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function AdminTheme() {
  const { user } = useAuthStore();
  const lang = (user?.language || 'en') as LangCode;
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const { data } = await api.get('/admin/theme');
      setSelectedTheme(data.theme || 'blue');
    } catch { /* default */ }
    finally { setLoading(false); }
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
  };

  const handleSave = async () => {
    try {
      await api.put('/admin/theme', { theme: selectedTheme });
      toast.success('Theme saved for all users!');
    } catch {
      toast.error('Failed to save theme');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">{t('loading', lang)}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="w-7 h-7 text-brand-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('colorTheme', lang)}</h1>
      </div>

      <p className="text-sm text-gray-500">Choose a color theme for the entire application. This will apply to all users.</p>

      <div className="grid grid-cols-2 gap-4">
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => handleSelectTheme(theme.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              selectedTheme === theme.id
                ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {selectedTheme === theme.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">
                {[theme.colors[400], theme.colors[500], theme.colors[600], theme.colors[700]].map((color, i) => (
                  <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">{theme.name}</p>
            <div className="mt-3 flex gap-1">
              {Object.values(theme.colors).map((color, i) => (
                <div key={i} className="flex-1 h-2 rounded-full first:rounded-l-full last:rounded-r-full" style={{ backgroundColor: color }} />
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          {t('saveChanges', lang)}
        </button>
      </div>
    </div>
  );
}
