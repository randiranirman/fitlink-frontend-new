import { View, Text, Pressable, Animated, Dimensions, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";

import ClientSideBar from "../clientComponents/clientSideBar";


const ClientDashboard = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
    console.log('Navigate to:', screen);
  };

  const statsData = [
    { title: 'Workouts', value: '24', subtitle: 'This month', color: 'bg-green-500', icon: '💪' },
    { title: 'Calories', value: '2.4k', subtitle: 'Burned today', color: 'bg-blue-500', icon: '🔥' },
    { title: 'Steps', value: '8.2k', subtitle: 'Today', color: 'bg-purple-500', icon: '👟' },
    { title: 'Water', value: '1.8L', subtitle: 'Today', color: 'bg-cyan-500', icon: '💧' },
  ];

  const recentActivities = [
    { activity: 'Morning Run', duration: '30 min', calories: '245', time: '2 hours ago' },
    { activity: 'Strength Training', duration: '45 min', calories: '320', time: '1 day ago' },
    { activity: 'Yoga Session', duration: '25 min', calories: '120', time: '2 days ago' },
  ];

  return (
    <View className="flex-1 bg-black">
      {/* Background decorative elements */}
      <View className="absolute top-20 right-10 w-32 h-32 bg-green-500 rounded-full opacity-5 blur-xl" />
      <View className="absolute bottom-40 left-10 w-24 h-24 bg-blue-500 rounded-full opacity-8 blur-lg" />

      <Animated.View 
        className="flex-1"
        style={{ opacity: fadeAnim }}
      >
        {/* Header */}
        <View className="pt-16 pb-6 px-6 flex-row items-center justify-between">
          <Pressable
            className="w-10 h-10 bg-gray-800 rounded-xl justify-center items-center"
            onPress={() => setSidebarVisible(true)}
          >
            <Text className="text-white text-lg">☰</Text>
          </Pressable>
          
          <View className="flex-1 items-center">
            <Text className="text-white text-xl font-bold">Dashboard</Text>
            <Text className="text-gray-400 text-sm">Welcome back, John!</Text>
          </View>
          
          <Pressable className="w-10 h-10 bg-gray-800 rounded-xl justify-center items-center">
            <Text className="text-white text-lg">🔔</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View className="px-6 mb-8">
            <Text className="text-white text-lg font-bold mb-4">Today's Overview</Text>
            <View className="flex-row flex-wrap justify-between">
              {statsData.map((stat, index) => (
                <View
                  key={index}
                  className="w-[48%] bg-gray-900 rounded-2xl p-4 mb-4 border border-gray-800"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-2xl">{stat.icon}</Text>
                    <View className={`w-3 h-3 ${stat.color} rounded-full`} />
                  </View>
                  <Text className="text-white text-2xl font-bold mb-1">{stat.value}</Text>
                  <Text className="text-gray-400 text-sm">{stat.title}</Text>
                  <Text className="text-gray-500 text-xs">{stat.subtitle}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="px-6 mb-8">
            <Text className="text-white text-lg font-bold mb-4">Quick Actions</Text>
            <View className="flex-row justify-between">
              <Pressable 
                className="flex-1 bg-green-500 rounded-xl p-4 mr-2"
                style={({ pressed }) => [
                  { transform: [{ scale: pressed ? 0.98 : 1 }] }
                ]}
              >
                <Text className="text-black font-bold text-center">Start Workout</Text>
              </Pressable>
              <Pressable 
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-4 ml-2"
                style={({ pressed }) => [
                  { transform: [{ scale: pressed ? 0.98 : 1 }] }
                ]}
              >
                <Text className="text-white font-bold text-center">Log Activity</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Activities */}
          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">Recent Activities</Text>
              <Pressable>
                <Text className="text-green-500 text-sm font-medium">View All</Text>
              </Pressable>
            </View>
            
            <View className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {recentActivities.map((activity, index) => (
                <Pressable
                  key={index}
                  className={`p-4 ${index < recentActivities.length - 1 ? 'border-b border-gray-800' : ''}`}
                  style={({ pressed }) => [
                    { backgroundColor: pressed ? 'rgba(75, 85, 99, 0.2)' : 'transparent' }
                  ]}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-medium mb-1">{activity.activity}</Text>
                      <Text className="text-gray-400 text-sm">
                        {activity.duration} • {activity.calories} cal
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm">{activity.time}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Progress Section */}
          <View className="px-6 mb-8">
            <Text className="text-white text-lg font-bold mb-4">Weekly Progress</Text>
            <View className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white font-medium">Workout Goal</Text>
                <Text className="text-green-500 font-bold">4/5 days</Text>
              </View>
              <View className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                <View className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
              </View>
              <Text className="text-gray-400 text-sm">Great job! 1 more day to reach your goal</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Sidebar */}
      <ClientSideBar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleNavigation}
      />
    </View>
  );
};

export default ClientDashboard;