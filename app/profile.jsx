import { StyleSheet, View, Text, TextInput, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import CustomButton from '../components/CustomButton';
import { updateProfile } from '../utils/_api';

const Profile = () => {
  const router = useRouter();
  const { name, email } = useLocalSearchParams();
  
  const [form, setForm] = useState({
    companyName: '',
    phone: '',
    address: '',
    location: '',
    paymentMode: 'upi',
    paymentDetails: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const { phone, address, companyName, paymentMode, paymentDetails, accountNumber, ifscCode, accountHolderName } = form;

    if (!companyName || !phone || !address || !form.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    if (paymentMode === 'upi' && !paymentDetails.includes('@')) {
      Alert.alert('Error', 'Please enter a valid UPI ID');
      return false;
    }

    if (paymentMode === 'bank') {
      if (!accountNumber || !ifscCode || !accountHolderName) {
        Alert.alert('Error', 'Please fill in all bank account details');
        console.log("Account no:"+accountNumber );
        return false;
      }
      if (accountNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid account number');
        return false;
      }
    }

    return true;
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const { street, city, region, postalCode, country } = address[0];
        const formattedAddress = `${street || ''}, ${city || ''}, ${region || ''}, ${postalCode || ''}, ${country || ''}`;
        setForm((prev) => ({ ...prev, location: formattedAddress }));
        Alert.alert('Location Fetched', `Your location: ${formattedAddress}`);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch your location. Please try again.');
    }
  };

  const setPaymentMode = (mode) => {
    setForm((prev) => ({
      ...prev,
      paymentMode: mode,
      upiId: mode === 'upi' ? '' : null, // Reset UPI ID when switching
      accountNumber: mode === 'bank' ? '' : null, // Reset bank details when switching
      ifscCode: mode === 'bank' ? '' : null,
      accountHolderName: mode === 'bank' ? '' : null,
    }));
  };
  

  const submit = async () => {
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    const payload = {
      ...form,
      upiId: form.paymentMode === 'upi' ? form.paymentDetails : null, // Store UPI ID correctly
      bankDetails: form.paymentMode === 'bank' ? {
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        accountHolderName: form.accountHolderName
      } : null // Ensure bank details are sent properly
    };
  
    try {
      console.log('Profile data being sent:', JSON.stringify(payload));
      const response = await updateProfile(payload);
      console.log('Response:', response);
  
      Alert.alert('Success', response.message || 'Profile updated successfully!');
      router.replace('/home');
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  
  
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.main}>
        <Text style={styles.title}>Complete Your Profile</Text>

        {/* Non-editable name and email */}
        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        {/* Editable fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter your company name"
          placeholderTextColor="#888"
          value={form.companyName}
          onChangeText={(text) => setForm((prev) => ({ ...prev, companyName: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#888"
          value={form.phone}
          onChangeText={(text) => setForm((prev) => ({ ...prev, phone: text }))}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          placeholderTextColor="#888"
          value={form.address}
          onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your location or fetch it automatically"
          placeholderTextColor="#888"
          value={form.location}
          onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
        />

        <CustomButton
          title="Fetch Current Location"
          handlePress={getLocation}
          containerStyles={{ marginTop: 8 }}
          disabled={isSubmitting}
        />

        {/* Payment Mode Section */}
        <View style={styles.paymentContainer}>
          <Text style={styles.label}>Payment Mode:</Text>
          <View style={styles.radioContainer}>
            <Text
              style={[styles.radioText, form.paymentMode === 'upi' && styles.selectedRadioText]}
              onPress={() => setForm((prev) => ({ ...prev, paymentMode: 'upi' }))}
            >
              UPI
            </Text>
            <Text
              style={[styles.radioText, form.paymentMode === 'bank' && styles.selectedRadioText]}
              onPress={() => setForm((prev) => ({ ...prev, paymentMode: 'bank' }))}
            >
              Bank Account
            </Text>
          </View>
        </View>

        {form.paymentMode === 'upi' ? (
          <TextInput
          style={styles.input}
          placeholder="Enter your UPI ID (e.g., example@upi)"
          placeholderTextColor="#888"
          value={form.paymentDetails}
          onChangeText={(text) => setForm((prev) => ({ ...prev, paymentDetails: text }))}
        />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your account number"
              placeholderTextColor="#888"
              value={form.accountNumber}
              onChangeText={(text) => setForm((prev) => ({ ...prev, accountNumber: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your IFSC code"
              placeholderTextColor="#888"
              value={form.ifscCode}
              onChangeText={(text) => setForm((prev) => ({ ...prev, ifscCode: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter account holder's name"
              placeholderTextColor="#888"
              value={form.accountHolderName}
              onChangeText={(text) => setForm((prev) => ({ ...prev, accountHolderName: text }))}
            />
          </>
        )}

        <CustomButton
          title="Save Profile"
          handlePress={submit}
          containerStyles={{ marginTop: 28 }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  main: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  readOnlyField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  value: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  paymentContainer: {
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  radioText: {
    fontSize: 16,
    color: '#888',
    marginRight: 16,
  },
  selectedRadioText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Profile;
