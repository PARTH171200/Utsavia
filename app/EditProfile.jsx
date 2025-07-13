import { StyleSheet, View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';

const EditProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Pre-fill form with existing user data
  const [form, setForm] = useState({
    companyName: params.companyName || '',
    phone: params.phone || '',
    address: params.address || '',
    location: params.location || '',
    paymentMode: params.paymentMode || 'upi',
    paymentDetails: params.paymentDetails || '',
    accountNumber: params.accountNumber || '',
    ifscCode: params.ifscCode || '',
    accountHolderName: params.accountHolderName || '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfile = () => {
    // Here, you can integrate your API call to update the user's profile.
    Alert.alert('Profile Updated', 'Your profile has been successfully updated.', [
      { text: 'OK', onPress: () => router.push({ pathname: '/SavedProfile', params: form }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.main}>
        <Text style={styles.title}>Edit Profile</Text>

        <Text style={styles.label}>Company Name</Text>
        <TextInput style={styles.input} value={form.companyName} onChangeText={(val) => handleChange('companyName', val)} placeholder="Company Name" placeholderTextColor="#888" />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={form.phone} onChangeText={(val) => handleChange('phone', val)} placeholder="Phone" placeholderTextColor="#888" keyboardType="phone-pad" />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={form.address} onChangeText={(val) => handleChange('address', val)} placeholder="Address" placeholderTextColor="#888" />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={form.location} onChangeText={(val) => handleChange('location', val)} placeholder="Location" placeholderTextColor="#888" />

        <Text style={styles.label}>Payment Mode</Text>
        <TextInput
          style={styles.input}
          value={form.paymentMode}
          onChangeText={(val) => handleChange('paymentMode', val)}
          placeholder="Payment Mode (e.g., UPI, Bank Transfer)"
          placeholderTextColor="#888"
        />

        {form.paymentMode.toLowerCase() === 'upi' ? (
          <>
            <Text style={styles.label}>UPI ID</Text>
            <TextInput style={styles.input} value={form.paymentDetails} onChangeText={(val) => handleChange('paymentDetails', val)} placeholder="UPI ID" placeholderTextColor="#888" />
          </>
        ) : (
          <>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              value={form.accountNumber}
              onChangeText={(val) => handleChange('accountNumber', val)}
              placeholder="Bank Account Number"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />

            <Text style={styles.label}>IFSC Code</Text>
            <TextInput style={styles.input} value={form.ifscCode} onChangeText={(val) => handleChange('ifscCode', val)} placeholder="IFSC Code" placeholderTextColor="#888" />

            <Text style={styles.label}>Account Holder Name</Text>
            <TextInput
              style={styles.input}
              value={form.accountHolderName}
              onChangeText={(val) => handleChange('accountHolderName', val)}
              placeholder="Account Holder Name"
              placeholderTextColor="#888"
            />
          </>
        )}

        {/* Save Button */}
        <CustomButton title="Save Profile" handlePress={saveProfile} containerStyles={{ marginTop: 28 }} />
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
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    color: '#FFF',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default EditProfile;
