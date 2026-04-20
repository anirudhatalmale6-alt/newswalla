import { useEffect, useState } from 'react';
import { Users, UserPlus, Shield, Crown } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const roleIcons: Record<string, any> = {
  owner: Crown,
  admin: Shield,
};

const roleColors: Record<string, string> = {
  owner: 'text-amber-600 bg-amber-50',
  admin: 'text-purple-600 bg-purple-50',
  editor: 'text-blue-600 bg-blue-50',
  member: 'text-gray-600 bg-gray-50',
};

export default function Team() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    api.get('/teams').then(r => setTeams(r.data)).catch(() => {});
  }, []);

  const loadTeam = async (id: string) => {
    const { data } = await api.get(`/teams/${id}`);
    setSelectedTeam(data);
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) return;
    try {
      const { data } = await api.post('/teams', { name: newTeamName });
      setTeams(prev => [...prev, data]);
      setNewTeamName('');
      toast.success('Team created!');
    } catch {
      toast.error('Failed to create team');
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail || !selectedTeam) return;
    try {
      await api.post(`/teams/${selectedTeam.id}/invite`, { email: inviteEmail, role: inviteRole });
      toast.success('Member invited!');
      setShowInvite(false);
      setInviteEmail('');
      loadTeam(selectedTeam.id);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to invite');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Teams list */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Create Team</h3>
            <div className="flex gap-2">
              <input
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="Team name"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
              <button onClick={createTeam} className="px-3 py-2 bg-brand-600 text-white rounded-lg text-sm">
                Create
              </button>
            </div>
          </div>

          {teams.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No teams yet</p>
            </div>
          ) : (
            teams.map(team => (
              <button
                key={team.id}
                onClick={() => loadTeam(team.id)}
                className={`w-full text-left bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow ${
                  selectedTeam?.id === team.id ? 'border-brand-500' : 'border-gray-200'
                }`}
              >
                <h4 className="font-medium text-gray-900">{team.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${roleColors[team.my_role] || roleColors.member}`}>
                  {team.my_role}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Team detail */}
        <div className="col-span-2">
          {selectedTeam ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{selectedTeam.name}</h2>
                <button
                  onClick={() => setShowInvite(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
                >
                  <UserPlus className="w-4 h-4" /> Invite
                </button>
              </div>

              {showInvite && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <input
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="Email address"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    />
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    >
                      <option value="member">Member</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={inviteMember} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm">
                      Send
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-100">
                {selectedTeam.members?.map((member: any) => {
                  const RoleIcon = roleIcons[member.role];
                  return (
                    <div key={member.id} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm">
                        {member.full_name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${roleColors[member.role] || roleColors.member}`}>
                        {RoleIcon && <RoleIcon className="w-3 h-3" />}
                        {member.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              Select a team to manage
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
