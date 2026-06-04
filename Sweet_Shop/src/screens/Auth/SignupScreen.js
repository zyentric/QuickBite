import React, { useState } from 'react';
import { StyleSheet, View, Alert, ImageBackground } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { useAuthStore } from '../../stores/authStore';
const {
  KeyboardAwareScrollView,
} = require('react-native-keyboard-aware-scroll-view');
const { useNavigation } = require('@react-navigation/native');
const { useLoadingStore } = require('../../stores/loadingStore');

const BG_IMAGE = "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop";

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const signup = useAuthStore(state => state.signup);
  const navigation = useNavigation();
  const setLoading = useLoadingStore(state => state.setLoading);

  const handleSignup = async () => {
    if (!email || !password || !phone)
      return Alert.alert('Error', 'All fields required');
    try {
      setLoading(true);
      await signup(email, password, phone);
      Alert.alert('Success', 'Account created');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Signup Failed', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bgImage}>
      <View style={styles.overlay}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={20}
        >
          <View style={styles.card}>
            <Title style={styles.title}>Create Account</Title>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              theme={{ roundness: 12, colors: { primary: '#F97316' } }}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              theme={{ roundness: 12, colors: { primary: '#F97316' } }}
            />
            <TextInput
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              theme={{ roundness: 12, colors: { primary: '#F97316' } }}
            />
            <Button
              mode="contained"
              onPress={handleSignup}
              style={styles.button}
              contentStyle={{ paddingVertical: 12 }}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
              buttonColor="#F97316"
            >
              Sign Up
            </Button>
            <View style={styles.loginContainer}>
              <Text style={styles.mutedText}>Already have an account? </Text>
              <Text style={styles.btn} onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1f2937',
  },
  input: { 
    marginBottom: 20, 
    backgroundColor: '#fff',
  },
  button: { 
    marginTop: 10, 
    borderRadius: 12,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  mutedText: {
    color: '#6b7280',
    fontSize: 15,
  },
  btn: { 
    fontWeight: '800', 
    color: '#F97316',
    fontSize: 15,
  },
});

export default SignupScreen;
