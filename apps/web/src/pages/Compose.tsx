import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Clock, Wand2, Hash, Image, Globe, Sparkles,
  Facebook, Instagram, Linkedin, Twitter
} from 'lucide-react';
import { usePostStore } from '../stores/postStore';
import * as aiApi from '../api/ai.api';
import toast from 'react-hot-toast';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', maxLen: 63206 },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F', maxLen: 2200 },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#000000', maxLen: 280 },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', maxLen: 3000 },
];

export default function Compose() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { createPost } = usePostStore();
  const navigate = useNavigate();

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerateCaption = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const { data } = await aiApi.generateCaption({
        topic: aiTopic,
        platform: selectedPlatforms[0],
      });
      setContent(data.caption);
      toast.success('Caption generated!');
    } catch {
      toast.error('AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateHashtags = async () => {
    if (!content.trim()) return;
    setAiLoading(true);
    try {
      const { data } = await aiApi.generateHashtags({
        content,
        platform: selectedPlatforms[0],
      });
      setContent(prev => prev + '\n\n' + data.hashtags.join(' '));
      toast.success('Hashtags added!');
    } catch {
      toast.error('Hashtag generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePublish = async (publishNow: boolean) => {
    if (!content.trim()) { toast.error('Write something first!'); return; }
    if (selectedPlatforms.length === 0) { toast.error('Select at least one platform'); return; }

    try {
      const scheduledAt = scheduleDate && scheduleTime
        ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
        : undefined;

      await createPost({
        contentGlobal: content,
        platforms: selectedPlatforms.map(id => ({ accountId: id })),
        scheduledAt: publishNow ? undefined : scheduledAt,
        publishNow,
      });
      toast.success(publishNow ? 'Post published!' : 'Post scheduled!');
      navigate('/');
    } catch {
      toast.error('Failed to create post');
    }
  };

  const shortestMaxLen = selectedPlatforms.reduce((min, id) => {
    const p = platforms.find(pl => pl.id === id);
    return p ? Math.min(min, p.maxLen) : min;
  }, Infinity);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Compose Post</h1>

      {/* Platform Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Platforms</h3>
        <div className="flex gap-3">
          {platforms.map(({ id, name, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => togglePlatform(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                selectedPlatforms.includes(id)
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" style={{ color: selectedPlatforms.includes(id) ? color : undefined }} />
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Composer */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind? Write your post here..."
              className="w-full h-48 resize-none border-0 focus:ring-0 outline-none text-gray-900 placeholder-gray-400 text-base"
            />
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Image className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAI(!showAI)}
                  className={`p-2 rounded-lg text-gray-500 ${showAI ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100'}`}
                >
                  <Sparkles className="w-5 h-5" />
                </button>
                <button
                  onClick={handleGenerateHashtags}
                  disabled={aiLoading || !content}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                >
                  <Hash className="w-5 h-5" />
                </button>
              </div>
              <span className={`text-sm ${
                content.length > (shortestMaxLen === Infinity ? 99999 : shortestMaxLen) ? 'text-red-500' : 'text-gray-400'
              }`}>
                {content.length}{shortestMaxLen !== Infinity ? ` / ${shortestMaxLen}` : ''}
              </span>
            </div>
          </div>

          {/* AI Panel */}
          {showAI && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
              <h3 className="text-sm font-medium text-purple-900 mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> AI Content Generator
              </h3>
              <div className="flex gap-3">
                <input
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="Describe your topic (e.g., 'New product launch for eco-friendly water bottles')"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
                <button
                  onClick={handleGenerateCaption}
                  disabled={aiLoading || !aiTopic}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {aiLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          )}

          {/* Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Schedule
            </h3>
            <div className="flex gap-3">
              <input
                type="date"
                value={scheduleDate}
                onChange={e => setScheduleDate(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
              <input
                type="time"
                value={scheduleTime}
                onChange={e => setScheduleTime(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Preview
            </h3>
            {selectedPlatforms.length === 0 ? (
              <p className="text-sm text-gray-400">Select a platform to preview</p>
            ) : (
              <div className="space-y-4">
                {selectedPlatforms.map(id => {
                  const platform = platforms.find(p => p.id === id)!;
                  return (
                    <div key={id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
                        <span className="text-xs font-medium text-gray-600">{platform.name}</span>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {content || 'Your post will appear here...'}
                      </p>
                      {content.length > platform.maxLen && (
                        <p className="text-xs text-red-500 mt-2">
                          Exceeds {platform.name} limit by {content.length - platform.maxLen} chars
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => handlePublish(true)}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" /> Publish Now
            </button>
            <button
              onClick={() => handlePublish(false)}
              disabled={!scheduleDate || !scheduleTime}
              className="w-full py-3 bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-50 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Clock className="w-4 h-4" /> Schedule Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
