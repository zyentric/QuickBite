// // src/utils/api.js
// import axios from 'axios';
// import { API_BASE_URL } from './constants';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Add auth token interceptor if needed
// api.interceptors.request.use(config => {
//   // const token = authStore.getState().token; // From zustand
//   // if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;


// src/utils/api.js
import axios from 'axios';
import { API_BASE_URL } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

// request interceptor to attach token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

export default api;
