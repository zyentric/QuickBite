import React from 'react';
import { List } from 'react-native-paper';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

const CartItem = ({ item, onUpdateQuantity }) => (
  <List.Item
    title={item.product.name}
    description={`₹${item.product.price} x ${item.quantity}`}
    right={() => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button
          onPress={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
        >
          -
        </Button>
        <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
        <Button
          onPress={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
        >
          +
        </Button>
      </View>
    )}
  />
);

export default CartItem;
