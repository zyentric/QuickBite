import React from 'react';
import { List, Chip } from 'react-native-paper';

const OrderItem = ({ order }) => (
  <List.Item
    title={`Order #${order._id}`}
    description={`Total: ₹${order.total} | ${new Date(
      order.createdAt,
    ).toLocaleString()}`}
    right={() => <Chip>{order.status}</Chip>}
  />
);

export default OrderItem;
