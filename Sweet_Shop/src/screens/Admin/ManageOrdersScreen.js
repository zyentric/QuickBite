import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';
import OrderItem from '../../components/OrderItem';
import { useOrderStore } from '../../stores/orderStore';

const ManageOrdersScreen = () => {
  const { orders, fetchAdminOrders, updateStatus } = useOrderStore();

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Live Orders</Title>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <OrderItem order={item} />
            <View style={styles.actionsGrid}>
              <Button mode="outlined" style={styles.actionBtn} onPress={() => updateStatus(item._id, 'confirmed')}>
                Confirm
              </Button>
              <Button mode="outlined" style={styles.actionBtn} onPress={() => updateStatus(item._id, 'preparing')}>
                Prepare
              </Button>
              <Button mode="contained" buttonColor="#10b981" style={styles.actionBtn} onPress={() => updateStatus(item._id, 'ready')}>
                Ready
              </Button>
              <Button mode="contained" buttonColor="#3b82f6" style={styles.actionBtn} onPress={() => updateStatus(item._id, 'completed')}>
                Complete
              </Button>
              <Button mode="contained" buttonColor="#ef4444" style={[styles.actionBtn, { width: '100%' }]} onPress={() => updateStatus(item._id, 'canceled')}>
                Cancel Order
              </Button>
            </View>
          </View>
        )}
        keyExtractor={item => item._id}
      />
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
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    paddingBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '48%',
    borderRadius: 8,
  }
});

export default ManageOrdersScreen;
