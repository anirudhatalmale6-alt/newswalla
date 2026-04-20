import { useState, useEffect } from 'react';
import { Languages, Plus, Trash2, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api from '../api/client';
import toast from 'react-hot-toast';

interface Lang {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  font: string;
  enabled: boolean;
}

export default function AdminLanguages() {
  const { user } = useAuthStore();
  const [langs, setLangs] = useState<Lang[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newLang, setNewLang] = useState<Lang>({ code: '', name: '', nativeName: '', dir: 'ltr', font: '', enabled: true });

  useEffect(() => { loadLangs(); }, []);

  const loadLangs = async () => {
    try {
      const { data } = await api.get('/admin/languages');
      setLangs(data);
    } catch { toast.error('Failed to load languages'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/languages', { languages: langs });
      toast.success('Languages saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const toggleEnabled = (idx: number) => {
    const updated = [...langs];
    updated[idx].enabled = !updated[idx].enabled;
    setLangs(updated);
  };

  const removeLang = (idx: number) => {
    if (langs[idx].code === 'en') { toast.error('English cannot be removed'); return; }
    setLangs(langs.filter((_, i) => i !== idx));
  };

  const addLang = () => {
    if (!newLang.code || !newLang.name) { toast.error('Code and name are required'); return; }
    if (langs.find(l => l.code === newLang.code)) { toast.error('Language code already exists'); return; }
    setLangs([...langs, { ...newLang }]);
    setNewLang({ code: '', name: '', nativeName: '', dir: 'ltr', font: '', enabled: true });
    setShowAdd(false);
  };

  const updateLang = (idx: number, field: keyof Lang, value: string) => {
    const updated = [...langs];
    (updated[idx] as any)[field] = value;
    setLangs(updated);
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Languages className="w-7 h-7 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">Languages</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700">
            <Plus className="w-4 h-4" /> Add Language
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">Manage the languages available in your NewsWalla instance. Enable or disable languages, add new ones, or edit existing language settings.</p>

      {/* Language list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Native Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Direction</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Font</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enabled</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {langs.map((lang, idx) => (
              <tr key={lang.code} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-bold rounded">{lang.code}</span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lang.name}
                    onChange={e => updateLang(idx, 'name', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lang.nativeName}
                    onChange={e => updateLang(idx, 'nativeName', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lang.dir}
                    onChange={e => updateLang(idx, 'dir', e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-200 rounded"
                  >
                    <option value="ltr">LTR</option>
                    <option value="rtl">RTL</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={lang.font}
                    onChange={e => updateLang(idx, 'font', e.target.value)}
                    placeholder="Default"
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-500"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleEnabled(idx)} className="inline-flex">
                    {lang.enabled
                      ? <ToggleRight className="w-6 h-6 text-green-600" />
                      : <ToggleLeft className="w-6 h-6 text-gray-400" />
                    }
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  {lang.code !== 'en' && (
                    <button onClick={() => removeLang(idx)} className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Language Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Add Language</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input type="text" value={newLang.code} onChange={e => setNewLang({ ...newLang, code: e.target.value })}
                  placeholder="e.g. fr" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                <select value={newLang.dir} onChange={e => setNewLang({ ...newLang, dir: e.target.value as 'ltr' | 'rtl' })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm">
                  <option value="ltr">Left to Right (LTR)</option>
                  <option value="rtl">Right to Left (RTL)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={newLang.name} onChange={e => setNewLang({ ...newLang, name: e.target.value })}
                placeholder="e.g. French" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Native Name</label>
              <input type="text" value={newLang.nativeName} onChange={e => setNewLang({ ...newLang, nativeName: e.target.value })}
                placeholder="e.g. Français" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Font (optional)</label>
              <input type="text" value={newLang.font} onChange={e => setNewLang({ ...newLang, font: e.target.value })}
                placeholder="e.g. Noto Sans" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={addLang} className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
