import { useState, useRef, useCallback } from 'react';
import {
  Upload, Download, RotateCw, FlipHorizontal, FlipVertical,
  Sun, Contrast, Droplets, Palette, Scissors, Wand2,
  Layers, ZoomIn, ZoomOut, Undo, Redo, Trash2,
  Sparkles, Eraser, Move, Maximize2, Image as ImageIcon
} from 'lucide-react';

interface FilterPreset {
  name: string;
  css: string;
}

const filterPresets: FilterPreset[] = [
  { name: 'Original', css: 'none' },
  { name: 'Grayscale', css: 'grayscale(100%)' },
  { name: 'Sepia', css: 'sepia(100%)' },
  { name: 'Vintage', css: 'sepia(50%) contrast(120%) brightness(90%)' },
  { name: 'Warm', css: 'sepia(30%) saturate(140%) brightness(110%)' },
  { name: 'Cool', css: 'saturate(80%) hue-rotate(20deg) brightness(105%)' },
  { name: 'Dramatic', css: 'contrast(150%) brightness(80%) saturate(120%)' },
  { name: 'Fade', css: 'contrast(80%) brightness(120%) saturate(80%)' },
  { name: 'Vivid', css: 'saturate(200%) contrast(110%)' },
  { name: 'Noir', css: 'grayscale(100%) contrast(150%) brightness(80%)' },
];

export default function ImageEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'tools' | 'ai'>('adjust');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState('Original');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterString = useCallback(() => {
    let filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
    const preset = filterPresets.find(f => f.name === selectedFilter);
    if (preset && preset.css !== 'none') {
      filter += ` ${preset.css}`;
    }
    return filter;
  }, [brightness, contrast, saturation, blur, hueRotate, selectedFilter]);

  const getTransformString = () => {
    return `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;
  };

  const handleDownload = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.filter = getFilterString();
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHueRotate(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(100);
    setSelectedFilter('Original');
  };

  const handleAIProcess = () => {
    if (!aiPrompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`AI Processing: "${aiPrompt}"\n\nNote: This is a demo. In production, this would connect to AI APIs like DALL-E, Stable Diffusion, or Remove.bg`);
    }, 2000);
  };

  const tabs = [
    { id: 'adjust' as const, label: 'Adjust', icon: Sun },
    { id: 'filters' as const, label: 'Filters', icon: Palette },
    { id: 'tools' as const, label: 'Tools', icon: Scissors },
    { id: 'ai' as const, label: 'AI Tools', icon: Sparkles },
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-48px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <ImageIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Image Editor</h1>
            <p className="text-xs text-gray-400">AI-powered image editing tools</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetAll} className="px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-sm flex items-center gap-2 transition-colors">
            <Undo size={14} /> Reset
          </button>
          <button onClick={handleDownload} disabled={!image} className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Panel - Tools */}
        <div className="w-72 flex-shrink-0 glass-card overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 transition-colors
                    ${activeTab === tab.id ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 space-y-4">
            {activeTab === 'adjust' && (
              <>
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Sun size={12} /> Brightness</span>
                    <span>{brightness}%</span>
                  </label>
                  <input type="range" min="0" max="200" value={brightness} onChange={e => setBrightness(+e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Contrast size={12} /> Contrast</span>
                    <span>{contrast}%</span>
                  </label>
                  <input type="range" min="0" max="200" value={contrast} onChange={e => setContrast(+e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Droplets size={12} /> Saturation</span>
                    <span>{saturation}%</span>
                  </label>
                  <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(+e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">💫 Blur</span>
                    <span>{blur}px</span>
                  </label>
                  <input type="range" min="0" max="20" value={blur} onChange={e => setBlur(+e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Palette size={12} /> Hue Rotate</span>
                    <span>{hueRotate}°</span>
                  </label>
                  <input type="range" min="0" max="360" value={hueRotate} onChange={e => setHueRotate(+e.target.value)} className="w-full" />
                </div>
              </>
            )}

            {activeTab === 'filters' && (
              <div className="grid grid-cols-2 gap-2">
                {filterPresets.map(filter => (
                  <button
                    key={filter.name}
                    onClick={() => setSelectedFilter(filter.name)}
                    className={`p-2 rounded-lg text-xs text-center transition-all ${
                      selectedFilter === filter.name
                        ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300'
                        : 'bg-white/5 border border-transparent hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-2">
                <button onClick={() => setRotation(r => (r + 90) % 360)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">
                  <RotateCw size={16} /> Rotate 90°
                </button>
                <button onClick={() => setFlipH(!flipH)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">
                  <FlipHorizontal size={16} /> Flip Horizontal
                </button>
                <button onClick={() => setFlipV(!flipV)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">
                  <FlipVertical size={16} /> Flip Vertical
                </button>
                <button onClick={() => setZoom(z => Math.min(z + 25, 300))} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">
                  <ZoomIn size={16} /> Zoom In
                </button>
                <button onClick={() => setZoom(z => Math.max(z - 25, 25))} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">
                  <ZoomOut size={16} /> Zoom Out
                </button>
                <button onClick={() => setZoom(100)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">
                  <Maximize2 size={16} /> Fit to Screen
                </button>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-gray-500 mb-2">Zoom: {zoom}%</p>
                  <input type="range" min="25" max="300" value={zoom} onChange={e => setZoom(+e.target.value)} className="w-full" />
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <p className="text-xs text-indigo-300 font-medium mb-2">✨ AI Enhancement</p>
                  <textarea
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Describe what you want AI to do... (e.g., 'Remove background', 'Enhance quality', 'Change style to watercolor')"
                    className="w-full bg-black/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 resize-none h-20 border border-white/5 focus:border-indigo-500/50 focus:outline-none"
                  />
                  <button
                    onClick={handleAIProcess}
                    disabled={!aiPrompt.trim() || isProcessing}
                    className="w-full mt-2 py-2 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
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
                  {[
                    { label: '🎨 Remove Background', desc: 'AI background removal' },
                    { label: '✨ Auto Enhance', desc: 'Smart brightness & contrast' },
                    { label: '🖌️ Style Transfer', desc: 'Apply artistic styles' },
                    { label: '🔍 Upscale 4x', desc: 'AI image upscaling' },
                    { label: '🎭 Face Retouch', desc: 'AI portrait enhancement' },
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiPrompt(action.label.slice(2))}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-xs text-gray-300">{action.label}</span>
                      <span className="text-[10px] text-gray-500">{action.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 glass-card flex items-center justify-center canvas-grid relative overflow-hidden">
          {image ? (
            <div style={{ transform: `scale(${zoom / 100})`, transition: 'transform 0.2s' }}>
              <img
                src={image}
                alt="Editing"
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                style={{
                  filter: getFilterString(),
                  transform: getTransformString(),
                  transition: 'filter 0.2s, transform 0.2s',
                }}
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-pink-400" />
              </div>
              <p className="text-gray-400 mb-2">Upload an image to start editing</p>
              <p className="text-xs text-gray-500 mb-4">Supports JPG, PNG, WebP, SVG</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Choose Image
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Upload button when image exists */}
          {image && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-gray-300 flex items-center gap-1 transition-colors"
            >
              <Upload size={12} /> Change Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
