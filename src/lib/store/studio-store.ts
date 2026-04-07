import { create } from "zustand";

interface StudioState {
  selectedFabricId: string | null;
  selectedFabricTier: "economy" | "mid" | "premium" | null;
  selectedFabricPrice: number;
  selectedPersonalizationId: string | null;
  selectedPersonalizationLevel: "standard" | "enhanced" | "full_custom" | null;
  selectedPersonalizationPrice: number;
  selectedTier: "regular" | "vip";
  totalPrice: number;
  // Legacy aliases
  fabricPrice: number;
  personalizationPrice: number;
}

interface StudioActions {
  setFabric: (
    id: string,
    price: number,
    tier?: "economy" | "mid" | "premium"
  ) => void;
  setPersonalization: (
    id: string,
    price: number,
    level?: "standard" | "enhanced" | "full_custom"
  ) => void;
  setTier: (tier: "regular" | "vip") => void;
  getTotalPrice: () => number;
  reset: () => void;
}

const initialState: StudioState = {
  selectedFabricId: null,
  selectedFabricTier: null,
  selectedFabricPrice: 0,
  selectedPersonalizationId: null,
  selectedPersonalizationLevel: null,
  selectedPersonalizationPrice: 0,
  selectedTier: "regular",
  totalPrice: 0,
  fabricPrice: 0,
  personalizationPrice: 0,
};

export const useStudioStore = create<StudioState & StudioActions>(
  (set, get) => ({
    ...initialState,

    setFabric: (id, price, tier) =>
      set((state) => ({
        selectedFabricId: id,
        selectedFabricPrice: price,
        selectedFabricTier: tier ?? state.selectedFabricTier,
        fabricPrice: price,
        totalPrice: price + state.selectedPersonalizationPrice,
      })),

    setPersonalization: (id, price, level) =>
      set((state) => ({
        selectedPersonalizationId: id,
        selectedPersonalizationPrice: price,
        selectedPersonalizationLevel: level ?? state.selectedPersonalizationLevel,
        personalizationPrice: price,
        totalPrice: state.selectedFabricPrice + price,
      })),

    setTier: (tier) => set({ selectedTier: tier }),

    getTotalPrice: () => {
      const state = get();
      const vipFee = state.selectedTier === "vip" ? 10000 : 0;
      return state.selectedFabricPrice + state.selectedPersonalizationPrice + vipFee;
    },

    reset: () => set(initialState),
  })
);
