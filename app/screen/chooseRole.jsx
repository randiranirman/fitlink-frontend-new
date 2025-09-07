import { View, Text, Pressable, Animated, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import login from './login'

const ChooseRole = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [selectedRole, setSelectedRole] = useState(null);

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

  const roles = [
    {
      id: 'fitness-enthusiast',
      title: 'Fitness Enthusiast',
      subtitle: 'Track & Connect',
      
      icon: '🏃‍♂️',
      description: 'Perfect for fitness lovers who want to track progress and connect with others',
      features: [
        'Track workouts and progress',
        'Connect with fitness buddies',
        'Join community challenges',
        'Share achievements',
        'Get workout recommendations'
      ],
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500'
    },
    {
      id: 'personal-trainer',
      title: 'Personal Trainer',
      subtitle: 'Coach & Guide',
      icon: '💪',
      description: 'For certified trainers who want to manage clients and grow their business',
      features: [
        'Manage multiple clients',
        'Create custom workout plans',
        'Track client progress',
        'Schedule training sessions',
        'Build your fitness brand'
      ],
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Navigate to next screen
      console.log('Selected role:', selectedRole);
       // Navigate to choose role screen
    router.push('/screen/login');
      
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Background decorative elements */}
      <View className="absolute top-10 right-5 w-20 h-20 bg-green-500 rounded-full opacity-5 blur-xl" />
      <View className="absolute bottom-20 left-5 w-16 h-16 bg-blue-500 rounded-full opacity-10 blur-lg" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View 
          className="px-6 pt-16 pb-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-white text-3xl font-black text-center mb-2">
              Choose Your Role
            </Text>
            <Text className="text-gray-400 text-base text-center leading-6">
              Select the role that best describes you to get a personalized experience
            </Text>
          </View>

          {/* Role Cards */}
          <View className="space-y-4 mb-8">
            {roles.map((role, index) => (
              <Animated.View
                key={role.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }}
              >
                <Pressable
                  className={`bg-gray-900 rounded-2xl p-6 border-2 min-h-[220px] ${
                    selectedRole === role.id 
                      ? role.borderColor + ' border-opacity-100' 
                      : 'border-gray-800'
                  }`}
                  onPress={() => handleRoleSelect(role.id)}
                  style={({ pressed }) => [
                    {
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      shadowColor: selectedRole === role.id ? role.color : '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selectedRole === role.id ? 0.3 : 0.1,
                      shadowRadius: 12,
                      elevation: selectedRole === role.id ? 8 : 2,
                    }
                  ]}
                >
                  {/* Role Header */}
                  <View className="flex-row items-start mb-4">
                    <View className={`w-12 h-12 ${role.bgColor} rounded-xl justify-center items-center mr-4 flex-shrink-0`}>
                      <Text className="text-2xl">{role.icon}</Text>
                    </View>
                    <View className="flex-1 min-h-[48px] justify-center">
                      <Text className="text-white text-xl font-bold leading-6">
                        {role.title}
                      </Text>
                      <Text className="text-gray-400 text-sm font-medium mt-1">
                        {role.subtitle}
                      </Text>
                    </View>
                    <View className="w-6 h-6 flex-shrink-0 justify-center items-center">
                      {selectedRole === role.id && (
                        <View className="w-6 h-6 bg-green-500 rounded-full justify-center items-center">
                          <Text className="text-black text-xs font-bold">✓</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Description */}
                  <Text className="text-gray-300 text-sm mb-4 leading-5 min-h-[40px]">
                    {role.description}
                  </Text>

                  {/* Features */}
                  <View className="flex-1 justify-start">
                    {role.features.map((feature, idx) => (
                      <View key={idx} className="flex-row items-start mb-2">
                        <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                        <Text className="text-gray-400 text-sm flex-1 leading-5">
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>

          {/* Continue Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <Pressable
              className={`py-4 px-8 rounded-full ${
                selectedRole 
                  ? 'bg-green-500' 
                  : 'bg-gray-700'
              }`}
              onPress={handleContinue}
              disabled={!selectedRole}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed && selectedRole ? 0.95 : 1 }],
                  shadowColor: selectedRole ? '#22c55e' : '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: selectedRole ? 0.3 : 0.1,
                  shadowRadius: 15,
                  elevation: selectedRole ? 6 : 2,
                }
              ]}
            >
              <Text className={`text-center text-lg font-bold ${
                selectedRole ? 'text-black' : 'text-gray-500'
              }`}>
                Continue
              </Text>
            </Pressable>
          </Animated.View>

         
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default ChooseRole;