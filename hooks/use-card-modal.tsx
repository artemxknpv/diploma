import { create } from "zustand";

type CardModalStore = {
  open: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  id?: string;
};

export const useCardModal = create<CardModalStore>((setState) => ({
  id: undefined,
  open: false,
  onOpen: (id: string) => setState({ open: true, id }),
  onClose: () => setState({ open: false, id: undefined }),
}));
