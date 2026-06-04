import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Preloader from "../components/Preloader";
import { useLoadingStore } from "../stores/loadingStore";
import Layout from "../common/Layout";

// Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import HomeScreen from "../screens/Customer/HomeScreen";
import ProductDetailScreen from "../screens/Customer/ProductDetailScreen";
import CartScreen from "../screens/Customer/CartScreen";
import CheckoutScreen from "../screens/Customer/CheckoutScreen";
import OrderHistoryScreen from "../screens/Customer/OrderHistoryScreen";
import AdminDashboard from "../screens/Admin/AdminDashboard";
import ManageProductsScreen from "../screens/Admin/ManageProductsScreen";
import ManageOrdersScreen from "../screens/Admin/ManageOrdersScreen";
import SettingsScreen from "../screens/Admin/SettingsScreen";
import AboutShopScreen from "../screens/Customer/AboutShopScreen";
import SearchScreen from "../screens/Customer/SearchScreen";
import AccountPage from "../pages/AccountPage";
import LandingPage from "../pages/LandingPage";

// MUI Icons for sidebar links
import {
  Home as HomeIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  Settings,
} from "@mui/icons-material";
import { useCartStore } from "../stores/cartStore";
import { Badge } from "@mui/material";

const AppNavigator = () => {
  const { user, isAdmin, init, initialized } = useAuthStore();
  const loading = useLoadingStore((state) => state.loading);
  const cartItems = useCartStore((state) => state.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (user) {
      useCartStore.getState().fetchCart();
    }
  }, [user]);


  // Define sidebar links
  const adminLinks = [
    { text: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { text: "Menu / Products", path: "/admin/products", icon: <InventoryIcon /> },
    { text: "Live Orders", path: "/admin/orders", icon: <ListAltIcon /> },
    { text: "Store Settings", path: "/admin/settings", icon: <Settings /> },
  ];

  const userLinks = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    { text: "Menu", path: "/menu", icon: <InventoryIcon /> },
    { text: "Search", path: "/search", icon: <SearchIcon /> },
    {
      text: "Cart",
      path: "/cart",
      icon: (
        <Badge
          badgeContent={cartCount}
          overlap="circular"
          showZero
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: cartCount > 0 ? "#2e7d32" : "#ed6c02", // green : orange
              color: "#fff",
              fontWeight: 700,
              fontSize: "11px",
              minWidth: 18,
              height: 18,
              borderRadius: "10px",
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      ),
    },
    { text: "My Orders", path: "/orders", icon: <HistoryIcon /> },
    { text: "About Us", path: "/about", icon: <InfoIcon /> },
  ];

  return (
    <Router>
      <Preloader visible={loading || !initialized} />

      {/* Ensure Routes are rendered only after initialization to avoid auth flickers, 
          but keep them mounted during subsequent loading states */}
      {initialized && (
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : isAdmin ? (
            <Route
              path="/*"
              element={
                <Layout links={adminLinks}>
                  <Routes>
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route
                      path="admin/products"
                      element={<ManageProductsScreen />}
                    />
                    <Route path="admin/orders" element={<ManageOrdersScreen />} />
                    <Route path="admin/settings" element={<SettingsScreen />} />
                    <Route path="product/:id" element={<ProductDetailScreen />} />
                    <Route path="about" element={<AboutShopScreen />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                  </Routes>
                </Layout>
              }
            />
          ) : (
            <Route
              path="/*"
              element={
                <Layout links={userLinks}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="menu" element={<HomeScreen />} />
                    <Route path="search" element={<SearchScreen />} />
                    <Route path="product/:id" element={<ProductDetailScreen />} />
                    <Route path="cart" element={<CartScreen />} />
                    <Route path="checkout" element={<CheckoutScreen />} />
                    <Route path="orders" element={<OrderHistoryScreen />} />
                    <Route path="about" element={<AboutShopScreen />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Layout>
              }
            />
          )}
        </Routes>
      )}
    </Router>
  );
};

export default AppNavigator;
