import { create } from "zustand";

interface OrderState {
  measurementId: string | null;
  deliveryAddressId: string | null;
  paymentMethod: "apple_pay" | "stc_pay" | "credit_card" | null;
  promoCode: string | null;
  discount: number;
}

interface OrderActions {
  setMeasurement: (id: string | null) => void;
  setAddress: (id: string | null) => void;
  setPayment: (method: "apple_pay" | "stc_pay" | "credit_card" | null) => void;
  setPromo: (code: string | null, discount: number) => void;
  reset: () => void;
}

const initialState: OrderState = {
  measurementId: null,
  deliveryAddressId: null,
  paymentMethod: null,
  promoCode: null,
  discount: 0,
};

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  ...initialState,

  setMeasurement: (id) => set({ measurementId: id }),

  setAddress: (id) => set({ deliveryAddressId: id }),

  setPayment: (method) => set({ paymentMethod: method }),

  setPromo: (code, discount) => set({ promoCode: code, discount }),

  reset: () => set(initialState),
}));
