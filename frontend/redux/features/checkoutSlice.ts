import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  addressId: string | null;
  selectedShippingId: string | null;

  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

const initialState: CheckoutState = {
  addressId: null,
  selectedShippingId: null,

  pricing: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,

  reducers: {
    setAddressId: (state, action: PayloadAction<string | null>) => {
      state.addressId = action.payload;
    },

    setSelectedShippingId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.selectedShippingId = action.payload;
    },

    setPricing: (
      state,
      action: PayloadAction<CheckoutState["pricing"]>
    ) => {
      state.pricing = action.payload;
    },

    clearCheckout: (state) => {
      state.addressId = null;
      state.selectedShippingId = null;
      state.pricing = {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      };
    },
  },
});

export const {
  setAddressId,
  setSelectedShippingId,
  setPricing,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer; 