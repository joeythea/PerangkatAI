import { 
  LayoutDashboard, 
  Image, 
  Video, 
  Presentation, 
  Bot, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'image-editor' as Page, label: 'Image Editor', icon: Image },
  { id: 'video-editor' as Page, label: 'Video Editor', icon: Video },
  { id: 'ppt-maker' as Page, label: 'PPT Maker', icon: Presentation },
  { id: 'ai-manager' as Page, label: 'AI Manager', icon: Bot },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-[#12122a] border-r border-indigo-500/10 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-indigo-500/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          {isOpen && (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
              AI Creative Hub
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />
                {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="p-2 border-t border-indigo-500/10">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
