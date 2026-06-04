import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Title, Text } from 'react-native-paper';
import OrderItem from '../../components/OrderItem';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';

const OrderHistoryScreen = () => {
  const { orders, fetchOrders } = useOrderStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user) fetchOrders(user.id);
  }, [user]);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Order History</Title>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
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
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  }
});

export default OrderHistoryScreen;
