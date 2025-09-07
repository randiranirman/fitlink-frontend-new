import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { registerForTrainer } from '../../../service/clientRegisterTrainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecodeClaims } from '../../../service/authService';



const ClientRegisterWithTrainer = ({ route, navigation }) => {
  // Get trainer data from navigation params
  const { trainer } = useLocalSearchParams();
  const parsedTrainer = trainer ?  JSON.parse(trainer) : null
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    contactNumber: '',
    weight: '',
    height: '',
    gender: '',
    age: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // If no trainer data, show error
  useEffect(() => {
    if (!parsedTrainer) {
      Alert.alert('Error', 'No trainer selected', [
        { text: 'OK', onPress: () => navigation?.goBack() }
      ]);
    }
  }, [parsedTrainer, navigation]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Contact number validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (formData.contactNumber.length < 10) {
      newErrors.contactNumber = 'Contact number must be at least 10 digits';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Weight validation
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    // Height validation
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (isNaN(formData.height) || parseFloat(formData.height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }

    // Gender validation
    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) <= 0 || parseInt(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    setLoading(true);

    try {
      // Prepare API payload (clientId comes from token)
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        contactNumber: formData.contactNumber.trim(),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender.trim(),
        age: parseFloat(formData.age),
        clientId: jwtDecodeClaims(AsyncStorage.getItem("AccessToken").id)  // Include trainer ID for registration
      };

      registerForTrainer(payload, parsedTrainer.id)

      
       

      Alert.alert(
        'Registration Successful!', 
        `You have successfully registered with ${trainer.name}!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back or to dashboard
              navigation?.goBack();
            }
          }
        ]
      );

    } catch (error) {
      console.log('Registration error:', error);
      Alert.alert(
        'Registration Failed', 
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = ['Male', 'Female'];

  const renderInput = (label, field, placeholder, keyboardType = 'default', multiline = false) => (
    <View className="mb-4">
      <Text className="text-white text-base font-medium mb-2">{label}</Text>
      <TextInput
        className={`bg-zinc-800 text-white p-4 rounded-xl border ${
          errors[field] ? 'border-red-500' : 'border-zinc-700'
        }`}
        placeholder={placeholder}
        placeholderTextColor="#71717a"
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {errors[field] && (
        <Text className="text-red-500 text-sm mt-1">{errors[field]}</Text>
      )}
    </View>
  );

  const renderGenderSelector = () => (
    <View className="mb-4">
      <Text className="text-white text-base font-medium mb-2">Gender</Text>
      <View className="flex-row space-x-2">
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option}
            className={`flex-1 p-4 rounded-xl border ${
              formData.gender === option
                ? 'bg-green-500 border-green-500'
                : 'bg-zinc-800 border-zinc-700'
            }`}
            onPress={() => handleInputChange('gender', option)}
          >
            <Text className={`text-center font-medium ${
              formData.gender === option ? 'text-black' : 'text-white'
            }`}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.gender && (
        <Text className="text-red-500 text-sm mt-1">{errors.gender}</Text>
      )}
    </View>
  );

  if (!parsedTrainer) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="text-white mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-6">
          <TouchableOpacity 
            className="mb-4"
            onPress={() => navigation?.goBack()}
          >
            <Text className="text-green-500 text-lg">← Back</Text>
          </TouchableOpacity>
          
          <Text className="text-white text-3xl font-bold mb-2">
            Join Trainer
          </Text>
          <Text className="text-zinc-400 text-base">
            Complete your profile to start training
          </Text>
        </View>

        {/* Trainer Info Card */}
        <View className="mx-6 mb-8">
          <Text className="text-white text-lg font-semibold mb-3">Your Selected Trainer</Text>
          <View className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold mb-1">
                  {trainer.name}
                </Text>
                <Text className="text-zinc-400 text-base mb-2">
                  {trainer.email}
                </Text>
                <View className="bg-green-500 self-start px-3 py-1 rounded-full">
                  <Text className="text-black text-xs font-medium uppercase">
                    {trainer.appUserRole}
                  </Text>
                </View>
              </View>
              <View className="bg-green-500 w-16 h-16 rounded-full items-center justify-center ml-4">
                <Text className="text-black font-bold text-2xl">
                  {parsedTrainer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <View className="bg-zinc-700 h-px my-4" />
            <Text className="text-zinc-300 text-center">
              Ready to start your fitness journey with {parsedTrainer.name}?
            </Text>
          </View>
        </View>

        {/* Client Registration Form */}
        <View className="px-6">
          <Text className="text-white text-lg font-semibold mb-4">Your Information</Text>
          
          {renderInput('Full Name', 'name', 'Enter your full name')}
          
          {renderInput('Email Address', 'email', 'Enter your email', 'email-address')}
          
          {renderInput('Contact Number', 'contactNumber', 'Enter your phone number', 'phone-pad')}
          
          {renderInput('Address', 'address', 'Enter your complete address', 'default', true)}
          
          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <Text className="text-white text-base font-medium mb-2">Weight (kg)</Text>
              <TextInput
                className={`bg-zinc-800 text-white p-4 rounded-xl border ${
                  errors.weight ? 'border-red-500' : 'border-zinc-700'
                }`}
                placeholder="70.5"
                placeholderTextColor="#71717a"
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                keyboardType="numeric"
              />
              {errors.weight && (
                <Text className="text-red-500 text-sm mt-1">{errors.weight}</Text>
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-white text-base font-medium mb-2">Height (cm)</Text>
              <TextInput
                className={`bg-zinc-800 text-white p-4 rounded-xl border ${
                  errors.height ? 'border-red-500' : 'border-zinc-700'
                }`}
                placeholder="175.5"
                placeholderTextColor="#71717a"
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                keyboardType="numeric"
              />
              {errors.height && (
                <Text className="text-red-500 text-sm mt-1">{errors.height}</Text>
              )}
            </View>
          </View>

          {renderGenderSelector()}
          
          <View className="mb-8">
            <Text className="text-white text-base font-medium mb-2">Age</Text>
            <TextInput
              className={`bg-zinc-800 text-white p-4 rounded-xl border ${
                errors.age ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="25"
              placeholderTextColor="#71717a"
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
              keyboardType="numeric"
            />
            {errors.age && (
              <Text className="text-red-500 text-sm mt-1">{errors.age}</Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            className={`py-4 rounded-xl items-center mb-6 ${
              loading ? 'bg-zinc-700' : 'bg-green-500'
            }`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="#ffffff" size="small" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Registering...
                </Text>
              </View>
            ) : (
              <Text className="text-black font-semibold text-lg">
                Join {parsedTrainer.name}
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center mb-8">
            <Text className="text-zinc-500 text-center text-sm">
              By registering, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientRegisterWithTrainer;