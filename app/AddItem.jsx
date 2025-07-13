import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, Alert, 
  ScrollView, StatusBar, TextInput, Dimensions 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uploadToCloudinary , addItem } from '../utils/_api';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const AddItems = () => {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(''); 
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const richText = useRef(null);
  const scrollViewRef = useRef(null); // ✅ Ref for ScrollView

  const cities = ["Ahmedabad", "Bangalore", "Mumbai", "Jaipur", "Delhi", "Kolkata", "Pune", "Chennai", "Hyderabad"];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your media library.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not pick an image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!category || !city || !name || !image || !description || !price) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Uploading image to Cloudinary...");
      const imageUrl = await uploadToCloudinary(image);
      console.log("Image uploaded:", imageUrl);

      const itemData = { category, city, name, imageUrl, description, price: parseFloat(price) };
      console.log("Sending item data:", itemData);

      const response = await addItem(itemData);
      console.log("📡 Raw API Response:", response);

      const result = await response.json(); 
      console.log("✅ Parsed JSON Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to add item");
      }

      Alert.alert("Success", "Item added successfully!");

      // ✅ Reset form fields after submission
      setCategory('');
      setCity('');
      setName('');
      setImage(null);
      setDescription('');
      setPrice('');

      // ✅ Scroll to top
      scrollViewRef.current.scrollTo({ y: 0, animated: true });

    } catch (error) {
      console.error("❌ Add Item Error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Category Dropdown */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Category</Text>
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Birthdays" value="Birthday" />
            <Picker.Item label="Anniversary" value="Anniversary" />
            <Picker.Item label="Baby shower" value="Baby Shower" />
            <Picker.Item label="Festive" value="Festive" />
            <Picker.Item label="Diwali" value="Diwali" />
          </Picker>
        </View>

        {/* City Dropdown */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select City</Text>
          <Picker selectedValue={city} onValueChange={(itemValue) => setCity(itemValue)} style={styles.picker}>
            <Picker.Item label="Select City" value="" />
            {cities.map((cityOption) => (
              <Picker.Item key={cityOption} label={cityOption} value={cityOption} />
            ))}
          </Picker>
        </View>

        <TextInput style={styles.input} placeholder="Enter item name" placeholderTextColor="#888" value={name} onChangeText={setName} />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text style={styles.imagePickerText}>Pick an Image</Text>}
        </TouchableOpacity>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Enter Description</Text>
          <View style={styles.richEditorWrapper}>
            <RichEditor
              ref={richText}
              style={styles.richEditor}
              placeholder="Write something..."
              initialContentHTML={description} 
              onChange={(text) => setDescription(text || '')} 
            />
          </View>
          <RichToolbar editor={richText} style={styles.richToolbar} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter price"
          placeholderTextColor="#888"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Add Item'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
  },
  pickerContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    color: '#FFF',
    backgroundColor: '#1A1A1A',
  },
  imagePicker: {
    height: width * 0.6,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 30,
  },
  imagePickerText: {
    color: '#888',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    borderRadius: 16,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddItems;
