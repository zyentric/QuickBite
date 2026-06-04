import { create } from 'zustand';
import api from '../utils/api';
import { Alert } from 'react-native';

export const useOrderStore = create(set => ({
  orders: [],
  fetchOrders: async userId => {
    try {
      const res = await api.get(`/orders/user/${userId}`);
      set({ orders: res.data });
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch orders');
    }
  },
  fetchAdminOrders: async () => {
    try {
      const res = await api.get('/orders');
      set({ orders: res.data });
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch orders');
    }
  },
  placeOrder: async orderData => {
    try {
      const res = await api.post('/orders', orderData);
      set(state => ({ orders: [...state.orders, res.data] }));
      // TODO: Push notification for new order
      return res.data;
    } catch (err) {
      Alert.alert('Error', 'Failed to place order');
    }
  },
  updateStatus: async (id, status) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      set(state => ({
        orders: state.orders.map(o => (o._id === id ? res.data : o)),
      }));
      // TODO: Push notification for status update
    } catch (err) {
      Alert.alert('Error', 'Failed to update status');
    }
  },
}));
