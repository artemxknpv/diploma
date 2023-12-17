import { create } from "zustand";

type ExchangeBufferStore = {
  buffer: string[];
  set: (d: string | string[]) => void;
  get: () => string[];
};

export const useExchangeBuffer = create<ExchangeBufferStore>((set, get) => ({
  buffer: [],
  set: (d) => set({ buffer: Array.isArray(d) ? d : [d] }),
  get: () => get().buffer,
}));
