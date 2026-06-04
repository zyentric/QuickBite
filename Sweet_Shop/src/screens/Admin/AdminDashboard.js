import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Title, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminDashboard = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Dashboard Overview</Title>
      
      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.gridItem}
          onPress={() => navigation.navigate('ManageProducts')}
        >
          <Icon name="package-variant-closed" size={40} color="#F97316" />
          <Text style={styles.gridText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridItem}
          onPress={() => navigation.navigate('ManageOrders')}
        >
          <Icon name="clipboard-list-outline" size={40} color="#F97316" />
          <Text style={styles.gridText}>Live Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="cog-outline" size={40} color="#6b7280" />
          <Text style={styles.gridText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 24,
    color: '#1f2937',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#fff',
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  gridText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  }
});

export default AdminDashboard;
