import {
  Home,
  Image,
  Video,
  Workflow,
  Pencil,
  Library,
  ArrowUpCircle,
  PenTool,
} from 'lucide-react';

export const TOOL_ITEMS = [
  { id: 'sketch', label: 'Sketch', icon: Pencil, isNew: false, mode: 'sketch', href: '/generate?mode=sketch' },
  { id: 'image', label: 'Image', icon: Image, isNew: false, mode: 'image', href: '/generate?mode=image' },
  { id: 'video', label: 'Video', icon: Video, isNew: false, mode: 'video', href: '/generate?mode=video' },
  { id: 'cad', label: 'CAD', icon: Workflow, isNew: false, mode: 'cad', href: '/generate?mode=cad' },
  // { id: 'upscaler', label: 'Upscaler', icon: ArrowUpCircle, isNew: false, mode: null, href: '#' },
  // { id: 'canvas', label: 'Canvas', icon: PenTool, isNew: false, mode: null, href: '#' },
  // { id: 'draw', label: 'Draw', icon: Pencil, isNew: false, mode: null, href: '#' },
];

export const TOOL_TABS = TOOL_ITEMS.map(({ id, label, isNew, icon }) => ({ id, label, isNew, icon }));

export const GENERATE_MODE_TOOLS = TOOL_ITEMS.filter((tool) => Boolean(tool.mode));
export const LIBRARY_TOOLS = TOOL_ITEMS.filter((tool) => !tool.mode);

export const SIDEBAR_MAIN_NAV = [
  { id: 'home', label: 'Home', icon: Home, href: '/', matchPath: '/', matchMode: null, isNew: false },
  ...GENERATE_MODE_TOOLS.map((tool) => ({
    id: tool.id,
    label: tool.label,
    icon: tool.icon,
    href: tool.href,
    matchPath: '/generate',
    matchMode: tool.mode,
    isNew: tool.isNew,
  })),
];

export const SIDEBAR_LIBRARY_NAV = [
  { id: 'library', label: 'Library', icon: Library, href: '/library', matchPath: '/library', matchMode: null, isNew: false },
  ...LIBRARY_TOOLS.map((tool) => ({
    id: tool.id,
    label: tool.label,
    icon: tool.icon,
    href: tool.href,
    matchPath: null,
    matchMode: null,
    isNew: tool.isNew,
  })),
];
