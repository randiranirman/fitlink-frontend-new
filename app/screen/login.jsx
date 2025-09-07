import { View, Text, TextInput, Pressable, Animated, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { loginUser } from "../service/authService";

const Login = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async  () => {
    if (email && password) {
      setIsLoading(true);
      const requestBody = {
        username: email,
        password: password
      }


      console.log(requestBody)
      try { 
         const response = await  loginUser( requestBody);
         console.log("user registered successfylly ")
         
      }catch( error) {
        console.log("some thigns happens " + error);
      }finally{
        setIsLoading( false)
      }

      
    }
  };

  const handleSignUp = () => {
    console.log('Navigate to sign up');
    router.push('/screen/register')
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background decorative elements */}
      <View className="absolute top-20 right-10 w-32 h-32 bg-green-500 rounded-full opacity-5 blur-xl" />
      <View className="absolute bottom-40 left-10 w-24 h-24 bg-green-400 rounded-full opacity-10 blur-lg" />
      
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
          <View className="items-center mb-12">
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
              Welcome Back
            </Text>
            <Text className="text-gray-400 text-base text-center">
              Sign in to continue your fitness journey
            </Text>
          </View>

          {/* Login Form */}
          <View className="mb-8">
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
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-300 text-sm font-medium mb-2 ml-1">
                Password
              </Text>
              <View className="bg-gray-900 rounded-xl border border-gray-800 focus-within:border-green-500 flex-row items-center">
                <TextInput
                  className="text-white p-4 text-base flex-1"
                  placeholder="Enter your password"
                  placeholderTextColor="#6b7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
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

            {/* Forgot Password */}
            <View className="items-end mb-6">
              <Pressable onPress={handleForgotPassword}>
                <Text className="text-green-500 text-sm font-medium">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <Pressable
              className={`py-4 px-6 rounded-xl ${
                email && password && !isLoading
                  ? 'bg-green-500' 
                  : 'bg-gray-700'
              }`}
              onPress={handleLogin}
              disabled={!email || !password || isLoading}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed && email && password ? 0.98 : 1 }],
                  shadowColor: email && password ? '#22c55e' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: email && password ? 0.3 : 0.1,
                  shadowRadius: 12,
                  elevation: email && password ? 6 : 2,
                }
              ]}
            >
              <Text onPress={handleLogin} className={`text-center text-lg font-bold ${
                email && password && !isLoading ? 'text-black' : 'text-gray-500'
              }`}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-800" />
            <Text className="text-gray-500 px-4 text-sm">or continue with</Text>
            <View className="flex-1 h-px bg-gray-800" />
          </View>

          {/* Social Login */}
          <View className="space-y-3 mb-8">
            <Pressable
              className="bg-gray-900 border border-gray-800 py-3 px-4 rounded-xl flex-row items-center justify-center"
              onPress={() => handleSocialLogin('Google')}
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
              onPress={() => handleSocialLogin('Apple')}
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
              ]}
            >
              <Text className="text-white font-medium text-base">
                Continue with Apple
              </Text>
            </Pressable>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-auto">
            <Text className="text-gray-400 text-base">
              Don't have an account? 
            </Text>
            <Pressable onPress={handleSignUp} className="ml-1">
              <Text className="text-green-500 font-semibold text-base">
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Terms */}
          <View className="mt-6">
            <Text className="text-gray-500 text-xs text-center leading-4">
              By signing in, you agree to our{' '}
              <Text className="text-green-500">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-green-500">Privacy Policy</Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;