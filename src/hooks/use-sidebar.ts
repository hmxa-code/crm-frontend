import { create } from "zustand";

interface SidebarStore {
    isCollapsed: boolean;
    toggle: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
    isCollapsed: false,
    toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));