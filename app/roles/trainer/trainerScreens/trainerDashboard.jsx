import { View, Text, Pressable, Animated, Dimensions, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import TrainerSideBar from "../trainerComponents/trainerSideBar";
import { getClientDetailsByTrainerId } from "../../../service/trainerService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TrainerDashboard.js - Main Dashboard Component
const TrainerDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const selectClient = (client) => {
    router.push({
      pathname: "../trainerScreens/assignMealsAndWorkout",
      params: { client: JSON.stringify(client) },
    });
    console.log("Selected client:", client);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const clientData = await getClientDetailsByTrainerId();
        console.log("Client data:", clientData);
        
        // Set the actual data from backend
        if (clientData && Array.isArray(clientData)) {
          setClients(clientData);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [])

  // Helper function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper function to get clients joined this week
  const getWeeklyClients = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return clients.filter(client => {
      // Since we don't have joinDate in the response, we'll return empty array
      // You might want to add joinDate to your backend response
      return false;
    });
  };

  // Helper function to get clients joined this month
  const getMonthlyClients = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return clients.filter(client => {
      // Since we don't have joinDate in the response, we'll return empty array
      // You might want to add joinDate to your backend response
      return false;
    });
  };

  const renderClientCard = (client, showProgress = false, index = 0) => (
    <Pressable 
      key={client.clientEmail || `client-${index}`} 
      onPress={() => selectClient(client)}
      className="bg-zinc-800 p-4 rounded-xl mb-3 border border-zinc-700 active:bg-zinc-700"
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-green-500 rounded-full justify-center items-center mr-3">
            <Text className="text-black font-bold text-lg">
              {getInitials(client.clientName || 'N/A')}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">{client.clientName || 'No Name'}</Text>
            <Text className="text-zinc-400 text-sm">{client.clientEmail || 'No Email'}</Text>
            <Text className="text-zinc-400 text-xs">
              Age: {client.clientAge || 'N/A'} • {client.clientGender || 'N/A'} • {client.clientWeight || 'N/A'}kg
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-zinc-500 text-xs">{client.clientContactNumber || 'No Phone'}</Text>
          <Text className="text-zinc-500 text-xs">{client.clientAddress || 'No Address'}</Text>
          {/* Add a visual indicator that the card is pressable */}
          <View className="mt-2 bg-green-500 px-2 py-1 rounded-md">
            <Text className="text-black text-xs font-semibold">Assign Meals</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">Loading clients...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <TrainerSideBar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />
      
      {/* Header */}
      <View className="pt-14 pb-6 px-6 bg-zinc-900 border-b border-zinc-800">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => setSidebarVisible(true)}>
            <View className="w-10 h-10 bg-zinc-800 rounded-xl justify-center items-center">
              <View className="w-5 h-5">
                <View className="w-5 h-0.5 bg-white mb-1"></View>
                <View className="w-5 h-0.5 bg-white mb-1"></View>
                <View className="w-5 h-0.5 bg-white"></View>
              </View>
            </View>
          </Pressable>
          
          <Text className="text-white text-xl font-bold">Trainer Dashboard</Text>
          
          <View className="w-10 h-10 bg-green-500 rounded-full justify-center items-center">
            <Text className="text-black font-bold">JD</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="px-6 py-6">
          <View className="flex-row justify-between mb-6">
            <View className="bg-zinc-900 p-4 rounded-xl flex-1 mr-2 border border-zinc-800">
              <Text className="text-green-400 text-2xl font-bold">{clients.length}</Text>
              <Text className="text-zinc-400 text-sm">Total Clients</Text>
            </View>
            <View className="bg-zinc-900 p-4 rounded-xl flex-1 mx-1 border border-zinc-800">
              <Text className="text-green-400 text-2xl font-bold">{getWeeklyClients().length}</Text>
              <Text className="text-zinc-400 text-sm">This Week</Text>
            </View>
            <View className="bg-zinc-900 p-4 rounded-xl flex-1 ml-2 border border-zinc-800">
              <Text className="text-green-400 text-2xl font-bold">{getMonthlyClients().length}</Text>
              <Text className="text-zinc-400 text-sm">This Month</Text>
            </View>
          </View>
        </View>

        {/* All Clients */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">My Clients ({clients.length})</Text>
            <Text className="text-zinc-400 text-sm">Tap to assign meals</Text>
          </View>
          
          {clients.length > 0 ? (
            clients.map((client, index) => renderClientCard(client, false, index))
          ) : (
            <View className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 items-center">
              <Text className="text-zinc-400 text-base">No clients found</Text>
              <Text className="text-zinc-500 text-sm mt-2">Clients will appear here once they join</Text>
            </View>
          )}
        </View>

        {/* Weekly Clients - Only show if there are any */}
        {getWeeklyClients().length > 0 && (
          <View className="px-6 mb-8">
            <Text className="text-white text-xl font-bold mb-4">Joined This Week</Text>
            {getWeeklyClients().map((client, index) => renderClientCard(client, false, index))}
          </View>
        )}

        {/* Monthly Clients - Only show if there are any */}
        {getMonthlyClients().length > 0 && (
          <View className="px-6 mb-8">
            <Text className="text-white text-xl font-bold mb-4">Joined This Month</Text>
            {getMonthlyClients().map((client, index) => renderClientCard(client, false, index))}
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-20"></View>
      </ScrollView>
    </View>
  );
}

export default TrainerDashboard;