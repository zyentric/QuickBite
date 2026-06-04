import React, { useState } from 'react';
import { StyleSheet, View, Alert, ImageBackground, Dimensions } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { useAuthStore } from '../../stores/authStore';
const {
  KeyboardAwareScrollView,
} = require('react-native-keyboard-aware-scroll-view');
const { useNavigation } = require('@react-navigation/native');
const { useLoadingStore } = require('../../stores/loadingStore');

const { height } = Dimensions.get('window');
const BG_IMAGE = "https://images.unsplash.com/photo-1625631980741-523c04dce842?q=80&w=1200&auto=format&fit=crop";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigation = useNavigation();
  const setLoading = useLoadingStore(state => state.setLoading);

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert('Error', 'Email and password required');
    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials');
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
            <Title style={styles.title}>Welcome Back</Title>
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
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              contentStyle={{ paddingVertical: 12 }}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
              buttonColor="#F97316"
            >
              Sign In
            </Button>
            <View style={styles.signupContainer}>
              <Text style={styles.mutedText}>Don't have an account? </Text>
              <Text style={styles.btn} onPress={() => navigation.navigate('Signup')}>
                Sign Up
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
  signupContainer: {
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

export default LoginScreen;
