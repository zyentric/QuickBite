import React from 'react';
import { ScrollView, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Title, Paragraph, Button, Text } from 'react-native-paper';
import { useCartStore } from '../../stores/cartStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const { useNavigation } = require('@react-navigation/native');

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const addToCart = useCartStore(state => state.addItem);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image || 'https://via.placeholder.com/400' }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Title style={styles.title}>{product.name}</Title>
            <Text style={styles.price}>₹{product.price}</Text>
          </View>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Available: {product.quantity}</Text>
          </View>
          <View style={styles.divider} />
          <Title style={styles.sectionTitle}>Description</Title>
          <Paragraph style={styles.description}>{product.description}</Paragraph>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Button 
          mode="contained" 
          onPress={() => addToCart(product)}
          style={styles.addButton}
          contentStyle={{ paddingVertical: 12 }}
          labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
          buttonColor="#F97316"
        >
          Add to Cart
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: {
    position: 'relative',
  },
  image: { 
    width: width, 
    height: width, // Square aspect ratio
    backgroundColor: '#f0f0f0'
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  info: { 
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
    flex: 1,
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F97316',
  },
  stockBadge: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  stockText: {
    color: '#4b5563',
    fontWeight: '700',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    color: '#374151',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6b7280',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32, // safe area padding
    borderTopWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 10,
  },
  addButton: {
    borderRadius: 12,
  }
});

export default ProductDetailScreen;
