import React from 'react';
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native';

const Preloader = ({ visible }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Preloader;
