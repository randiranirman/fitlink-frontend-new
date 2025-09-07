import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';

import { searchTrainerByName } from '../../../service/clientRegisterTrainer';
import { router } from 'expo-router';

const ClientSearchTrainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a trainer name to search');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const results = await searchTrainerByName(searchQuery.trim());
      setTrainers(results || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to search trainers. Please try again.');
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setTrainers([]);
    setHasSearched(false);
  };

  const selectTrainer = (trainer) => {

    router.push({
      pathname:"../clientScreens/clientTrainerRegistration",
      params: {trainer:JSON.stringify(trainer)},
      

    })

    console.log(trainer)

      
        




   
  
     
  };

  const renderTrainerItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-zinc-800 mx-4 mb-3 p-4 rounded-xl border border-zinc-700"
      onPress={() => selectTrainer(item)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold mb-1">
            {item.name}
          </Text>
          <Text className="text-zinc-400 text-sm mb-2">
            {item.email}
          </Text>
          <View className="bg-green-500 self-start px-3 py-1 rounded-full">
            <Text className="text-black text-xs font-medium uppercase">
              {item.appUserRole}
            </Text>
          </View>
        </View>
        <View className="bg-green-500 w-10 h-10 rounded-full items-center justify-center ml-3">
          <Text className="text-black font-bold text-lg">+</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) return null;
    
    if (!hasSearched) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-zinc-400 text-center text-lg mb-2">
            Find Your Perfect Trainer
          </Text>
          <Text className="text-zinc-500 text-center">
            Search for trainers by name to get started with your fitness journey
          </Text>
        </View>
      );
    }

    if (trainers.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-zinc-400 text-center text-lg mb-2">
            No trainers found
          </Text>
          <Text className="text-zinc-500 text-center mb-4">
            Try searching with a different name
          </Text>
          <TouchableOpacity 
            className="bg-green-500 px-6 py-2 rounded-full"
            onPress={clearSearch}
          >
            <Text className="text-black font-medium">Search Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pt-4 pb-6">
        <Text className="text-white text-3xl font-bold mb-2">
          Find Trainers
        </Text>
        <Text className="text-zinc-400">
          Discover experienced trainers to guide your fitness journey
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-6">
        <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
          <TextInput
            className="text-white text-lg"
            placeholder="Search trainer by name..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        
        <View className="flex-row mt-3 space-x-3">
          <TouchableOpacity 
            className="flex-1 bg-green-500 py-3 rounded-xl items-center"
            onPress={handleSearch}
            disabled={loading}
          >
            <Text className="text-black font-semibold text-lg">
              Search
            </Text>
          </TouchableOpacity>
          
          {(searchQuery || hasSearched) && (
            <TouchableOpacity 
              className="bg-zinc-700 px-6 py-3 rounded-xl items-center"
              onPress={clearSearch}
            >
              <Text className="text-white font-medium">
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <View className="flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="text-zinc-400 mt-3">Searching trainers...</Text>
          </View>
        ) : (
          <FlatList
            data={trainers}
            keyExtractor={(item) => item.id}
            renderItem={renderTrainerItem}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingBottom: 20,
              flexGrow: 1 
            }}
          />
        )}
      </View>

      {/* Results Count */}
      {trainers.length > 0 && !loading && (
        <View className="px-4 py-3 bg-zinc-900">
          <Text className="text-zinc-400 text-center">
            Found {trainers.length} trainer{trainers.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ClientSearchTrainer;