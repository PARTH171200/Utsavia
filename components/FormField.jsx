import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.inputContainer, isFocused ? { borderColor: 'gold' } : null]}>
        <TextInput
          key={showPassword ? "visible" : "hidden"} 
          style={styles.textInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={title.toLowerCase() === "password" ? !showPassword : false}
          {...props}
        />
        {title.toLowerCase() === "password" && (
          <TouchableOpacity
            onPress={() => {
              setShowPassword((prev) => !prev);
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} 
          >
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    color: '#F5F5F5',
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2C2C34',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    marginLeft: 8,
  },
});

export default FormField;