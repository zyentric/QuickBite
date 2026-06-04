import { create } from 'zustand';
import api from '../utils/api';
import { Alert } from 'react-native';
import { useAuthStore } from './authStore';

export const useCartStore = create((set, get) => ({
  items: [],

  fetchCart: async () => {
    const userId = useAuthStore.getState().user?._id;
    if (!userId) return;
    try {
      const res = await api.get(`/cart/user/${userId}`);
      set({ items: res.data.items || [] });
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch cart');
    }
  },

  addItem: async (product, qty = 1) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return Alert.alert('Error', 'Login required');
    try {
      const existing = get().items.find(i => i.product._id === product._id);
      const newQty = existing ? existing.quantity + qty : qty;
      await api.post('/cart', { productId: product._id, quantity: newQty });
      await get().fetchCart();
      Alert.alert('Success', `${product.name} added to cart`);
    } catch (err) {
      Alert.alert('Error', 'Failed to add to cart');
    }
  },

  updateQuantity: async (id, qty) => {
    const userId = useAuthStore.getState().user?._id;
    if (!userId) return;
    try {
      await api.put('/cart/update', { productId: id, quantity: qty });
      await get().fetchCart();
    } catch (err) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  },

  clearCart: async () => {
    const userId = useAuthStore.getState().user?._id;
    if (!userId) return;
    try {
      await api.delete(`/cart/clear/${userId}`);
      set({ items: [] });
    } catch (err) {
      Alert.alert('Error', 'Failed to clear cart');
    }
  },

  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
