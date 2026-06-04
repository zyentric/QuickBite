import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import Preloader from '../components/Preloader';
import HeaderRightLogout from '../components/HeaderRightLogout';
import { useLoadingStore } from '../stores/loadingStore';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeScreen from '../screens/Customer/HomeScreen';
import ProductDetailScreen from '../screens/Customer/ProductDetailScreen';
import CartScreen from '../screens/Customer/CartScreen';
import CheckoutScreen from '../screens/Customer/CheckoutScreen';
import OrderHistoryScreen from '../screens/Customer/OrderHistoryScreen';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import ManageProductsScreen from '../screens/Admin/ManageProductsScreen';
import ManageOrdersScreen from '../screens/Admin/ManageOrdersScreen';
import SettingsScreen from '../screens/Admin/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, isAdmin, init, initialized } = useAuthStore();
  const loading = useLoadingStore(state => state.loading);

  useEffect(() => {
    init();
  }, []);

  if (!initialized) {
    return <Preloader visible={true} />;
  }

  return (
    <NavigationContainer>
      <Preloader visible={loading} />
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: 'Sign Up' }}
            />
          </>
        ) : isAdmin ? (
          <>
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboard}
              options={{
                title: 'Admin Dashboard',
                headerRight: () => <HeaderRightLogout />,
              }}
            />
            <Stack.Screen
              name="ManageProducts"
              component={ManageProductsScreen}
              options={{ title: 'Manage Products' }}
            />
            <Stack.Screen
              name="ManageOrders"
              component={ManageOrdersScreen}
              options={{ title: 'Manage Orders' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ title: 'Product Detail' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: '🍬 Mithai Shop',
                headerRight: () => <HeaderRightLogout />,
              }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ title: 'Product Detail' }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: 'Your Cart' }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ title: 'Checkout' }}
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistoryScreen}
              options={{ title: 'Your Orders' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
