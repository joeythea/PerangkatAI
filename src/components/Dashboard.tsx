import { 
  Image, 
  Video, 
  Presentation, 
  Bot, 
  TrendingUp, 
  Clock, 
  Zap,
  ArrowRight,
  Star,
  Activity
} from 'lucide-react';
import { Page } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const tools = [
    {
      id: 'image-editor' as Page,
      title: 'Image Editor',
      description: 'Edit gambar dengan AI - crop, filter, enhance, remove background, dan lainnya',
      icon: Image,
      color: 'from-pink-500 to-rose-600',
      shadowColor: 'shadow-pink-500/20',
      stats: '12 fitur AI'
    },
    {
      id: 'video-editor' as Page,
      title: 'Video Editor',
      description: 'Edit video profesional - trim, split, effects, transitions, dan AI enhancement',
      icon: Video,
      color: 'from-blue-500 to-cyan-600',
      shadowColor: 'shadow-blue-500/20',
      stats: '8 fitur AI'
    },
    {
      id: 'ppt-maker' as Page,
      title: 'PPT Maker',
      description: 'Buat presentasi otomatis dengan AI - template, layout, dan desain cerdas',
      icon: Presentation,
      color: 'from-purple-500 to-violet-600',
      shadowColor: 'shadow-purple-500/20',
      stats: '15 template'
    },
    {
      id: 'ai-manager' as Page,
      title: 'AI Manager',
      description: 'Kelola semua integrasi AI - ChatGPT, DALL-E, Midjourney, Stable Diffusion',
      icon: Bot,
      color: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/20',
      stats: '6 AI Tools'
    },
  ];

  const recentActivity = [
    { action: 'Enhanced image', detail: 'photo_landscape.jpg', time: '2 min ago', icon: '🖼️' },
    { action: 'Generated PPT', detail: 'Business Proposal', time: '15 min ago', icon: '📊' },
    { action: 'Video trimmed', detail: 'vacation_clip.mp4', time: '1 hour ago', icon: '🎬' },
    { action: 'AI Chat used', detail: 'ChatGPT-4', time: '2 hours ago', icon: '🤖' },
    { action: 'Background removed', detail: 'product_shot.png', time: '3 hours ago', icon: '✨' },
  ];

  const stats = [
    { label: 'Projects Created', value: '24', change: '+3 this week', icon: TrendingUp },
    { label: 'AI Operations', value: '156', change: '+28 today', icon: Zap },
    { label: 'Time Saved', value: '12h', change: 'vs manual work', icon: Clock },
    { label: 'Active Tools', value: '6', change: 'all connected', icon: Activity },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Selamat datang kembali! Kelola semua creative tools Anda di sini.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Star size={16} className="text-indigo-400" />
          <span className="text-sm text-indigo-300">Pro Plan</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-4 slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Icon size={20} className="text-indigo-400" />
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Creative Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className={`glass-card p-6 text-left hover:scale-[1.02] transition-all duration-300 group ${tool.shadowColor} hover:shadow-xl slide-in`}
                style={{ animationDelay: `${idx * 0.1 + 0.3}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg ${tool.shadowColor}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <ArrowRight size={20} className="text-gray-500 group-hover:text-indigo-400 transition-colors mt-1" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">{tool.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Zap size={12} className="text-yellow-400" />
                  <span className="text-xs text-gray-500">{tool.stats}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.detail}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
