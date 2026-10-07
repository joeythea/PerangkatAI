import { useState } from 'react';
import {
  Bot, Settings, Zap, Check, X, Plus, ExternalLink,
  Key, RefreshCw, Trash2, Eye, EyeOff, Activity,
  MessageSquare, Image as ImageIcon, Video, FileText,
  Globe, Shield, Clock, TrendingUp, BarChart3,
  ChevronDown, ChevronUp, ToggleLeft, ToggleRight
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey: string;
  lastUsed: string;
  usageCount: number;
  color: string;
  features: string[];
}

interface UsageLog {
  id: string;
  tool: string;
  action: string;
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  tokens?: number;
}

export default function AIManager() {
  const [aiTools, setAiTools] = useState<AITool[]>([
    {
      id: '1',
      name: 'ChatGPT-4',
      description: 'Advanced language model for text generation, analysis, and conversation',
      category: 'Text Generation',
      icon: '🧠',
      status: 'connected',
      apiKey: 'sk-••••••••••••abcd1234',
      lastUsed: '2 min ago',
      usageCount: 245,
      color: 'from-green-500 to-emerald-600',
      features: ['Text Generation', 'Code Writing', 'Analysis', 'Translation'],
    },
    {
      id: '2',
      name: 'DALL-E 3',
      description: 'AI image generation from text descriptions with high quality output',
      category: 'Image Generation',
      icon: '🎨',
      status: 'connected',
      apiKey: 'sk-••••••••••••efgh5678',
      lastUsed: '15 min ago',
      usageCount: 89,
      color: 'from-pink-500 to-rose-600',
      features: ['Image Generation', 'Style Transfer', 'Editing', 'Variation'],
    },
    {
      id: '3',
      name: 'Midjourney',
      description: 'Artistic AI image generation with unique aesthetic styles',
      category: 'Image Generation',
      icon: '🖼️',
      status: 'connected',
      apiKey: 'mj-••••••••••••ijkl9012',
      lastUsed: '1 hour ago',
      usageCount: 156,
      color: 'from-blue-500 to-indigo-600',
      features: ['Artistic Images', 'Concepts', 'Illustrations', 'Photography'],
    },
    {
      id: '4',
      name: 'Stable Diffusion',
      description: 'Open-source image generation model with full customization',
      category: 'Image Generation',
      icon: '🌀',
      status: 'connected',
      apiKey: 'sd-••••••••••••mnop3456',
      lastUsed: '3 hours ago',
      usageCount: 67,
      color: 'from-purple-500 to-violet-600',
      features: ['Custom Models', 'Inpainting', 'Outpainting', 'ControlNet'],
    },
    {
      id: '5',
      name: 'Whisper AI',
      description: 'Speech recognition and audio transcription with multi-language support',
      category: 'Audio Processing',
      icon: '🎤',
      status: 'disconnected',
      apiKey: '',
      lastUsed: '2 days ago',
      usageCount: 34,
      color: 'from-orange-500 to-amber-600',
      features: ['Transcription', 'Translation', 'Subtitles', 'Voice Commands'],
    },
    {
      id: '6',
      name: 'Runway ML',
      description: 'AI video generation and editing with advanced motion capabilities',
      category: 'Video Processing',
      icon: '🎬',
      status: 'connected',
      apiKey: 'rw-••••••••••••qrst7890',
      lastUsed: '30 min ago',
      usageCount: 42,
      color: 'from-cyan-500 to-teal-600',
      features: ['Video Generation', 'Motion', 'Effects', 'Green Screen'],
    },
  ]);

  const [usageLogs] = useState<UsageLog[]>([
    { id: '1', tool: 'ChatGPT-4', action: 'Generate blog post outline', timestamp: '2 min ago', status: 'success', tokens: 1250 },
    { id: '2', tool: 'DALL-E 3', action: 'Create product mockup', timestamp: '15 min ago', status: 'success', tokens: 0 },
    { id: '3', tool: 'Runway ML', action: 'Generate video intro', timestamp: '30 min ago', status: 'success', tokens: 0 },
    { id: '4', tool: 'ChatGPT-4', action: 'Translate document', timestamp: '1 hour ago', status: 'success', tokens: 3400 },
    { id: '5', tool: 'Midjourney', action: 'Create logo concepts', timestamp: '1 hour ago', status: 'success', tokens: 0 },
    { id: '6', tool: 'Whisper AI', action: 'Transcribe meeting', timestamp: '2 hours ago', status: 'error', tokens: 0 },
    { id: '7', tool: 'Stable Diffusion', action: 'Generate background', timestamp: '3 hours ago', status: 'success', tokens: 0 },
  ]);

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'tools' | 'logs' | 'settings'>('tools');
  const [newToolModal, setNewToolModal] = useState(false);

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleToolStatus = (id: string) => {
    setAiTools(prev => prev.map(tool => {
      if (tool.id === id) {
        return { ...tool, status: tool.status === 'connected' ? 'disconnected' : 'connected' };
      }
      return tool;
    }));
  };

  const removeTool = (id: string) => {
    setAiTools(prev => prev.filter(tool => tool.id !== id));
  };

  const totalUsage = aiTools.reduce((sum, tool) => sum + tool.usageCount, 0);
  const connectedTools = aiTools.filter(t => t.status === 'connected').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Manager</h1>
            <p className="text-xs text-gray-400">Manage and monitor all AI integrations</p>
          </div>
        </div>
        <button
          onClick={() => setNewToolModal(true)}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add AI Tool
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{connectedTools}</p>
              <p className="text-xs text-gray-400">Connected Tools</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalUsage}</p>
              <p className="text-xs text-gray-400">Total Operations</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Clock size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">98%</p>
              <p className="text-xs text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12.5K</p>
              <p className="text-xs text-gray-400">Tokens Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
        {(['tools', 'logs', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiTools.map(tool => (
            <div
              key={tool.id}
              className={`glass-card p-5 transition-all hover:scale-[1.02] cursor-pointer ${
                selectedTool === tool.id ? 'ring-2 ring-emerald-500/50' : ''
              }`}
              onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{tool.name}</h3>
                    <p className="text-[10px] text-gray-500">{tool.category}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                  tool.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' :
                  tool.status === 'error' ? 'bg-red-500/10 text-red-400' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    tool.status === 'connected' ? 'bg-emerald-400' :
                    tool.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                  }`} />
                  {tool.status}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{tool.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {tool.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><Zap size={10} /> {tool.usageCount} uses</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {tool.lastUsed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleToolStatus(tool.id); }}
                    className={`p-1 rounded transition-colors ${
                      tool.status === 'connected' ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-500 hover:bg-white/5'
                    }`}
                  >
                    {tool.status === 'connected' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTool(tool.id); }}
                    className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedTool === tool.id && (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-2 slide-in">
                  <div className="flex items-center gap-2">
                    <Key size={12} className="text-gray-500" />
                    <span className="text-[10px] text-gray-400 flex-1 font-mono">
                      {showApiKey[tool.id] ? (tool.apiKey || 'No API key set') : tool.apiKey || 'No API key set'}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleApiKeyVisibility(tool.id); }}
                      className="p-1 rounded hover:bg-white/10 text-gray-500"
                    >
                      {showApiKey[tool.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10 flex items-center justify-center gap-1 transition-colors">
                      <Settings size={10} /> Configure
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10 flex items-center justify-center gap-1 transition-colors">
                      <RefreshCw size={10} /> Test
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10 flex items-center justify-center gap-1 transition-colors">
                      <ExternalLink size={10} /> Docs
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Usage Logs */}
      {activeTab === 'logs' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Usage History</h3>
          </div>
          <div className="divide-y divide-white/5">
            {usageLogs.map(log => (
              <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-emerald-400' :
                  log.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{log.action}</p>
                  <p className="text-xs text-gray-500">via {log.tool}</p>
                </div>
                {log.tokens ? (
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{log.tokens} tokens</span>
                ) : null}
                <span className="text-xs text-gray-500">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="glass-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Global Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm text-gray-200">Auto-retry on failure</p>
                  <p className="text-xs text-gray-500">Automatically retry failed API calls</p>
                </div>
                <ToggleRight size={24} className="text-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm text-gray-200">Rate limiting</p>
                  <p className="text-xs text-gray-500">Prevent API abuse with rate limits</p>
                </div>
                <ToggleRight size={24} className="text-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm text-gray-200">Usage notifications</p>
                  <p className="text-xs text-gray-500">Get notified when approaching limits</p>
                </div>
                <ToggleLeft size={24} className="text-gray-500" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm text-gray-200">Cache responses</p>
                  <p className="text-xs text-gray-500">Cache AI responses to reduce costs</p>
                </div>
                <ToggleRight size={24} className="text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5">
            <h3 className="text-sm font-semibold text-white mb-4">API Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Default Timeout (seconds)</label>
                <input type="number" defaultValue="30" className="w-full bg-black/30 rounded-lg p-2 text-sm text-white border border-white/5 focus:border-emerald-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Max Retries</label>
                <input type="number" defaultValue="3" className="w-full bg-black/30 rounded-lg p-2 text-sm text-white border border-white/5 focus:border-emerald-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Webhook URL</label>
                <input type="url" placeholder="https://your-webhook-url.com" className="w-full bg-black/30 rounded-lg p-2 text-sm text-white border border-white/5 focus:border-emerald-500/50 focus:outline-none placeholder-gray-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Tool Modal */}
      {newToolModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setNewToolModal(false)}>
          <div className="glass-card p-6 w-full max-w-md mx-4 slide-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Add New AI Tool</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tool Name</label>
                <input type="text" placeholder="e.g., Claude AI" className="w-full bg-black/30 rounded-lg p-2 text-sm text-white border border-white/5 focus:border-emerald-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                <select className="w-full bg-black/30 rounded-lg p-2 text-sm text-gray-300 border border-white/5 focus:outline-none">
                  <option>Text Generation</option>
                  <option>Image Generation</option>
                  <option>Video Processing</option>
                  <option>Audio Processing</option>
                  <option>Code Generation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">API Key</label>
                <input type="password" placeholder="Enter API key" className="w-full bg-black/30 rounded-lg p-2 text-sm text-white border border-white/5 focus:border-emerald-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">API Endpoint</label>
                <input type="url" placeholder="https://api.example.com/v1" className="w-full bg-black/30 rounded-lg p-2 text-sm text-white border border-white/5 focus:border-emerald-500/50 focus:outline-none placeholder-gray-600" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setNewToolModal(false)} className="flex-1 py-2 rounded-lg bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setNewToolModal(false)} className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                  Add Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
