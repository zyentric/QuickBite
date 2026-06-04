import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { useCartStore } from '../../stores/cartStore';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';
import api from '../../utils/api';
import { haversineDistance } from '../../utils/haversine';
import RazorpayCheckout from 'react-native-razorpay';
import { useLoadingStore } from '../../stores/loadingStore';
const { KeyboardAwareScrollView } = require('react-native-keyboard-aware-scroll-view');

const CheckoutScreen = () => {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [settings, setSettings] = useState(null);
  const { items, getTotal, clearCart } = useCartStore();
  const placeOrder = useOrderStore(state => state.placeOrder);
  const user = useAuthStore(state => state.user);
  const setLoading = useLoadingStore(state => state.setLoading);

  useEffect(() => {
    fetchSettings();
    Geolocation.requestAuthorization('whenInUse');
    Geolocation.getCurrentPosition(
      pos =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => Alert.alert('Location error', err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load shop settings');
    }
  };

  const handleCheckout = async () => {
    if (!location || !settings)
      return Alert.alert('Error', 'Location or settings not available');
    const distance = haversineDistance(
      settings.shopLat,
      settings.shopLng,
      location.lat,
      location.lng,
    );
    if (distance > settings.radius)
      return Alert.alert(
        'Outside radius',
        `You are ${distance.toFixed(2)}km away (max ${settings.radius}km)`,
      );

    const total = getTotal();
    if (total === 0) return Alert.alert('Cart empty');

    setLoading(true);
    try {
      const orderRes = await api.post('/payments/create', {
        amount: Math.round(total * 100),
      });
      const options = {
        description: 'Mithai Order',
        order_id: orderRes.data.id,
        currency: 'INR',
        key: orderRes.data.key_id || 'your_razorpay_key', // Use env in prod
        amount: Math.round(total * 100),
        name: 'Mithai Shop',
        prefill: { email: user.email, contact: user.phone },
      };
      const payment = await RazorpayCheckout.open(options);
      if (payment.razorpay_payment_id) {
        const orderPayload = {
          items: items.map(i => ({
            productId: i.product._id,
            quantity: i.quantity,
            price: i.product.price,
            name: i.product.name,
          })),
          total,
          address,
          location,
          paymentId: payment.razorpay_payment_id,
          paymentStatus: 'paid',
        };
        await placeOrder(orderPayload);
        clearCart();
        Alert.alert('Success', 'Order placed and payment successful!');
      } else {
        Alert.alert('Payment cancelled');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Payment/Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Title style={styles.title}>Complete Order</Title>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TextInput
          label="Full Address (House, Street, Area)"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          style={styles.input}
          theme={{ roundness: 12, colors: { primary: '#F97316' } }}
          multiline
          numberOfLines={3}
        />
        {location && (
          <Text style={styles.locationText}>✓ Location acquired</Text>
        )}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.totalLabel}>Total Amount to Pay</Text>
        <Text style={styles.totalValue}>₹{getTotal()}</Text>
      </View>

      <Button 
        mode="contained" 
        onPress={handleCheckout}
        style={styles.payBtn}
        contentStyle={{ paddingVertical: 12 }}
        labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
        buttonColor="#F97316"
      >
        Pay ₹{getTotal()} & Place Order
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#4b5563',
  },
  input: { backgroundColor: '#fff' },
  locationText: {
    marginTop: 8,
    color: '#10b981',
    fontWeight: '600',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#fff3e0',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ffcc80',
  },
  totalLabel: {
    fontSize: 16,
    color: '#f57c00',
    fontWeight: '700',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#e65100',
  },
  payBtn: {
    borderRadius: 12,
  },
});
export default CheckoutScreen;
