import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { TextInput, Button, Title, Card, Text } from 'react-native-paper';
import ProductCard from '../../components/ProductCard';
import api from '../../utils/api';
import { useLoadingStore } from '../../stores/loadingStore';
const { KeyboardAwareScrollView } = require('react-native-keyboard-aware-scroll-view');

const ManageProductsScreen = () => {
  const setLoading = useLoadingStore(state => state.setLoading);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!name || !price || !quantity)
      return Alert.alert('Error', 'Name, Price, Quantity required');
    try {
      setLoading(true);
      await api.post('/products', {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        image,
      });
      fetchProducts();
      setShowAddForm(false);
      setName('');
      setPrice('');
      setQuantity('');
      setDescription('');
      setImage('');
      Alert.alert('Success', 'Product added');
    } catch (err) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async id => {
    try {
      setLoading(true);
      await api.delete(`/products/${id}`);
      fetchProducts();
      Alert.alert('Success', 'Product deleted');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onDelete={deleteProduct}
            onViewDetails={() => {}}
          />
        )}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          <View>
            <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
              <View style={styles.addButtonCard}>
                <Text style={styles.addBtnText}>
                  {showAddForm ? '✕ Close Form' : '+ Add New Product'}
                </Text>
              </View>
            </TouchableOpacity>
            {showAddForm && (
              <View style={styles.form}>
                <Title style={styles.formTitle}>New Product Details</Title>
                <TextInput
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  mode="outlined"
                  theme={{ roundness: 12, colors: { primary: '#F97316' } }}
                />
                <TextInput
                  label="Price (₹)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                  theme={{ roundness: 12, colors: { primary: '#F97316' } }}
                />
                <TextInput
                  label="Quantity in Stock"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                  theme={{ roundness: 12, colors: { primary: '#F97316' } }}
                />
                <TextInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.input}
                  mode="outlined"
                  theme={{ roundness: 12, colors: { primary: '#F97316' } }}
                  multiline
                  numberOfLines={3}
                />
                <TextInput
                  label="Image URL"
                  value={image}
                  onChangeText={setImage}
                  style={styles.input}
                  mode="outlined"
                  theme={{ roundness: 12, colors: { primary: '#F97316' } }}
                />
                <Button
                  mode="contained"
                  onPress={addProduct}
                  style={styles.submitButton}
                  buttonColor="#F97316"
                  labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                >
                  Save Product
                </Button>
              </View>
            )}
            <Title style={styles.listTitle}>Live Products ({products.length})</Title>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  addButtonCard: {
    margin: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ffcc80',
    alignItems: 'center'
  },
  addBtnText: {
    color: '#e65100',
    fontSize: 18,
    fontWeight: '800'
  },
  form: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
    color: '#1f2937'
  },
  input: { 
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  submitButton: { 
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 4,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1f2937',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8
  }
});

export default ManageProductsScreen;
