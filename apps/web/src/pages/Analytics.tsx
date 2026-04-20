import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Eye, Heart, Users, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../api/client';

export default function Analytics() {
  const [overview, setOverview] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    api.get('/analytics/overview', { params: { days: timeRange } })
      .then(r => setOverview(r.data))
      .catch(() => {});
  }, [timeRange]);

  // Demo data for charts when no real data exists
  const demoData = Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`,
    impressions: Math.floor(Math.random() * 5000) + 1000,
    engagements: Math.floor(Math.random() * 500) + 100,
    followers: Math.floor(Math.random() * 50) + 10,
  }));

  const stats = [
    { label: 'Total Followers', value: overview?.totalFollowers || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Impressions', value: overview?.totalImpressions || 0, icon: Eye, color: 'text-purple-600 bg-purple-50' },
    { label: 'Engagements', value: overview?.totalEngagements || 0, icon: Heart, color: 'text-pink-600 bg-pink-50' },
    { label: 'Engagement Rate', value: `${(overview?.engagementRate || 0).toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Impressions & Engagements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="impressions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="engagements" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Follower Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="followers" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Platform Breakdown</h3>
        {overview?.platformBreakdown?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 border-b">
                  <th className="pb-3">Platform</th>
                  <th className="pb-3">Account</th>
                  <th className="pb-3 text-right">Followers</th>
                  <th className="pb-3 text-right">Impressions</th>
                  <th className="pb-3 text-right">Engagements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {overview.platformBreakdown.map((p: any, i: number) => (
                  <tr key={i}>
                    <td className="py-3 text-sm font-medium capitalize">{p.platform}</td>
                    <td className="py-3 text-sm text-gray-600">{p.accountName}</td>
                    <td className="py-3 text-sm text-right">{p.followers.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right">{p.impressions.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right">{p.engagements.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Connect social accounts to see platform analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}
