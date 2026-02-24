import { create } from 'zustand';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setMobile: (isMobile: boolean) => void;
  setTablet: (isTablet: boolean) => void;
  updateViewport: (width: number) => void;
  toggleCollapsed: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  // State
  isOpen: false,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  isTablet: typeof window !== 'undefined' ? window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT : false,
  isCollapsed: typeof window !== 'undefined' ? window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT : false,

  // Actions
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  setMobile: (isMobile: boolean) => set({
    isMobile,
    isOpen: false,
    isCollapsed: false
  }),

  setTablet: (isTablet: boolean) => set({
    isTablet,
    isCollapsed: isTablet,
    isOpen: false
  }),

  // Update viewport state based on window width
  updateViewport: (width: number) => {
    const isMobile = width < MOBILE_BREAKPOINT;
    const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;

    set({
      isMobile,
      isTablet,
      isCollapsed: isTablet,
      // Close sidebar when switching to mobile
      isOpen: isMobile ? false : get().isOpen
    });
  },

  // Toggle collapsed state (for tablet view)
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));

// Hook for viewport detection - use this in App.jsx
export const useViewportDetection = () => {
  const updateViewport = useSidebarStore((state) => state.updateViewport);

  return {
    init: () => {
      if (typeof window === 'undefined') return () => {};

      const handleResize = () => {
        updateViewport(window.innerWidth);
      };

      // Initial check
      handleResize();

      // Listen for resize
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  };
};

export default useSidebarStore;
