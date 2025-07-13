import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <Text style={styles.text}>This page will display your payment history.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#AAA',
  },
});

export default PaymentHistory;
