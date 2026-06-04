import { create } from 'zustand';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from './cartStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAdmin: false,
  initialized: false,

  init: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ token, user, isAdmin: user.role === 'admin', initialized: true });
        if (user._id) await useCartStore.getState().fetchCart();
      } else {
        set({ initialized: true });
      }
    } catch (err) {
      set({ initialized: true });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAdmin: user.role === 'admin' });
    if (user._id) await useCartStore.getState().fetchCart();
  },

  signup: async (email, password, phone) => {
    const res = await api.post('/auth/signup', { email, password, phone });
    const { token, user } = res.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAdmin: user.role === 'admin' });
    if (user._id) await useCartStore.getState().fetchCart();
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    useCartStore.getState().clearCart();
    set({ user: null, token: null, isAdmin: false });
  },
}));
