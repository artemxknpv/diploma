import { create } from "zustand";

type MobileSidebarStore = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useMobileSidebar = create<MobileSidebarStore>((setState) => ({
  open: false,
  onOpen: () => setState({ open: true }),
  onClose: () => setState({ open: false }),
}));
