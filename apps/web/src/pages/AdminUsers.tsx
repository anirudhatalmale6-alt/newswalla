import { useState, useEffect } from 'react';
import { UserCog, Plus, Edit3, Key, Trash2, Shield, User, X, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { t, LangCode } from '../i18n/translations';
import api from '../api/client';
import toast from 'react-hot-toast';

interface UserItem {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  language: string;
  theme: string;
  subscriptionStatus: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { user: currentUser } = useAuthStore();
  const lang = (currentUser?.language || 'en') as LangCode;
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '', role: 'user' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleAddUser = async () => {
    try {
      await api.post('/admin/users', formData);
      toast.success('User created!');
      setShowAddModal(false);
      setFormData({ email: '', password: '', fullName: '', role: 'user' });
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await api.put(`/admin/users/${editingUser.id}`, {
        fullName: editingUser.fullName,
        email: editingUser.email,
        role: editingUser.role,
        is_active: editingUser.isActive,
      });
      toast.success('User updated!');
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update user');
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser || !newPassword) return;
    try {
      await api.put(`/admin/users/${resetPasswordUser.id}/reset-password`, { password: newPassword });
      toast.success('Password reset!');
      setResetPasswordUser(null);
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleToggleActive = async (u: UserItem) => {
    try {
      await api.put(`/admin/users/${u.id}`, { is_active: !u.isActive });
      toast.success(u.isActive ? 'User deactivated' : 'User activated');
      loadUsers();
    } catch { toast.error('Failed to update user'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">{t('loading', lang)}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCog className="w-7 h-7 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">{t('userManagement', lang)}</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
          <Plus className="w-4 h-4" /> {t('addUser', lang)}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('fullName', lang)}</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('email', lang)}</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('role', lang)}</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('actions', lang)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm">
                      {u.fullName?.charAt(0) || '?'}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{u.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role === 'admin' ? t('admin', lang) : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggleActive(u)} className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.isActive ? t('active', lang) : t('inactive', lang)}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditingUser({...u})} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg" title={t('editUser', lang)}>
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setResetPasswordUser(u); setNewPassword(''); }} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title={t('resetPassword', lang)}>
                      <Key className="w-4 h-4" />
                    </button>
                    {u.id !== currentUser?.id && (
                      <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title={t('deleteUser', lang)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t('addUser', lang)}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName', lang)}</label>
              <input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email', lang)}</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('password', lang)}</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('role', lang)}</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
                <option value="user">User</option>
                <option value="admin">{t('admin', lang)}</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">{t('cancel', lang)}</button>
              <button onClick={handleAddUser} className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">{t('addUser', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t('editUser', lang)}</h2>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName', lang)}</label>
              <input value={editingUser.fullName} onChange={e => setEditingUser({...editingUser, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email', lang)}</label>
              <input type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('role', lang)}</label>
              <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
                <option value="user">User</option>
                <option value="admin">{t('admin', lang)}</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">{t('cancel', lang)}</button>
              <button onClick={handleUpdateUser} className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center justify-center gap-2"><Check className="w-4 h-4" />{t('save', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t('resetPassword', lang)} - {resetPasswordUser.fullName}</h2>
              <button onClick={() => setResetPasswordUser(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New {t('password', lang)}</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setResetPasswordUser(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">{t('cancel', lang)}</button>
              <button onClick={handleResetPassword} disabled={newPassword.length < 8} className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50">{t('resetPassword', lang)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
