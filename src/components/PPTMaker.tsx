import { useState } from 'react';
import {
  Plus, Trash2, Copy, Download, Wand2, Sparkles,
  Presentation, Layout, Type, Image as ImageIcon,
  ChevronLeft, ChevronRight, Palette, AlignLeft,
  AlignCenter, AlignRight, Bold, Italic, Underline,
  List, Grid3X3, Maximize2
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  content: string;
  layout: 'title' | 'content' | 'two-column' | 'image-text' | 'blank';
  bgColor: string;
  textColor: string;
  elements: SlideElement[];
}

interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  bold?: boolean;
}

const slideTemplates = [
  { name: 'Title Slide', layout: 'title' as const, icon: '📌' },
  { name: 'Content', layout: 'content' as const, icon: '📝' },
  { name: 'Two Column', layout: 'two-column' as const, icon: '📊' },
  { name: 'Image + Text', layout: 'image-text' as const, icon: '🖼️' },
  { name: 'Blank', layout: 'blank' as const, icon: '⬜' },
];

const colorThemes = [
  { name: 'Dark', bg: '#1a1a2e', text: '#ffffff' },
  { name: 'Light', bg: '#ffffff', text: '#1a1a2e' },
  { name: 'Ocean', bg: '#0c4a6e', text: '#e0f2fe' },
  { name: 'Forest', bg: '#14532d', text: '#dcfce7' },
  { name: 'Sunset', bg: '#7c2d12', text: '#fed7aa' },
  { name: 'Purple', bg: '#3b0764', text: '#e9d5ff' },
  { name: 'Midnight', bg: '#0f172a', text: '#cbd5e1' },
  { name: 'Rose', bg: '#881337', text: '#fce7f3' },
];

