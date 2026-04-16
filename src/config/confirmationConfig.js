import { Trash2, AlertTriangle } from 'lucide-react';

export const CONFIRMATION_CONFIG = {
  deleteAllImages: {
    title: 'Delete All Images',
    description: 'Are you sure you want to delete all images from this generation? This action cannot be undone.',
    confirmText: 'Delete All',
    cancelText: 'Cancel',
    variant: 'danger',
    icon: Trash2,
  },
  clearAllUploads: {
    title: 'Clear All Uploads',
    description: 'Are you sure you want to clear all uploaded images? This action cannot be undone.',
    confirmText: 'Clear All',
    cancelText: 'Cancel',
    variant: 'danger',
    icon: AlertTriangle,
  },
  deleteSelectedImages: {
    title: 'Delete Selected Images',
    description: 'Are you sure you want to delete the selected images? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    icon: Trash2,
  },
  deleteCollection: {
    title: 'Delete Collection',
    description: 'Are you sure you want to delete this collection? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    icon: Trash2,
  },
};

export default CONFIRMATION_CONFIG;
