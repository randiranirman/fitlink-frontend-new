import { View, Text, Pressable, Animated, Dimensions, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
const { width } = Dimensions.get('window');

// Sidebar Component
const ClientSideBar = ({ isVisible, onClose, onNavigate }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const menuItems = [
    { id: 'home', title: 'Home', icon: '🏠', screen: 'Home' },
    { id: 'searchTrainer', title: 'Search Trainers', icon: '📊', screen: '../clientScreens/clientSearchTrainer' },
    { id: 'profile', title: 'Profile', icon: '👤', screen: 'Profile' },
    {id:'viewDetails',title:'ViewDetails',icon: '👤', screen:'../clientScreens/viewClientDetails'},
    { id: 'settings', title: 'Settings', icon: '⚙️', screen: 'Settings' },
    { id: 'logout', title: 'Log Out', icon: '🚪', screen: 'Logout', danger: true },
    
  ];

  const handleNavigation = (item) => {
    router.push(item.screen);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Overlay */}
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }}
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900 shadow-2xl"
        style={{ transform: [{ translateX: slideAnim }] }}
      >
        {/* Header */}
        <View className="pt-16 pb-6 px-6 border-b border-gray-800">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-green-500 rounded-xl justify-center items-center mr-4">
              <Text className="text-black text-lg font-black">FL</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-bold">John Doe</Text>
              <Text className="text-gray-400 text-sm">Fitness Enthusiast</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView className="flex-1 py-4">
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              className={`mx-4 mb-2 p-4 rounded-xl flex-row items-center ${
                item.danger ? 'bg-red-500/10' : 'bg-transparent'
              }`}
              onPress={() => handleNavigation(item)}
              style={({ pressed }) => [
                { 
                  backgroundColor: pressed 
                    ? (item.danger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(75, 85, 99, 0.3)')
                    : (item.danger ? 'rgba(239, 68, 68, 0.1)' : 'transparent')
                }
              ]}
            >
              <Text className="text-2xl mr-4">{item.icon}</Text>
              <Text className={`text-base font-medidium ${
                item.danger ? 'text-red-400' : 'text-white'
              }`}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Footer */}
        <View className="p-6 border-t border-gray-800">
          <Text className="text-gray-500 text-xs text-center">
            FitLink v1.0.0
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default ClientSideBar;
