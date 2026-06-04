import { create } from "zustand";
import api from "../utils/api";
export const useOrderStore = create((set) => ({
  orders: [],
  fetchOrders: async (userId) => {
    const res = await api.get(`/orders/user/${userId}`);
    set({ orders: res.data });
  },
  fetchAdminOrders: async (shopId) => {
    let url = "/orders";
    if (shopId) url += `?shopId=${shopId}`;
    const res = await api.get(url);
    set({ orders: res.data });
  },
  placeOrder: async (orderData) => {
    try {
      const res = await api.post("/orders", orderData);
      set((state) => ({ orders: [...state.orders, res.data] }));
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw err;
    }
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    set((state) => ({
      orders: state.orders.map((o) => (o._id === id ? res.data : o)),
    }));
  },
}));
