import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartItem from '../../components/CartItem';
import { useCartStore } from '../../stores/cartStore';
const { useNavigation } = require('@react-navigation/native');

const CartScreen = () => {
  const { items, updateQuantity, getTotal, clearCart } = useCartStore();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Title style={styles.headerTitle}>Your Cart</Title>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="cart-remove" size={100} color="#cbd5e1" />
          <Text style={styles.emptyText}>Your cart is completely empty</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Home')}
            style={styles.shopBtn}
            buttonColor="#F97316"
          >
            Start Shopping
          </Button>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <CartItem item={item} onUpdateQuantity={updateQuantity} />
          )}
          keyExtractor={i => i.product._id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {items.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{getTotal()}</Text>
          </View>
          <View style={styles.actionRow}>
            <Button 
              mode="outlined" 
              onPress={clearCart} 
              style={styles.clearBtn}
              textColor="#ef4444"
            >
              Clear
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Checkout')}
              style={styles.checkoutBtn}
              contentStyle={{ paddingVertical: 8 }}
              buttonColor="#F97316"
            >
              Checkout
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    padding: 16,
    color: '#1f2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
  },
  shopBtn: {
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1f2937',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
  },
  checkoutBtn: {
    flex: 2,
    borderRadius: 12,
  },
});

export default CartScreen;
