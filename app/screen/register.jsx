import { View, Text, TextInput, Pressable, Animated, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { registerUser } from "../service/authService";

const Register = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  

   

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async () => {
  if (!isFormValid()) return;

  setIsLoading(true);

  const requestBody = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    appUserRole: "CLIENT",
    username: formData.email
  };

   console.log( requestBody)

  try {
    const response = await registerUser(requestBody);
    console.log("User registered successfully:", response);
    // You can redirect or clear form here
  } catch (error) {
    console.log("Something went wrong:", error);
  } finally {
    setIsLoading(false);
  }
};



  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    const { name, email, password, confirmPassword } = formData;
    return (
      name.trim().length >= 2 &&
      email.includes('@') &&
      password.length >= 6 &&
      password === confirmPassword &&
      acceptTerms
    );
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { strength: 0, text: '', color: 'bg-gray-600' };
    if (password.length < 6) return { strength: 25, text: 'Too short', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, text: 'Weak', color: 'bg-yellow-500' };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      return { strength: 100, text: 'Strong', color: 'bg-green-500' };
    }
    return { strength: 75, text: 'Good', color: 'bg-blue-500' };
  };

  

  const handleSocialSignUp = (provider) => {
    console.log(`Sign up with ${provider}`);
  };

  
  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background decorative elements */}
      <View className="absolute top-20 right-10 w-32 h-32 bg-green-500 rounded-full opacity-5 blur-xl" />
      <View className="absolute bottom-40 left-10 w-24 h-24 bg-blue-500 rounded-full opacity-8 blur-lg" />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Animated.View 
          className="flex-1 px-6 pt-16 pb-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Header */}
          <View className="items-center mb-8">
            {/* Logo */}
            <Animated.View 
              className="w-16 h-16 bg-green-500 rounded-2xl mb-6 justify-center items-center"
              style={{
                transform: [{ scale: fadeAnim }]
              }}
            >
              <Text className="text-black text-2xl font-black">FL</Text>
            </Animated.View>

            <Text className="text-white text-3xl font-black text-center mb-2">
              Join FitLink
            </Text>
            <Text className="text-gray-400 text-base text-center">
              Create your account and start your fitness journey
            </Text>
          </View>

          {/* Registration Form */}
          <View className="mb-6">
            {/* Full Name Input */}
            <View className="mb-4">
              <Text className="text-gray-300 text-sm font-medium mb-2 ml-1">
                Full Name
              </Text>
              <View className="bg-gray-900 rounded-xl border border-gray-800 focus-within:border-green-500">
                <TextInput
                  className="text-white p-4 text-base"
                  placeholder="Enter your full name"
                  placeholderTextColor="#6b7280"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-300 text-sm font-medium mb-2 ml-1">
                Email Address
              </Text>
              <View className="bg-gray-900 rounded-xl border border-gray-800 focus-within:border-green-500">
                <TextInput
                  className="text-white p-4 text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="#6b7280"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-addres"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-2">
              <Text className="text-gray-300 text-sm font-medium mb-2 ml-1">
                Password
              </Text>
              <View className="bg-gray-900 rounded-xl border border-gray-800 focus-within:border-green-500 flex-row items-center">
                <TextInput
                  className="text-white p-4 text-base flex-1"
                  placeholder="Create a password"
                  placeholderTextColor="#6b7280"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                />
                <Pressable 
                  className="pr-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text className="text-gray-400 text-sm">
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <View className="mb-4 mx-1">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-xs">Password strength</Text>
                  <Text className={`text-xs font-medium ${
                    passwordStrength.strength === 100 ? 'text-green-500' :
                    passwordStrength.strength >= 75 ? 'text-blue-500' :
                    passwordStrength.strength >= 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {passwordStrength.text}
                  </Text>
                </View>
                <View className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <View 
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </View>
              </View>
            )}

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-gray-300 text-sm font-medium mb-2 ml-1">
                Confirm Password
              </Text>
              <View className={`bg-gray-900 rounded-xl border ${
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'border-red-500' 
                  : formData.confirmPassword && formData.password === formData.confirmPassword
                  ? 'border-green-500'
                  : 'border-gray-800'
              } focus-within:border-green-500 flex-row items-center`}>
                <TextInput
                  className="text-white p-4 text-base flex-1"
                  placeholder="Confirm your password"
                  placeholderTextColor="#6b7280"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                />
                <Pressable 
                  className="pr-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text className="text-gray-400 text-sm">
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  Passwords don't match
                </Text>
              )}
            </View>

            {/* Terms and Conditions */}
            <View className="flex-row items-start mb-6">
              <Pressable 
                className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 justify-center items-center ${
                  acceptTerms ? 'bg-green-500 border-green-500' : 'border-gray-600'
                }`}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                {acceptTerms && (
                  <Text className="text-black text-xs font-bold">✓</Text>
                )}
              </Pressable>
              <Text className="text-gray-400 text-sm flex-1 leading-5">
                I agree to the{' '}
                <Text className="text-green-500 font-medium">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-green-500 font-medium">Privacy Policy</Text>
              </Text>
            </View>

            {/* Register Button */}
            <Pressable
              className={`py-4 px-6 rounded-xl ${
                isFormValid() && !isLoading
                  ? 'bg-green-500' 
                  : 'bg-gray-700'
              }`}
              onPress={ handleSubmit}
              disabled={!isFormValid() || isLoading}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed && isFormValid() ? 0.98 : 1 }],
                  shadowColor: isFormValid() ? '#22c55e' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isFormValid() ? 0.3 : 0.1,
                  shadowRadius: 12,
                  elevation: isFormValid() ? 6 : 2,
                }
              ]}
            >
              <Text className={`text-center text-lg font-bold ${
                isFormValid() && !isLoading ? 'text-black' : 'text-gray-500'
              }`}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-800" />
            <Text className="text-gray-500 px-4 text-sm">or sign up with</Text>
            <View className="flex-1 h-px bg-gray-800" />
          </View>

          {/* Social Sign Up */}
          <View className="space-y-3 mb-8">
            <Pressable
              className="bg-gray-900 border border-gray-800 py-3 px-4 rounded-xl flex-row items-center justify-center"
              onPress={() => handleSocialSignUp('Google')}
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
              ]}
            >
              <Text className="text-white font-medium text-base">
                Continue with Google
              </Text>
            </Pressable>

            <Pressable
              className="bg-gray-900 border border-gray-800 py-3 px-4 rounded-xl flex-row items-center justify-center"
              onPress={() => handleSocialSignUp('Apple')}
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
              ]}
            >
              <Text className="text-white font-medium text-base">
                Continue with Apple
              </Text>
            </Pressable>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-400 text-base">
              Already have an account? 
            </Text>
            <Pressable  className="ml-1">
              <Text className="text-green-500 font-semibold text-base">
                Sign In
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;