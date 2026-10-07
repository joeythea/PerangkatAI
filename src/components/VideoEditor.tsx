import { useState, useRef } from 'react';
import {
  Upload, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Scissors, Copy, Trash2, Wand2, Sparkles, Film, Clock,
  Type, Music, Layers, Download, RotateCw, Maximize2,
  ChevronUp, ChevronDown, Plus
} from 'lucide-react';

interface TimelineClip {
  id: string;
  name: string;
  start: number;
  duration: number;
  color: string;
  type: 'video' | 'audio' | 'text' | 'effect';
}

export default function VideoEditor() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [activePanel, setActivePanel] = useState<'effects' | 'text' | 'audio' | 'ai'>('effects');
  const [clips, setClips] = useState<TimelineClip[]>([
    { id: '1', name: 'Intro.mp4', start: 0, duration: 15, color: 'bg-blue-500', type: 'video' },
    { id: '2', name: 'Main Scene.mp4', start: 15, duration: 45, color: 'bg-purple-500', type: 'video' },
    { id: '3', name: 'Outro.mp4', start: 60, duration: 10, color: 'bg-cyan-500', type: 'video' },
    { id: '4', name: 'Background Music', start: 0, duration: 70, color: 'bg-green-500', type: 'audio' },
    { id: '5', name: 'Title Text', start: 2, duration: 8, color: 'bg-yellow-500', type: 'text' },
  ]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoLoaded(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addClip = (type: TimelineClip['type']) => {
    const newClip: TimelineClip = {
      id: Date.now().toString(),
      name: `New ${type}`,
      start: currentTime,
      duration: 10,
      color: type === 'video' ? 'bg-blue-500' : type === 'audio' ? 'bg-green-500' : type === 'text' ? 'bg-yellow-500' : 'bg-pink-500',
      type,
    };
    setClips([...clips, newClip]);
  };

  const deleteClip = (id: string) => {
    setClips(clips.filter(c => c.id !== id));
  };

  const handleAIProcess = () => {
    if (!aiPrompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`AI Video Processing: "${aiPrompt}"\n\nNote: This is a demo. In production, this would connect to AI video processing APIs.`);
    }, 2000);
  };

  const effects = [
    { name: 'Blur', icon: '🌫️', desc: 'Gaussian blur effect' },
    { name: 'Sharpen', icon: '🔍', desc: 'Enhance clarity' },
    { name: 'Glow', icon: '✨', desc: 'Add glow effect' },
    { name: 'Vignette', icon: '🔲', desc: 'Dark edges' },
    { name: 'Film Grain', icon: '🎞️', desc: 'Vintage texture' },
    { name: 'Color Grade', icon: '🎨', desc: 'Cinematic colors' },
    { name: 'Slow Motion', icon: '🐌', desc: '0.5x speed' },
    { name: 'Speed Ramp', icon: '⚡', desc: 'Dynamic speed' },
  ];

  const transitions = [
    { name: 'Fade', icon: '🌅' },
    { name: 'Dissolve', icon: '💫' },
    { name: 'Wipe', icon: '👉' },
    { name: 'Slide', icon: '➡️' },
    { name: 'Zoom', icon: '🔎' },
    { name: 'Spin', icon: '🔄' },
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-48px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Film size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Video Editor</h1>
            <p className="text-xs text-gray-400">Professional video editing with AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-sm flex items-center gap-2 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Panel */}
        <div className="w-64 flex-shrink-0 glass-card overflow-y-auto">
          <div className="flex border-b border-white/5">
            {(['effects', 'text', 'audio', 'ai'] as const).map(panel => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={`flex-1 py-3 text-xs font-medium capitalize transition-colors
                  ${activePanel === panel ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                {panel}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-3">
            {activePanel === 'effects' && (
              <>
                <p className="text-xs text-gray-400 font-medium">Video Effects</p>
                {effects.map((effect, idx) => (
                  <button key={idx} className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                    <span className="text-lg">{effect.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-gray-200">{effect.name}</p>
                      <p className="text-[10px] text-gray-500">{effect.desc}</p>
                    </div>
                  </button>
                ))}
                <p className="text-xs text-gray-400 font-medium pt-3">Transitions</p>
                <div className="grid grid-cols-3 gap-2">
                  {transitions.map((t, idx) => (
                    <button key={idx} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-[10px] text-gray-400">{t.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {activePanel === 'text' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 font-medium">Text Overlays</p>
                <input type="text" placeholder="Enter text..." className="w-full bg-black/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 border border-white/5 focus:border-blue-500/50 focus:outline-none" />
                <select className="w-full bg-black/30 rounded-lg p-2 text-xs text-gray-300 border border-white/5 focus:outline-none">
                  <option>Font: Inter</option>
                  <option>Font: Roboto</option>
                  <option>Font: Montserrat</option>
                  <option>Font: Playfair</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Size" defaultValue="24" className="bg-black/30 rounded-lg p-2 text-xs text-white border border-white/5 focus:outline-none" />
                  <input type="color" defaultValue="#ffffff" className="w-full h-8 rounded-lg bg-black/30 border border-white/5 cursor-pointer" />
                </div>
                <button onClick={() => addClip('text')} className="w-full py-2 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/30 flex items-center justify-center gap-2 transition-colors">
                  <Plus size={12} /> Add Text Layer
                </button>
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-gray-400">Text Templates:</p>
                  {['Title', 'Subtitle', 'Lower Third', 'Caption', 'Credits'].map((tmpl, idx) => (
                    <button key={idx} className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 text-left transition-colors">
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === 'audio' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 font-medium">Audio Tracks</p>
                <button onClick={() => addClip('audio')} className="w-full py-2 rounded-lg bg-green-500/20 text-green-300 text-xs font-medium hover:bg-green-500/30 flex items-center justify-center gap-2 transition-colors">
                  <Music size={12} /> Add Audio Track
                </button>
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-gray-400">Sound Library:</p>
                  {['Upbeat Corporate', 'Cinematic Epic', 'Chill Lo-Fi', 'Acoustic Guitar', 'Electronic Beat', 'Nature Ambience'].map((sound, idx) => (
                    <button key={idx} className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-xs text-gray-300">{sound}</span>
                      <Play size={10} className="text-gray-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === 'ai' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-300 font-medium mb-2">🤖 AI Video Tools</p>
                  <textarea
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Describe AI video processing... (e.g., 'Auto-caption', 'Remove background noise', 'Generate B-roll')"
                    className="w-full bg-black/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 resize-none h-20 border border-white/5 focus:border-blue-500/50 focus:outline-none"
                  />
                  <button
                    onClick={handleAIProcess}
                    disabled={!aiPrompt.trim() || isProcessing}
                    className="w-full mt-2 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 size={12} /> Process with AI
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">Quick AI Actions:</p>
                  {['🎤 Auto Subtitles', '🔇 Remove Noise', '🎬 Auto Edit', '🖼️ Generate Thumbnail', '📝 Summarize Content', '🌐 Auto Translate'].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiPrompt(action.slice(2))}
                      className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 text-left transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Preview & Timeline */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Preview */}
          <div className="flex-1 glass-card flex items-center justify-center canvas-grid relative overflow-hidden">
            {videoLoaded ? (
              <div className="text-center">
                <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                  <Film size={40} className="text-blue-400" />
                </div>
                <p className="text-sm text-gray-400">Video Preview</p>
                <p className="text-xs text-gray-500 mt-1">1920 × 1080 • 30fps</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 flex items-center justify-center mx-auto mb-4">
                  <Upload size={32} className="text-blue-400" />
                </div>
                <p className="text-gray-400 mb-2">Upload a video to start editing</p>
                <p className="text-xs text-gray-500 mb-4">Supports MP4, MOV, AVI, WebM</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Choose Video
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
          </div>

          {/* Controls */}
          <div className="glass-card p-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentTime(0)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <SkipBack size={16} />
                </button>
                <button onClick={togglePlay} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={() => setCurrentTime(duration)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <SkipForward size={16} />
                </button>
              </div>
              
              <span className="text-xs text-gray-400 font-mono w-20">{formatTime(currentTime)} / {formatTime(duration)}</span>
              
              <div className="flex-1 relative h-8 flex items-center">
                <div className="w-full h-1.5 bg-white/10 rounded-full relative cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(x * duration);
                }}>
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={e => setVolume(+e.target.value)} className="w-16" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-48 glass-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Timeline</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => addClip('video')} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Add clip">
                  <Plus size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Split">
                  <Scissors size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Copy">
                  <Copy size={14} />
                </button>
                <button onClick={() => selectedClip && deleteClip(selectedClip)} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {/* Time ruler */}
              <div className="h-5 flex items-end px-1 timeline-track">
                {Array.from({ length: 13 }).map((_, i) => (
                  <span key={i} className="text-[9px] text-gray-600 flex-1">{formatTime(i * 10)}</span>
                ))}
              </div>
              
              {/* Tracks */}
              {['video', 'audio', 'text'].map(trackType => (
                <div key={trackType} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 w-12 capitalize">{trackType}</span>
                  <div className="flex-1 h-8 bg-white/5 rounded relative">
                    {clips.filter(c => c.type === trackType).map(clip => (
                      <div
                        key={clip.id}
                        onClick={() => setSelectedClip(clip.id)}
                        className={`absolute top-0.5 h-7 rounded cursor-pointer transition-all ${clip.color} ${
                          selectedClip === clip.id ? 'ring-2 ring-white/50 scale-y-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{
                          left: `${(clip.start / duration) * 100}%`,
                          width: `${(clip.duration / duration) * 100}%`,
                        }}
                      >
                        <span className="text-[9px] text-white px-1 truncate block leading-7">{clip.name}</span>
                      </div>
                    ))}
                    {/* Playhead */}
                    <div className="absolute top-0 h-full w-0.5 bg-red-500 z-10" style={{ left: `${(currentTime / duration) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
