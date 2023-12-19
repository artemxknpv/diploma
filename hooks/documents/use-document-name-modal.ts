import { create } from "zustand";

type DocumentModalStore = {
  open: boolean;
  onOpen: (props: { id?: string; isFolder?: boolean; title?: string }) => void;
  onClose: () => void;
  id?: string;
  isFolder?: boolean;
  title?: string;
};

export const useDocumentNameModal = create<DocumentModalStore>((setState) => ({
  id: undefined,
  open: false,
  title: undefined,
  isFolder: undefined,
  onOpen: (props) => setState({ open: true, ...props }),
  onClose: () =>
    setState({
      open: false,
      id: undefined,
      isFolder: undefined,
      title: undefined,
    }),
}));
