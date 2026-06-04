import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Animated, Text, StyleSheet, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ToastContext = createContext(null);
const { width } = Dimensions.get('window');

export const ToastProvider = ({ children }) => {
  const [toastConfig, setToastConfig] = useState({ visible: false, message: '', type: 'success' });
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setToastConfig({ visible: true, message, type });
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 50,
        useNativeDriver: true,
        bounciness: 12,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [translateY, opacity]);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastConfig(prev => ({ ...prev, visible: false }));
    });
  }, [translateY, opacity]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastConfig.visible && (
        <Animated.View 
          style={[
            styles.toastContainer, 
            { transform: [{ translateY }], opacity }
          ]}
        >
          <View style={[styles.toast, toastConfig.type === 'error' ? styles.errorToast : styles.successToast]}>
            <Icon 
              name={toastConfig.type === 'error' ? 'alert-circle' : 'check-circle'} 
              size={24} 
              color="#FFF" 
            />
            <Text style={styles.message}>{toastConfig.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  successToast: {
    backgroundColor: '#F97316', // Primary Orange
  },
  errorToast: {
    backgroundColor: '#EF4444', // Red
  },
  message: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
  },
});
