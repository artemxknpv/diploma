import { create } from "zustand";

type SelectedDocumentsStore = {
  rows: Record<string, boolean>;
  setRows: (
    d:
      | Record<string, boolean>
      | ((old: Record<string, boolean>) => Record<string, boolean>),
  ) => void;
};

export const useSelectedDocuments = create<SelectedDocumentsStore>(
  (set, get) => ({
    rows: {},
    setRows: (d) => set({ rows: typeof d === "function" ? d(get().rows) : d }),
  }),
);
