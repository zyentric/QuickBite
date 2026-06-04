import { create } from "zustand";
import api from "../utils/api";
import { useAuthStore } from "./authStore";
export const useCartStore = create((set, get) => ({
  items: [],
  shopId: null,
  fetchCart: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      const res = await api.get(`/cart/user/${userId}`);
      set({ items: res.data.items || [], shopId: res.data.shopId });
    }
  },
  addItem: async (product, qty = 1) => {
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      const sId = product.shopId || product.shop;
      await api.post("/cart", { productId: product._id, quantity: qty, shopId: sId });
      get().fetchCart();
    }
  },
  updateQuantity: async (id, qty) => {
    await api.put("/cart/update", { productId: id, quantity: qty });
    get().fetchCart();
  },
  clearCart: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      await api.delete(`/cart/clear/${userId}`);
      set({ items: [] });
    }
  },
  getTotal: () =>
    get().items.reduce(
      (sum, i) => sum + (i.productId?.price || 0) * i.quantity,
      0
    ),
}));
