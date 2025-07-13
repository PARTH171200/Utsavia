import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile } from '../utils/_api';
import CustomButton from '../components/CustomButton';

const SavedProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
        } else {
          setError('Failed to load profile.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFF" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Saved Profile</Text>

        {profile?.profilePicture && (
          <Image source={{ uri: profile.profilePicture }} style={styles.image} />
        )}

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{profile?.name || 'N/A'}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile?.email || 'N/A'}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Company Name:</Text>
          <Text style={styles.value}>{profile?.companyName || 'N/A'}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{profile?.phone || 'N/A'}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{profile?.address || 'N/A'}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{profile?.location || 'N/A'}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>Payment Mode:</Text>
          <Text style={styles.value}>{profile?.paymentMode || 'N/A'}</Text>
        </View>

        {profile?.paymentMode === 'upi' && (
          <View style={styles.readOnlyField}>
            <Text style={styles.label}>UPI ID:</Text>
            <Text style={styles.value}>{profile?.upiId || 'N/A'}</Text>
          </View>
        )}

        {profile?.paymentMode === 'bank' && (
          <>
            <View style={styles.readOnlyField}>
              <Text style={styles.label}>Account Number:</Text>
              <Text style={styles.value}>{profile?.bankDetails?.accountNumber || 'N/A'}</Text>
            </View>
            <View style={styles.readOnlyField}>
              <Text style={styles.label}>IFSC Code:</Text>
              <Text style={styles.value}>{profile?.bankDetails?.ifscCode || 'N/A'}</Text>
            </View>
            <View style={styles.readOnlyField}>
              <Text style={styles.label}>Account Holder Name:</Text>
              <Text style={styles.value}>{profile?.bankDetails?.accountHolderName || 'N/A'}</Text>
            </View>
          </>
        )}

        {/* Edit Profile Button */}
        <CustomButton
          title="Edit Profile"
          handlePress={() => router.push('/EditProfile')}
          containerStyles={{ marginTop: 28 }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SavedProfileScreen;
