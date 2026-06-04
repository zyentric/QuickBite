import React from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Alert, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';

const ProductCard = ({ product, onDelete, onAddToCart, onViewDetails }) => {
  const confirmDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(product._id),
        },
      ],
    );
  };

  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback 
      onPress={() => onViewDetails && onViewDetails(product)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card style={styles.card}>
          <Card.Cover
        source={{ uri: product.image || 'https://via.placeholder.com/300' }}
        style={styles.image}
      />
      <Card.Content style={styles.content}>
        <Title style={styles.title}>{product.name}</Title>
        <Paragraph style={styles.description}>
          ₹{product.price} | Qty: {product.quantity}
        </Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        {onDelete && (
          <Button
            mode="contained"
            onPress={confirmDelete}
            style={[styles.button, styles.deleteButton]}
          >
            Delete
          </Button>
        )}
        {onAddToCart && (
          <Button
            mode="contained"
            onPress={() => onAddToCart(product)}
            style={[styles.button, styles.addButton]}
            labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            buttonColor="#F97316"
          >
            Add to Cart
          </Button>
        )}
      </Card.Actions>
        </Card>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    color: '#1f2937',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  button: {
    minWidth: 120,
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  addButton: {
    backgroundColor: '#F97316',
  },
});

export default ProductCard;
