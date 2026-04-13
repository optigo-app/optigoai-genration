import {
  Home,
  Image,
  Video,
  BookOpen,
  Workflow,
  ArrowUpCircle,
  PenTool,
  Pencil,
  Settings,
  User,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, isNew: false, href: '#' },
  { id: 'image-generation', label: 'Image Generation', icon: Image, isNew: false, href: '#' },
  { id: 'video', label: 'Video', icon: Video, isNew: false, href: '#' },
  { id: 'blueprints', label: 'Blueprints', icon: BookOpen, isNew: true, href: '#' },
  { id: 'flow-state', label: 'Flow State', icon: Workflow, isNew: false, href: '#' },
  { id: 'upscaler', label: 'Upscaler', icon: ArrowUpCircle, isNew: false, href: '#' },
  { id: 'canvas', label: 'Canvas', icon: PenTool, isNew: false, href: '#' },
  { id: 'draw', label: 'Draw', icon: Pencil, isNew: false, href: '#' },
  { id: 'settings', label: 'Settings', icon: Settings, isNew: false, href: '#' },
  { id: 'user', label: 'User', icon: User, isNew: false, href: '#' },
];
