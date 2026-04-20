import { useEffect, useState } from 'react';
import { Inbox, Mail, MailOpen, Archive } from 'lucide-react';
import api from '../api/client';

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/inbox').then(r => {
      setMessages(r.data.messages || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await api.put(`/inbox/${id}/read`);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const archiveMessage = async (id: string) => {
    await api.put(`/inbox/${id}/archive`);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const selected = messages.find(m => m.id === selectedId);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading inbox...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Unified Inbox</h1>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Inbox className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inbox is empty</h3>
          <p className="text-gray-500">Comments, DMs, and mentions from your connected platforms will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Message List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => { setSelectedId(msg.id); markRead(msg.id); }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                    selectedId === msg.id ? 'bg-brand-50' : ''
                  } ${!msg.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.is_read ? (
                      <MailOpen className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Mail className="w-4 h-4 text-brand-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900 truncate">{msg.sender_name || 'Unknown'}</span>
                    <span className="text-xs text-gray-400 ml-auto capitalize">{msg.platform}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.content || '(no content)'}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            {selected ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{selected.sender_name}</h3>
                    <p className="text-sm text-gray-500">@{selected.sender_username} on {selected.platform}</p>
                  </div>
                  <button
                    onClick={() => archiveMessage(selected.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    <Archive className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{selected.content}</p>
                </div>
                <div className="mt-4">
                  <textarea
                    placeholder="Type your reply..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm resize-none h-24"
                  />
                  <button className="mt-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Select a message to view
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
