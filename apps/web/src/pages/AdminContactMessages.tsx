import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Clock, RefreshCw } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/contact-messages');
      setMessages(data);
    } catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-7 h-7 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">Support Messages</h1>
        </div>
        <button onClick={loadMessages} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{msg.subject}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="font-medium text-gray-700">{msg.name}</span>
                    <span>{msg.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
