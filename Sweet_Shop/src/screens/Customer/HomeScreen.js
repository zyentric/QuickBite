import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
  StatusBar
} from 'react-native';
import { Title, TextInput, Badge, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../../components/ProductCard';
import api from '../../utils/api';
import { useCartStore } from '../../stores/cartStore';
const { useNavigation } = require('@react-navigation/native');
const { useLoadingStore } = require('../../stores/loadingStore');

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const addToCart = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const setLoading = useLoadingStore(state => state.setLoading);
  const navigation = useNavigation();

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#171a29" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Title style={styles.headerTitle}>Sweet Shop Delights</Title>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')} style={styles.iconBtn}>
            <Icon name="history" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconBtn}>
            <Icon name="cart-outline" size={28} color="#fff" />
            {cartCount > 0 && (
              <Badge style={styles.badge}>{cartCount}</Badge>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for laddoo, barfi..."
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          theme={{ roundness: 12, colors: { primary: '#F97316' } }}
          left={<TextInput.Icon icon="magnify" color="#F97316" />}
          style={styles.search}
        />
      </View>
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={addToCart}
            onViewDetails={() =>
              navigation.navigate('ProductDetail', { product: item })
            }
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    padding: 20, 
    paddingTop: 40,
    backgroundColor: '#171a29',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
  },
  greeting: {
    color: '#a1a1aa',
    fontSize: 16,
    fontWeight: '600'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: -4
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: 16,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#F97316',
    fontWeight: 'bold'
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: -24,
    marginBottom: 8,
    zIndex: 10,
  },
  search: { 
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default HomeScreen;
