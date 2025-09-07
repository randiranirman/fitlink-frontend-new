import { View, Text, Pressable, Animated, Dimensions } from "react-native";
import { useEffect, useRef, useState } from "react";
import './global.css'
import { useRouter } from "expo-router";


const { width, height } = Dimensions.get('window');

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [buttonPressed, setButtonPressed] = useState(false);

  const router = useRouter();


  useEffect(() => {
    // Staggered animations for smooth entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleButtonPress = () => {
    setButtonPressed(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to choose role screen
    router.push('/screen/chooseRole');

    // Reset after animation
    setTimeout(() => setButtonPressed(false), 200);
  };

  return (
    <View className="flex-1 bg-black">
      {/* Background gradient effect */}
      <View className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      {/* Decorative elements */}
      <View className="absolute top-20 right-10 w-32 h-32 bg-green-500 rounded-full opacity-10 blur-xl" />
      <View className="absolute bottom-40 left-10 w-24 h-24 bg-green-400 rounded-full opacity-15 blur-lg" />
      
      <Animated.View 
        className="flex-1 justify-center items-center px-8"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {/* Logo/Icon placeholder */}
        <Animated.View 
          className="w-20 h-20 bg-green-500 rounded-2xl mb-8 justify-center items-center"
          style={{
            transform: [{ scale: scaleAnim }]
          }}
        >
          <Text className="text-black text-3xl font-black">FL</Text>
        </Animated.View>

        {/* Main Title */}
        <Animated.Text 
          className="text-white text-4xl font-black text-center mb-4 tracking-tight"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          Welcome to{'\n'}
          <Text className="text-green-500">FitLink</Text>
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text 
          className="text-gray-400 text-lg text-center mb-12 leading-6 max-w-sm"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          Your fitness journey starts here. Connect, track, and achieve your goals.
        </Animated.Text>

        {/* Get Started Button */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }]
          }}
        >
          <Pressable
            className={`bg-green-500 px-12 py-4 rounded-full shadow-lg ${
              buttonPressed ? 'bg-green-600' : 'bg-green-500'
            }`}
            onPress={handleButtonPress}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.95 : 1 }],
                shadowColor: '#22c55e',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              }
            ]}
          >
            <Text className="text-black text-xl font-bold tracking-wide">
              Get Started
            </Text>
          </Pressable>
        </Animated.View>

        {/* Secondary Actions */}
        <Animated.View 
          className="flex-row mt-8 space-x-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Pressable className="py-3">
            <Text className="text-gray-500 text-base font-medium">
              Sign In
            </Text>
          </Pressable>
          
          <View className="w-px bg-gray-700" />
          
          <Pressable className="py-3">
            <Text className="text-gray-500 text-base font-medium">
              Learn More
            </Text>
          </Pressable>
        </Animated.View>

        {/* Bottom indicator */}
        <Animated.View 
          className="absolute bottom-12 flex-row space-x-2"
          style={{
            opacity: fadeAnim,
          }}
        >
          <View className="w-2 h-2 bg-green-500 rounded-full" />
          <View className="w-2 h-2 bg-gray-600 rounded-full" />
          <View className="w-2 h-2 bg-gray-600 rounded-full" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
