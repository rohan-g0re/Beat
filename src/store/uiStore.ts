/**
 * UI Store - Toasts, modals, and global UI state
 */

import { create } from 'zustand';
import { Toast } from '@types/models';

interface UIState {
  toasts: Toast[];
  paywallVisible: boolean;
  currentModal: string | null;

  // Toast Actions
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;

  // Modal Actions
  showPaywall: () => void;
  hidePaywall: () => void;
  setModal: (modalName: string | null) => void;
}

let toastId = 0;

export const useUIStore = create<UIState>(set => ({
  toasts: [],
  paywallVisible: false,
  currentModal: null,

  showToast: (message, type = 'info', duration = 3000) => {
    const id = `toast-${toastId++}`;
    const toast: Toast = { id, message, type, duration };

    set(state => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-dismiss after duration
    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id),
      }));
    }, duration);
  },

  hideToast: id => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  showPaywall: () => set({ paywallVisible: true }),
  hidePaywall: () => set({ paywallVisible: false }),

  setModal: modalName => set({ currentModal: modalName }),
}));

