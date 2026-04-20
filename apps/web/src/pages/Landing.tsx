import { Link } from 'react-router-dom';
import {
  Zap, Calendar, BarChart3, Users, Globe, Video, Sparkles, Shield, Clock,
  CheckCircle, ArrowRight, Star, MessageSquare, Layers, Palette, Languages,
  ChevronDown, ChevronUp, Lock, Check, X as XIcon, Bell
} from 'lucide-react';
import { useState } from 'react';

const platforms = [
  { name: 'Facebook Pages', icon: '📄', color: '#1877F2' },
  { name: 'Facebook Groups', icon: '👥', color: '#1877F2' },
  { name: 'Facebook Profiles', icon: '👤', color: '#1877F2' },
  { name: 'Instagram', icon: '📷', color: '#E4405F' },
  { name: 'YouTube', icon: '🎬', color: '#FF0000' },
  { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  { name: 'TikTok', icon: '🎵', color: '#000000' },
  { name: 'Pinterest', icon: '📌', color: '#BD081C' },
];

const features = [
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Schedule posts across all platforms with a visual calendar. Drag and drop to reschedule instantly.' },
  { icon: Sparkles, title: 'AI Content Generation', desc: 'Generate captions, hashtags, and content ideas powered by OpenAI and Claude AI.' },
  { icon: Video, title: 'Video Scheduling', desc: 'Upload videos, schedule them across channels, and auto-delete after posting to save storage.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track engagement, reach, impressions, and growth across all your social accounts.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite team members with role-based access. Approval workflows keep your brand safe.' },
  { icon: Globe, title: 'Multi-Platform Posting', desc: 'Post to Facebook pages, groups, profiles, YouTube, Instagram, LinkedIn, TikTok, and Pinterest.' },
  { icon: Layers, title: 'Content Calendar', desc: 'Bird\'s eye view of all scheduled content. Plan weeks and months ahead with ease.' },
  { icon: MessageSquare, title: 'Unified Inbox', desc: 'Manage comments, messages, and replies from all platforms in one place.' },
  { icon: Palette, title: 'Custom Themes', desc: '8 beautiful color themes. Customize the look of your dashboard to match your brand.' },
  { icon: Languages, title: '10 Languages', desc: 'Full interface in English, Urdu (Nastaliq), Hindi, Punjabi, Swedish, Arabic, and more.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your API keys are encrypted. No data sharing. Full control over your credentials.' },
  { icon: Clock, title: 'Auto-Delete Videos', desc: 'Videos are automatically removed after scheduled posting to keep your storage clean.' },
];

const steps = [
  { num: '1', title: 'Connect Your Accounts', desc: 'Add your Facebook pages, YouTube channels, Instagram, and other social accounts in seconds.' },
  { num: '2', title: 'Create Your Content', desc: 'Write posts, generate AI captions, upload images and videos. Preview how they\'ll look on each platform.' },
  { num: '3', title: 'Schedule & Publish', desc: 'Pick the perfect time, schedule across all platforms at once, and watch your engagement grow.' },
];

const comparison = [
  { feature: 'Starting Price', nw: 'Free', buffer: '$6/mo', hootsuite: '$99/mo', later: '$25/mo' },
  { feature: 'Pro Plan', nw: '$5/mo', buffer: '$6/mo', hootsuite: '$99/mo', later: '$25/mo' },
  { feature: 'Team Plan (5 users)', nw: '$10/mo', buffer: '$12/mo', hootsuite: '$249/mo', later: '$80/mo' },
  { feature: 'Social Platforms', nw: '6+', buffer: '6', hootsuite: '10+', later: '4' },
  { feature: 'Facebook Pages', nw: true, buffer: true, hootsuite: true, later: false },
  { feature: 'Facebook Groups', nw: true, buffer: false, hootsuite: true, later: false },
  { feature: 'Multiple FB Profiles', nw: true, buffer: false, hootsuite: false, later: false },
  { feature: 'YouTube Channels', nw: true, buffer: false, hootsuite: true, later: false },
  { feature: 'AI Content Generation', nw: true, buffer: true, hootsuite: true, later: true },
  { feature: 'Video Scheduling', nw: true, buffer: true, hootsuite: true, later: true },
  { feature: 'Auto-Delete Videos', nw: true, buffer: false, hootsuite: false, later: false },
  { feature: 'Multi-Language (10)', nw: true, buffer: false, hootsuite: false, later: false },
  { feature: 'Custom Themes', nw: true, buffer: false, hootsuite: false, later: false },
  { feature: 'Self-Hosted Option', nw: true, buffer: false, hootsuite: false, later: false },
  { feature: 'Unified Inbox', nw: true, buffer: false, hootsuite: true, later: false },
  { feature: 'Team Approval Workflow', nw: true, buffer: true, hootsuite: true, later: true },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Digital Marketing Manager', text: 'NewsWalla replaced both Buffer and Hootsuite for us. The AI content generation saves us hours every week, and the multi-language support is perfect for our global campaigns.', stars: 5 },
  { name: 'Ahmed R.', role: 'Social Media Consultant', text: 'Finally a scheduler that supports Urdu with proper Nastaliq font! My Pakistani clients love it. The ability to manage multiple Facebook pages and groups from one dashboard is a game changer.', stars: 5 },
  { name: 'Lisa M.', role: 'Small Business Owner', text: 'At $5/month for the Pro plan, it is an absolute steal compared to Hootsuite at $99. I manage 4 social accounts and the scheduling calendar makes my life so much easier.', stars: 5 },
  { name: 'Johan S.', role: 'Content Creator, Sweden', text: 'Love the Swedish language support and the video scheduling feature. Upload once, post everywhere. The auto-delete keeps my server clean. Highly recommended!', stars: 5 },
];

const faqs = [
  { q: 'What platforms does NewsWalla support?', a: 'NewsWalla supports Facebook (pages, groups, and personal profiles), Instagram, YouTube, LinkedIn, TikTok, and Pinterest. You can connect multiple accounts per platform.' },
  { q: 'How does the AI content generation work?', a: 'NewsWalla integrates with OpenAI (GPT) and Anthropic (Claude) to generate post captions, hashtags, and content ideas. Just describe what you want and the AI creates platform-optimized content for you.' },
  { q: 'Can I manage multiple Facebook pages?', a: 'Yes! You can connect unlimited Facebook pages, groups, and profiles. Each one shows separately so you can choose exactly which ones to post to.' },
  { q: 'What languages are supported?', a: 'The full interface is available in 10 languages: English, Urdu (with Nastaliq font), Hindi, Punjabi, Swedish, Pahari, Gujarati, Kashmiri, Persian, and Arabic. RTL languages are fully supported.' },
  { q: 'Is there a free plan?', a: 'Yes! The free plan includes 5 scheduled posts per month and 2 social accounts. No credit card required.' },
  { q: 'What is the video auto-delete feature?', a: 'When you schedule a video post, NewsWalla automatically deletes the uploaded video file from the server after it has been published to all selected platforms. This saves storage space.' },
  { q: 'Can I self-host NewsWalla?', a: 'Yes! NewsWalla runs on your own server with SQLite - no external database needed. You have full control over your data and API keys.' },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NewsWalla</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#platforms" className="hover:text-gray-900 transition-colors">Platforms</a>
            <a href="#comparison" className="hover:text-gray-900 transition-colors">Compare</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> AI-Powered Social Media Scheduler
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight max-w-4xl mx-auto">
            Schedule to <span className="text-blue-600">Every Platform</span> from One Dashboard
          </h1>
          <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
            Manage Facebook pages, groups, profiles, YouTube, Instagram, LinkedIn, TikTok, and Pinterest.
            AI-powered content. 10 languages. Starting at $0.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link to="/register" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 text-lg">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#pricing" className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-lg">
              View Pricing
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> 5 free posts/month</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Cancel anytime</span>
          </div>

          {/* Platform logos row */}
          <div className="flex items-center justify-center gap-4 mt-14 flex-wrap">
            {platforms.map(p => (
              <div key={p.name} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xl">{p.icon}</span>
                <span className="text-sm font-medium text-gray-700">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '6+', label: 'Social Platforms' },
            { value: '10', label: 'Languages' },
            { value: '8', label: 'Color Themes' },
            { value: '$5', label: 'Pro Plan / month' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Everything You Need to Dominate Social</h2>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">Powerful features that save you time and grow your audience across every platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <f.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">One Dashboard. Every Platform.</h2>
            <p className="text-gray-600 mt-4 text-lg">Connect multiple accounts per platform. Manage all your pages, groups, channels, and profiles.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platforms.map(p => (
              <div key={p.name} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-lg transition-all">
                <span className="text-4xl block mb-3">{p.icon}</span>
                <h3 className="font-bold text-gray-900">{p.name}</h3>
                <div className="w-full h-1.5 rounded-full mt-3" style={{ backgroundColor: p.color + '30' }}>
                  <div className="h-full rounded-full w-full" style={{ backgroundColor: p.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Get Started in 3 Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(s => (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-extrabold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                  {s.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">How We Compare</h2>
            <p className="text-gray-600 mt-4 text-lg">More features, lower price. See how NewsWalla stacks up against the competition.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Feature</th>
                    <th className="px-6 py-4 text-sm font-bold text-blue-600 bg-blue-50">NewsWalla</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Buffer</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Hootsuite</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">Later</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparison.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-3 text-center bg-blue-50/50">
                        {typeof row.nw === 'boolean'
                          ? row.nw ? <CheckCircle className="w-5 h-5 text-blue-600 mx-auto" /> : <XIcon className="w-5 h-5 text-gray-300 mx-auto" />
                          : <span className="text-sm font-bold text-blue-700">{row.nw}</span>}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.buffer === 'boolean'
                          ? row.buffer ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <XIcon className="w-5 h-5 text-gray-300 mx-auto" />
                          : <span className="text-sm text-gray-600">{row.buffer}</span>}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.hootsuite === 'boolean'
                          ? row.hootsuite ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <XIcon className="w-5 h-5 text-gray-300 mx-auto" />
                          : <span className="text-sm text-gray-600">{row.hootsuite}</span>}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.later === 'boolean'
                          ? row.later ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <XIcon className="w-5 h-5 text-gray-300 mx-auto" />
                          : <span className="text-sm text-gray-600">{row.later}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 mt-4 text-lg">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 p-8 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Free</h3>
              <p className="text-4xl font-extrabold text-gray-900 mt-4">$0<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm mt-2">Perfect for getting started</p>
              <ul className="mt-6 space-y-3">
                {['5 scheduled posts/month', '2 social accounts', 'Basic analytics', 'Single user', 'Community support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block w-full text-center mt-8 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-blue-600 p-8 bg-blue-50 relative shadow-xl shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Most Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              <p className="text-4xl font-extrabold text-gray-900 mt-4">$5<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-blue-600 text-sm mt-2 font-medium">Best for individuals and creators</p>
              <ul className="mt-6 space-y-3">
                {['Unlimited scheduled posts', 'Unlimited social accounts', 'Advanced analytics', 'AI content generation', 'Video scheduling + auto-delete', 'Unified inbox', '10 languages + RTL', 'Custom themes', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block w-full text-center mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Start Pro
              </Link>
            </div>

            {/* Team */}
            <div className="rounded-2xl border-2 border-purple-500 p-8 bg-purple-50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                <Users className="w-3 h-3" /> Best Value
              </div>
              <h3 className="text-xl font-bold text-gray-900">Team</h3>
              <p className="text-4xl font-extrabold text-gray-900 mt-4">$10<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-purple-600 text-sm mt-2 font-medium">$2/user - for teams of 5</p>
              <ul className="mt-6 space-y-3">
                {['Everything in Pro', '5 team members', 'Team collaboration', 'Approval workflows', 'Shared content calendar', 'Role-based access', 'Dedicated support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block w-full text-center mt-8 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                Start Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">AI-Powered Content Creation</h2>
          <p className="text-blue-100 mt-4 text-lg max-w-2xl mx-auto">
            Stop staring at a blank screen. Let AI generate engaging captions, smart hashtags, and platform-optimized content.
            Supports OpenAI GPT and Anthropic Claude.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'Generate Captions', desc: 'Describe your post and get multiple caption options instantly' },
              { title: 'Smart Hashtags', desc: 'AI suggests relevant hashtags based on your content and industry' },
              { title: 'Rewrite & Optimize', desc: 'Transform any text into platform-perfect copy for each network' },
            ].map(a => (
              <div key={a.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-left border border-white/20">
                <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
                <p className="text-blue-100 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approval Workflow Feature */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" /> Team Feature
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Editor & Admin Approval Workflow
              </h2>
              <p className="text-gray-600 mt-4 text-lg leading-relaxed">
                Keep your brand safe with a powerful two-level approval system.
                Editors create and schedule content, while Admins review and approve before anything goes live.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { title: 'Editors Upload & Schedule', desc: 'Team members create posts, select platforms, and set schedules. Posts are held for review.' },
                  { title: 'Admins Approve or Reject', desc: 'Admins receive instant notifications. Review content, approve to publish, or reject with feedback.' },
                  { title: 'Real-Time Notifications', desc: 'Both editors and admins get notified at every step. Never miss an approval request.' },
                  { title: 'Full Audit Trail', desc: 'Track who submitted, who approved, and when. Complete transparency for your team.' },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
              <div className="space-y-4">
                {/* Mock approval cards */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold">E</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Editor submitted a post</p>
                        <p className="text-xs text-gray-400">2 minutes ago</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">"Check out our latest product launch! Available now on..."</p>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg">Approve</button>
                    <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg">Reject</button>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">A</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Admin approved post</p>
                        <p className="text-xs text-gray-400">5 minutes ago</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Approved</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">"Great content! Approved for publishing on all channels."</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 opacity-70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-bold">N</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Notification sent to editor</p>
                        <p className="text-xs text-gray-400">5 minutes ago</p>
                      </div>
                    </div>
                    <Bell className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Loved by Social Media Managers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">See How It Works</h2>
            <p className="text-gray-600 mt-4 text-lg">Step-by-step screenshots showing you how easy it is to use NewsWalla.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Dashboard Overview', desc: 'Your central hub showing all scheduled posts, analytics, and quick actions.' },
              { num: 2, title: 'Connect Accounts', desc: 'Add Facebook pages, YouTube channels, Instagram and more in settings.' },
              { num: 3, title: 'Compose a Post', desc: 'Write content, add media, select platforms and schedule for the best time.' },
              { num: 4, title: 'Content Calendar', desc: 'Drag and drop posts on the visual calendar. See your week at a glance.' },
              { num: 5, title: 'AI Content Generator', desc: 'Enter a topic and get AI-generated captions optimized for each platform.' },
              { num: 6, title: 'Approval Workflow', desc: 'Editors submit posts. Admins review, approve, or reject with comments.' },
              { num: 7, title: 'Analytics Dashboard', desc: 'Track engagement, reach, and growth across all connected platforms.' },
              { num: 8, title: 'Team Management', desc: 'Add team members, assign roles, and manage access permissions.' },
            ].map(tut => (
              <div key={tut.num} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-2">
                      {tut.num}
                    </div>
                    <p className="text-xs text-blue-600 font-medium">Screenshot</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900">{tut.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tut.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: Lock, label: 'SSL Encrypted' },
            { icon: Shield, label: 'GDPR Ready' },
            { icon: Globe, label: '10 Languages' },
            { icon: Zap, label: 'AI Powered' },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-2 text-gray-500 text-sm">
              <b.icon className="w-5 h-5" />
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Simplify Your Social Media?</h2>
          <p className="text-gray-400 mt-4 text-lg">Join thousands of creators and businesses who trust NewsWalla to manage their social presence.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link to="/register" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 text-lg">
              Start Free Today <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-bold text-white">NewsWalla</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The AI-powered social media scheduler that helps you manage all your platforms from one beautiful dashboard.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#comparison" className="hover:text-white transition-colors">Compare</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platforms</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>YouTube</li>
                <li>LinkedIn</li>
                <li>TikTok</li>
                <li>Pinterest</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li>API Documentation</li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500 space-y-1">
            <p>&copy; {new Date().getFullYear()} NewsWalla. All rights reserved.</p>
            <p className="text-gray-600">Developed by Bergman Coding AB, Sweden</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
