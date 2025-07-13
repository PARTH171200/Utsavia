import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const router = useRouter();

  const handleTilePress = (screen) => {
    router.push(`/${screen}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/SavedProfile')}>  
          <Ionicons name="person-circle-outline" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        <Tile title="Show Booking" icon="calendar-outline" onPress={() => handleTilePress('ShowBooking')} />
        <Tile title="Add Items" icon="add-circle-outline" onPress={() => handleTilePress('AddItem')} />
        <Tile title="Payment History" icon="wallet-outline" onPress={() => handleTilePress('PaymentHistory')} />
        <Tile title="Added Items" icon="list-outline" onPress={() => handleTilePress('AddedItems')} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Tile = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress}>
      <Ionicons name={icon} size={36} color="#FFF" style={styles.icon} />
      <Text style={styles.tileText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  gridContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default Home;