export default function PPTMaker() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'Welcome Presentation',
      content: 'Created with AI Creative Hub',
      layout: 'title',
      bgColor: '#1a1a2e',
      textColor: '#ffffff',
      elements: [],
    },
    {
      id: '2',
      title: 'Introduction',
      content: 'This is a sample content slide. Edit this text to add your content. You can customize colors, layouts, and add elements.',
      layout: 'content',
      bgColor: '#1a1a2e',
      textColor: '#ffffff',
      elements: [],
    },
  ]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [activePanel, setActivePanel] = useState<'layout' | 'design' | 'elements' | 'ai'>('layout');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const currentSlide = slides[currentSlideIdx];

  const addSlide = (layout: Slide['layout'] = 'content') => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: 'New Slide',
      content: 'Click to edit content',
      layout,
      bgColor: currentSlide?.bgColor || '#1a1a2e',
      textColor: currentSlide?.textColor || '#ffffff',
      elements: [],
    };
    const newSlides = [...slides];
    newSlides.splice(currentSlideIdx + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIdx(currentSlideIdx + 1);
  };

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== idx);
    setSlides(newSlides);
    if (currentSlideIdx >= newSlides.length) {
      setCurrentSlideIdx(newSlides.length - 1);
    }
  };

  const duplicateSlide = (idx: number) => {
    const slide = { ...slides[idx], id: Date.now().toString() };
    const newSlides = [...slides];
    newSlides.splice(idx + 1, 0, slide);
    setSlides(newSlides);
  };

  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIdx] = { ...currentSlide, ...updates };
    setSlides(newSlides);
  };

  const applyTheme = (bg: string, text: string) => {
    const newSlides = slides.map(s => ({ ...s, bgColor: bg, textColor: text }));
    setSlides(newSlides);
  };

  const generateWithAI = () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const generatedSlides: Slide[] = [
        {
          id: Date.now().toString() + '1',
          title: aiTopic,
          content: 'A comprehensive overview',
          layout: 'title',
          bgColor: '#1a1a2e',
          textColor: '#ffffff',
          elements: [],
        },
        {
          id: Date.now().toString() + '2',
          title: 'Overview',
          content: `Key points about ${aiTopic}. This slide provides an introduction to the main concepts and ideas.`,
          layout: 'content',
          bgColor: '#1a1a2e',
          textColor: '#ffffff',
          elements: [],
        },
        {
          id: Date.now().toString() + '3',
          title: 'Key Benefits',
          content: '• Improved efficiency\n• Cost reduction\n• Better outcomes\n• Scalable solution',
          layout: 'content',
          bgColor: '#0c4a6e',
          textColor: '#e0f2fe',
          elements: [],
        },
        {
          id: Date.now().toString() + '4',
          title: 'Implementation',
          content: 'Step-by-step guide to implementing the solution effectively.',
          layout: 'two-column',
          bgColor: '#14532d',
          textColor: '#dcfce7',
          elements: [],
        },
        {
          id: Date.now().toString() + '5',
          title: 'Thank You',
          content: 'Questions & Discussion',
          layout: 'title',
          bgColor: '#3b0764',
          textColor: '#e9d5ff',
          elements: [],
        },
      ];
      setSlides(generatedSlides);
      setCurrentSlideIdx(0);
      setIsGenerating(false);
    }, 2000);
  };

  const renderSlidePreview = (slide: Slide, isMain = false) => {
    const scale = isMain ? 1 : 0.3;
    return (
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          backgroundColor: slide.bgColor,
          color: slide.textColor,
          aspectRatio: '16/9',
          width: isMain ? '100%' : '100%',
        }}
      >
        {slide.layout === 'title' && (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <h2 className={`${isMain ? 'text-3xl' : 'text-[8px]'} font-bold mb-2`}>{slide.title}</h2>
            <p className={`${isMain ? 'text-lg' : 'text-[5px]'} opacity-70`}>{slide.content}</p>
          </div>
        )}
        {slide.layout === 'content' && (
          <div className="p-4 h-full flex flex-col">
            <h3 className={`${isMain ? 'text-2xl' : 'text-[7px]'} font-bold mb-3 border-b border-current/20 pb-2`}>{slide.title}</h3>
            <p className={`${isMain ? 'text-sm' : 'text-[4px]'} opacity-80 whitespace-pre-line flex-1`}>{slide.content}</p>
          </div>
        )}
        {slide.layout === 'two-column' && (
          <div className="p-4 h-full flex flex-col">
            <h3 className={`${isMain ? 'text-2xl' : 'text-[7px]'} font-bold mb-3`}>{slide.title}</h3>
            <div className="flex gap-4 flex-1">
              <div className={`flex-1 ${isMain ? 'text-sm' : 'text-[4px]'} opacity-80`}>
                Left column content goes here with detailed information.
              </div>
              <div className={`flex-1 ${isMain ? 'text-sm' : 'text-[4px]'} opacity-80`}>
                Right column content goes here with supporting details.
              </div>
            </div>
          </div>
        )}
        {slide.layout === 'image-text' && (
          <div className="p-4 h-full flex gap-4">
            <div className="flex-1 flex flex-col justify-center">
              <h3 className={`${isMain ? 'text-2xl' : 'text-[7px]'} font-bold mb-2`}>{slide.title}</h3>
              <p className={`${isMain ? 'text-sm' : 'text-[4px]'} opacity-80`}>{slide.content}</p>
            </div>
            <div className="flex-1 flex items-center justify-center bg-white/10 rounded-lg">
              <ImageIcon size={isMain ? 48 : 12} className="opacity-30" />
            </div>
          </div>
        )}
        {slide.layout === 'blank' && (
          <div className="h-full flex items-center justify-center opacity-30">
            <span className={isMain ? 'text-sm' : 'text-[4px]'}>Blank slide</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-48px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Presentation size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PPT Maker</h1>
            <p className="text-xs text-gray-400">AI-powered presentation creator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-sm flex items-center gap-2 transition-colors">
            <Download size={14} /> Export PPTX
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Slide Panel */}
        <div className="w-48 flex-shrink-0 glass-card overflow-y-auto">
          <div className="p-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Slides ({slides.length})</span>
            <button onClick={() => addSlide('content')} className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="p-2 space-y-2">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`group relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  currentSlideIdx === idx ? 'ring-2 ring-purple-500' : 'ring-1 ring-white/10 hover:ring-white/30'
                }`}
              >
                {renderSlidePreview(slide)}
                <div className="absolute bottom-1 left-1 text-[8px] bg-black/60 text-white px-1 rounded">
                  {idx + 1}
                </div>
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                  <button onClick={(e) => { e.stopPropagation(); duplicateSlide(idx); }} className="p-0.5 bg-black/60 rounded text-white hover:bg-black/80">
                    <Copy size={8} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteSlide(idx); }} className="p-0.5 bg-black/60 rounded text-red-400 hover:bg-black/80">
                    <Trash2 size={8} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 glass-card flex items-center justify-center p-8 canvas-grid">
            <div className="w-full max-w-3xl shadow-2xl rounded-xl overflow-hidden">
              {renderSlidePreview(currentSlide, true)}
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="glass-card p-3 flex items-center justify-between">
            <button
              onClick={() => setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1))}
              disabled={currentSlideIdx === 0}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Slide {currentSlideIdx + 1} of {slides.length}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => addSlide('title')} className="px-2 py-1 rounded bg-white/5 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  + Title
                </button>
                <button onClick={() => addSlide('content')} className="px-2 py-1 rounded bg-white/5 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  + Content
                </button>
              </div>
            </div>
            <button
              onClick={() => setCurrentSlideIdx(Math.min(slides.length - 1, currentSlideIdx + 1))}
              disabled={currentSlideIdx === slides.length - 1}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 flex-shrink-0 glass-card overflow-y-auto">
          <div className="flex border-b border-white/5">
            {(['layout', 'design', 'elements', 'ai'] as const).map(panel => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={`flex-1 py-3 text-[10px] font-medium capitalize transition-colors
                  ${activePanel === panel ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              >
                {panel}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {activePanel === 'layout' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 font-medium">Slide Layouts</p>
                {slideTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateSlide({ layout: tmpl.layout })}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      currentSlide.layout === tmpl.layout
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{tmpl.icon}</span>
                    <span className="text-xs text-gray-300">{tmpl.name}</span>
                  </button>
                ))}
              </div>
            )}

            {activePanel === 'design' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-2">Color Themes</p>
                  <div className="grid grid-cols-2 gap-2">
                    {colorThemes.map((theme, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyTheme(theme.bg, theme.text)}
                        className="p-2 rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <span className="text-[10px]" style={{ color: theme.text }}>{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-2">Edit Content</p>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={e => updateSlide({ title: e.target.value })}
                    placeholder="Slide title"
                    className="w-full bg-black/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 border border-white/5 focus:border-purple-500/50 focus:outline-none mb-2"
                  />
                  <textarea
                    value={currentSlide.content}
                    onChange={e => updateSlide({ content: e.target.value })}
                    placeholder="Slide content"
                    className="w-full bg-black/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 border border-white/5 focus:border-purple-500/50 focus:outline-none resize-none h-24"
                  />
                </div>
              </div>
            )}

            {activePanel === 'elements' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 font-medium">Add Elements</p>
                {[
                  { icon: Type, label: 'Text Box', desc: 'Add text element' },
                  { icon: ImageIcon, label: 'Image', desc: 'Insert image' },
                  { icon: Grid3X3, label: 'Shape', desc: 'Add shape' },
                  { icon: List, label: 'List', desc: 'Bullet points' },
                ].map((el, idx) => {
                  const Icon = el.icon;
                  return (
                    <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                      <Icon size={16} className="text-purple-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-200">{el.label}</p>
                        <p className="text-[10px] text-gray-500">{el.desc}</p>
                      </div>
                    </button>
                  );
                })}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-400 font-medium mb-2">Text Formatting</p>
                  <div className="flex gap-1">
                    {[Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight].map((Icon, idx) => (
                      <button key={idx} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'ai' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 font-medium mb-2">🤖 AI Presentation Generator</p>
                  <textarea
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder="Enter topic... (e.g., 'Marketing Strategy 2024', 'Product Launch Plan')"
                    className="w-full bg-black/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 resize-none h-20 border border-white/5 focus:border-purple-500/50 focus:outline-none"
                  />
                  <button
                    onClick={generateWithAI}
                    disabled={!aiTopic.trim() || isGenerating}
                    className="w-full mt-2 py-2 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} /> Generate Presentation
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">Quick Templates:</p>
                  {['Business Proposal', 'Product Pitch', 'Team Report', 'Training Material', 'Research Paper'].map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiTopic(tmpl)}
                      className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 text-left transition-colors"
                    >
                      📋 {tmpl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
