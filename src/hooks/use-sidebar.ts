import { create } from "zustand";

interface SidebarStore {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    toggle: () => void;
    toggleMobile: () => void;
    setMobileOpen: (open: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
    isCollapsed: false,
    isMobileOpen: false,
    toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
    setMobileOpen: (open: boolean) => set({ isMobileOpen: open }),
}));
