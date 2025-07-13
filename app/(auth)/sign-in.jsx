import { StyleSheet, View, Text, Image, Dimensions, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { signIn } from '../../utils/_api';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await signIn(form);
      Alert.alert('Success', response.message || 'Sign-in successful!');
      router.replace('/home'); 
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo-small.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Utsavia</Text>
        </View>
        <Text style={styles.subtitle}>Log in to Utsavia</Text>

        <FormField
          title="Email"
          value={form.email}
          placeholder="Enter your email"
          handleChangeText={(e) => setForm((prev) => ({ ...prev, email: e }))}
          keyboardType="email-address"
        />
        <FormField
          title="Password"
          value={form.password}
          placeholder="Enter your password"
          handleChangeText={(e) => setForm((prev) => ({ ...prev, password: e }))}
          secureTextEntry={true}
        />

        <CustomButton
          title="Sign In"
          handlePress={submit}
          containerStyles={{ marginTop: 28 }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />

        <View style={styles.next}>
          <Text style={styles.text1}>Don't have an account?</Text>
          <Link href="/sign-up" style={{ color: 'green' }}>Sign Up</Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#000000',
  },
  main: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 24,
    minHeight: Dimensions.get('window').height - 100,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  next: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    gap: 10,
  },
  text1: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'PRegular',
  },
});

export default SignIn;