import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import api from '../../utils/api';
const { KeyboardAwareScrollView } = require('react-native-keyboard-aware-scroll-view');

const SettingsScreen = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radius, setRadius] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setLat(res.data.shopLat.toString());
      setLng(res.data.shopLng.toString());
      setRadius(res.data.radius.toString());
      setOpeningHours(res.data.openingHours || '');
    } catch (err) {
      Alert.alert('Error', 'Failed to load settings');
    }
  };

  const saveSettings = async () => {
    try {
      await api.post('/settings', {
        shopLat: parseFloat(lat),
        shopLng: parseFloat(lng),
        radius: parseInt(radius),
        openingHours,
      });
      Alert.alert('Success', 'Settings saved');
    } catch (err) {
      Alert.alert('Error', 'Failed to save');
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Title style={styles.title}>Store Settings</Title>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location Settings</Text>
        <TextInput
          label="Shop Latitude"
          value={lat}
          onChangeText={setLat}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ roundness: 12, colors: { primary: '#F97316' } }}
        />
        <TextInput
          label="Shop Longitude"
          value={lng}
          onChangeText={setLng}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ roundness: 12, colors: { primary: '#F97316' } }}
        />
        <TextInput
          label="Delivery Radius (km)"
          value={radius}
          onChangeText={setRadius}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ roundness: 12, colors: { primary: '#F97316' } }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Business Info</Text>
        <TextInput
          label="Opening Hours (e.g. 9 AM - 10 PM)"
          value={openingHours}
          onChangeText={setOpeningHours}
          style={styles.input}
          mode="outlined"
          theme={{ roundness: 12, colors: { primary: '#F97316' } }}
        />
      </View>

      <Button 
        mode="contained" 
        onPress={saveSettings} 
        style={styles.button}
        contentStyle={{ paddingVertical: 12 }}
        labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
        buttonColor="#F97316"
      >
        Save Settings
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 24,
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#4b5563',
  },
  input: { 
    marginBottom: 16, 
    backgroundColor: '#fff',
  },
  button: { 
    marginTop: 8, 
    borderRadius: 12,
  },
});

export default SettingsScreen;
