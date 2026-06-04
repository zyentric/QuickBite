import React from 'react';
import { IconButton } from 'react-native-paper';
import { useAuthStore } from '../stores/authStore';
import { Alert } from 'react-native';

const HeaderRightLogout = () => {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <IconButton
      icon="logout"
      color="#c2185b"
      size={24}
      onPress={handleLogout}
      accessibilityLabel="Logout"
    />
  );
};

export default HeaderRightLogout;
