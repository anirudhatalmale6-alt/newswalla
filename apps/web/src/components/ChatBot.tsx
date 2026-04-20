import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

// FAQ and Tutorial knowledge base
const knowledge = [
  { q: ['platform', 'support', 'social', 'facebook', 'instagram', 'youtube', 'linkedin', 'tiktok', 'pinterest'], a: 'NewsWalla supports Facebook (pages, groups, and personal profiles), Instagram, YouTube, LinkedIn, TikTok, and Pinterest. You can connect multiple accounts per platform.' },
  { q: ['ai', 'content', 'generate', 'caption', 'hashtag'], a: 'NewsWalla integrates with OpenAI (GPT) and Anthropic (Claude) to generate post captions, hashtags, and content ideas. Just describe what you want and the AI creates platform-optimized content for you.' },
  { q: ['multiple', 'page', 'group', 'profile', 'account'], a: 'Yes! You can connect unlimited Facebook pages, groups, and profiles. Each one shows separately so you can choose exactly which ones to post to.' },
  { q: ['language', 'urdu', 'hindi', 'arabic', 'swedish', 'rtl'], a: 'The full interface is available in 10 languages: English, Urdu (with Nastaliq font), Hindi, Punjabi, Swedish, Pahari, Gujarati, Kashmiri, Persian, and Arabic. RTL languages are fully supported.' },
  { q: ['free', 'plan', 'cost', 'price', 'pricing', 'subscription', 'pro', 'team'], a: 'We offer three plans: Free ($0 - 5 posts/month, 2 accounts), Pro ($5/month - unlimited everything + AI), and Team ($10/month - 5 team members with approval workflows).' },
  { q: ['video', 'auto-delete', 'delete', 'storage'], a: 'When you schedule a video post, NewsWalla automatically deletes the uploaded video file from the server after it has been published to all selected platforms. This saves storage space.' },
  { q: ['self-host', 'host', 'server', 'install', 'deploy'], a: 'Yes! NewsWalla runs on your own server with SQLite - no external database needed. You have full control over your data and API keys.' },
  { q: ['schedule', 'post', 'publish', 'time'], a: 'To schedule a post: 1) Go to Compose, 2) Write your content or use AI to generate it, 3) Select which platforms to post to, 4) Choose a date and time, 5) Click Schedule. Your post will be published automatically.' },
  { q: ['connect', 'add', 'account', 'setup'], a: 'To connect accounts: Go to Settings > Connected Accounts, click "Add Account", select the platform, and enter your credentials or authenticate via OAuth.' },
  { q: ['theme', 'color', 'appearance', 'dark', 'customize'], a: 'NewsWalla offers 8 color themes you can choose from. Go to Settings > Profile to pick your personal theme, or go to Admin > Color Theme to set the global default theme.' },
  { q: ['approval', 'approve', 'reject', 'editor', 'admin', 'workflow', 'team'], a: 'With the Team plan, Editors can create and schedule posts, but they need Admin approval before publishing. Admins receive notifications and can approve or reject posts with comments.' },
  { q: ['calendar', 'view', 'schedule', 'overview'], a: 'The Content Calendar gives you a bird\'s eye view of all scheduled content. You can see posts by day, week, or month, and drag-and-drop to reschedule.' },
  { q: ['analytics', 'stats', 'performance', 'engagement'], a: 'The Analytics dashboard tracks engagement, reach, impressions, and growth across all your connected platforms. View performance by post, platform, or time period.' },
  { q: ['inbox', 'message', 'comment', 'reply'], a: 'The Unified Inbox lets you manage comments, messages, and replies from all platforms in one place. Respond to your audience without switching between apps.' },
  { q: ['contact', 'support', 'help', 'issue', 'problem', 'bug'], a: 'You can reach our support team through the Contact Support page. Go to the main page footer and click "Contact Support", or navigate to /contact. We respond within 24 hours.' },
  { q: ['hello', 'hi', 'hey', 'help', 'start'], a: 'Hi! I\'m the NewsWalla assistant. I can help you with questions about features, pricing, platform connections, scheduling, and more. What would you like to know?' },
];

function findAnswer(query: string): string {
  const words = query.toLowerCase().split(/\s+/);
  let bestMatch = { score: 0, answer: '' };

  for (const item of knowledge) {
    let score = 0;
    for (const keyword of item.q) {
      for (const word of words) {
        if (word.includes(keyword) || keyword.includes(word)) {
          score++;
        }
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { score, answer: item.a };
    }
  }

  if (bestMatch.score > 0) return bestMatch.answer;
  return 'I\'m not sure about that. You can check our FAQ section on the main page, or contact our support team through the Contact Support form for detailed help. Is there anything else I can help with?';
}

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I\'m the NewsWalla assistant. Ask me anything about our features, pricing, or how to get started!' }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    const answer = findAnswer(input.trim());
    setMessages(prev => [...prev, userMsg, { role: 'bot', text: answer }]);
    setInput('');
  };

  return (
    <>
      {/* Chat button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 flex items-center justify-center transition-transform hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">NewsWalla Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-blue-500 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                    : 'bg-blue-600 text-white rounded-br-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about features, pricing..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button onClick={handleSend} className="px-3 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
