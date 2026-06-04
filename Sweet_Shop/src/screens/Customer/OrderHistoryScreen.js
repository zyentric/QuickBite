import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderItem from '../../components/OrderItem';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';

const OrderHistoryScreen = () => {
  const { orders, fetchOrders } = useOrderStore();
  const user = useAuthStore(state => state.user);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user) fetchOrders(user.id);
  }, [user]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Title style={styles.title}>Order History</Title>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={100} color="#cbd5e1" />
          <Text style={styles.emptyText}>You haven't ordered anything yet!</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 16,
  }
});

export default OrderHistoryScreen;
