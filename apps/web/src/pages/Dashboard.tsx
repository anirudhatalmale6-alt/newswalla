import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PenSquare, Calendar, Users, BarChart3, TrendingUp,
  Eye, Heart, MessageCircle, ArrowUpRight
} from 'lucide-react';
import api from '../api/client';

const quickActions = [
  { to: '/compose', icon: PenSquare, label: 'New Post', color: 'bg-brand-600' },
  { to: '/calendar', icon: Calendar, label: 'View Calendar', color: 'bg-emerald-600' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', color: 'bg-purple-600' },
  { to: '/team', icon: Users, label: 'Team', color: 'bg-amber-600' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    api.get('/analytics/overview').then(r => setStats(r.data)).catch(() => {});
    api.get('/posts', { params: { limit: 5 } }).then(r => setRecentPosts(r.data.posts || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your social media overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {quickActions.map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 group-hover:text-brand-600">{label}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Followers', value: stats?.totalFollowers || 0, icon: Users, change: '+2.4%' },
          { label: 'Impressions', value: stats?.totalImpressions || 0, icon: Eye, change: '+12.3%' },
          { label: 'Engagements', value: stats?.totalEngagements || 0, icon: Heart, change: '+8.1%' },
          { label: 'Engagement Rate', value: `${(stats?.engagementRate || 0).toFixed(1)}%`, icon: TrendingUp, change: '+0.5%' },
        ].map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />{change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Posts</h2>
          <Link to="/compose" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            + New Post
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <PenSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No posts yet. Create your first post!</p>
            </div>
          ) : (
            recentPosts.map((post: any) => (
              <div key={post.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{post.contentGlobal || 'Untitled'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' :
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {post.status}
                    </span>
                    {post.variants?.map((v: any) => (
                      <span key={v.id} className="text-xs text-gray-400">{v.platform}</span>
                    ))}
                  </div>
                </div>
                <MessageCircle className="w-4 h-4 text-gray-300" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
