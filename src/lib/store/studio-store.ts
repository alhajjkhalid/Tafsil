import { create } from "zustand";

interface StudioState {
  selectedFabricId: string | null;
  selectedPersonalizationId: string | null;
  selectedTier: "regular" | "vip";
  fabricPrice: number;
  personalizationPrice: number;
}

interface StudioActions {
  setFabric: (id: string | null, price: number) => void;
  setPersonalization: (id: string | null, price: number) => void;
  setTier: (tier: "regular" | "vip") => void;
  getTotalPrice: () => number;
  reset: () => void;
}

const initialState: StudioState = {
  selectedFabricId: null,
  selectedPersonalizationId: null,
  selectedTier: "regular",
  fabricPrice: 0,
  personalizationPrice: 0,
};

export const useStudioStore = create<StudioState & StudioActions>(
  (set, get) => ({
    ...initialState,

    setFabric: (id, price) =>
      set({ selectedFabricId: id, fabricPrice: price }),

    setPersonalization: (id, price) =>
      set({ selectedPersonalizationId: id, personalizationPrice: price }),

    setTier: (tier) => set({ selectedTier: tier }),

    getTotalPrice: () => {
      const state = get();
      const vipFee = state.selectedTier === "vip" ? 10000 : 0;
      return state.fabricPrice + state.personalizationPrice + vipFee;
    },

    reset: () => set(initialState),
  })
);
