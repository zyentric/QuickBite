import { create } from "zustand";
import api from "../utils/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  me: [],
  token: null,
  isAdmin: false,
  initialized: false,

  init: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      set({ token, user, isAdmin: user.role === "admin", initialized: true });
    } else {
      set({ initialized: true });
    }
  },

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    set({
      token: res.data.token,
      user: res.data.user,
      isAdmin: res.data.user.role === "admin",
    });
  },

  signup: async (email, password, phone) => {
    const res = await api.post("/auth/signup", { email, password, phone });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    set({
      token: res.data.token,
      user: res.data.user,
      isAdmin: res.data.user.role === "admin",
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAdmin: false });
  },
}));
