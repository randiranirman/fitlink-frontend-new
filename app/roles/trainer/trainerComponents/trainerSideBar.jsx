import { View, Text, Pressable, Animated, Dimensions, ScrollView } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";

const { width } = Dimensions.get('window');

const TrainerSideBar = ({ isVisible, onClose }) => {
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
    { id: 'dashboard', title: 'Dashboard', icon: '📊', screen: '/trainer/dashboard' },
    { id: 'clients', title: 'My Clients', icon: '👥', screen: '/trainer/clients' },
    { id: 'analytics', title: 'Analytics', icon: '📈', screen: '/trainer/analytics' },
    { id: 'schedule', title: 'Schedule', icon: '📅', screen: '/trainer/schedule' },
    { id: 'workouts', title: 'Workouts', icon: '💪', screen: '/trainer/workouts' },
    { id: 'messages', title: 'Messages', icon: '💬', screen: '/trainer/messages' },
    { id: 'profile', title: 'Profile', icon: '👤', screen: '/trainer/profile' },
    { id: 'settings', title: 'Settings', icon: '⚙️', screen: '/trainer/settings' },
  ];

  const bottomItems = [
    { id: 'help', title: 'Help & Support', icon: '❓', screen: '/help' },
    { id: 'logout', title: 'Log Out', icon: '🚪', screen: '/logout', danger: true },
  ];

  const handleNavigation = (item) => {
    router.push(item.screen);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Gradient Overlay */}
      <Animated.View
        className="absolute inset-0"
        style={{ 
          opacity: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        className="absolute left-0 top-0 bottom-0 w-80 bg-zinc-900 shadow-2xl border-r border-zinc-800"
        style={{ transform: [{ translateX: slideAnim }] }}
      >
        {/* Header with Gradient */}
        <View className="pt-16 pb-8 px-6 bg-gradient-to-br from-green-500/20 to-green-600/10">
          <View className="flex-row items-center mb-6">
            <View className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl justify-center items-center mr-4 shadow-lg">
              <Text className="text-black text-xl font-black">JD</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold mb-1">John Doe</Text>
              <Text className="text-green-400 text-sm font-medium">Certified Trainer</Text>
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                <Text className="text-zinc-400 text-xs">Active</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row justify-between bg-zinc-800/50 rounded-xl p-3 backdrop-blur-sm">
            <View className="items-center">
              <Text className="text-green-400 text-lg font-bold">24</Text>
              <Text className="text-zinc-400 text-xs">Clients</Text>
            </View>
            <View className="w-px bg-zinc-700"></View>
            <View className="items-center">
              <Text className="text-green-400 text-lg font-bold">4.9</Text>
              <Text className="text-zinc-400 text-xs">Rating</Text>
            </View>
            <View className="w-px bg-zinc-700"></View>
            <View className="items-center">
              <Text className="text-green-400 text-lg font-bold">2Y</Text>
              <Text className="text-zinc-400 text-xs">Experience</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
          <Text className="text-zinc-500 text-xs font-medium uppercase px-6 mb-3 tracking-wider">
            Main Menu
          </Text>
          
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              className="mx-4 mb-1 p-4 rounded-xl flex-row items-center bg-transparent"
              onPress={() => handleNavigation(item)}
              style={({ pressed }) => [
                { 
                  backgroundColor: pressed ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
                }
              ]}
            >
              <View className="w-10 h-10 bg-zinc-800 rounded-xl justify-center items-center mr-4">
                <Text className="text-lg">{item.icon}</Text>
              </View>
              <Text className="text-white text-base font-medium flex-1">
                {item.title}
              </Text>
              <View className="w-1 h-6 bg-green-500 rounded-full opacity-0"></View>
            </Pressable>
          ))}

          <View className="h-px bg-zinc-800 mx-6 my-4"></View>

          {bottomItems.map((item, index) => (
            <Pressable
              key={item.id}
              className={`mx-4 mb-1 p-4 rounded-xl flex-row items-center ${
                item.danger ? 'bg-red-500/5' : 'bg-transparent'
              }`}
              onPress={() => handleNavigation(item)}
              style={({ pressed }) => [
                { 
                  backgroundColor: pressed 
                    ? (item.danger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.1)')
                    : (item.danger ? 'rgba(239, 68, 68, 0.05)' : 'transparent')
                }
              ]}
            >
              <View className={`w-10 h-10 rounded-xl justify-center items-center mr-4 ${
                item.danger ? 'bg-red-500/10' : 'bg-zinc-800'
              }`}>
                <Text className="text-lg">{item.icon}</Text>
              </View>
              <Text className={`text-base font-medium flex-1 ${
                item.danger ? 'text-red-400' : 'text-white'
              }`}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Footer */}
        <View className="p-6 border-t border-zinc-800 bg-zinc-800/30">
          <Text className="text-zinc-500 text-xs text-center font-medium">
            FitLink Trainer • v1.0.0
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default TrainerSideBar;
