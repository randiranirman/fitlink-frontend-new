import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { getMealPlanByClientId } from '../../../service/mealService';

import { jwtDecodeClaims } from '../../../service/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ViewClientDetails = ({ route, navigation }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('meals');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Get client info from route params
  const client = route?.params?.client || {
    name: jwtDecodeClaims(  AsyncStorage.getItem("accessToken"))?.name,
    email: jwtDecodeClaims(  AsyncStorage.getItem("accessToken"))?.email,
    
  };

  useEffect(() => {
    const getMealPlanByIdAsync = async () => {
      try {
        setLoading(true);
        const data = await getMealPlanByClientId(client.id);
        setMealPlans(data || []);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
        Alert.alert('Error', 'Failed to load meal plans');
        setMealPlans([]);
      } finally {
        setLoading(false);
      }
    };

    getMealPlanByIdAsync();
  }, [client.id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMealIcon = (mealTime) => {
    switch(mealTime?.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🥨';
      default: return '🍽️';
    }
  };

  const renderMacroCard = (label, value, unit, color) => (
    <View className="bg-zinc-800 rounded-xl p-4 flex-1 mx-1 border border-zinc-700">
      <Text className={`text-${color}-400 text-2xl font-bold mb-1`}>{value}</Text>
      <Text className="text-zinc-400 text-sm">{label}</Text>
      {unit && <Text className="text-zinc-500 text-xs">{unit}</Text>}
    </View>
  );

  const renderFoodItem = (foodItem) => (
    <View key={foodItem.id} className="bg-zinc-900 rounded-lg p-4 mb-3 border border-zinc-800">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-base font-semibold capitalize flex-1">
          {foodItem.name}
        </Text>
        <View className="bg-green-500 px-3 py-1 rounded-full">
          <Text className="text-black text-xs font-medium">
            {foodItem.calories} cal
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center mb-3">
        <Text className="text-zinc-400 text-sm">
          {foodItem.quantity} {foodItem.unit}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-orange-400 text-lg font-bold">{foodItem.proteins}g</Text>
          <Text className="text-zinc-500 text-xs">Protein</Text>
        </View>
        <View className="items-center">
          <Text className="text-blue-400 text-lg font-bold">{foodItem.carbs}g</Text>
          <Text className="text-zinc-500 text-xs">Carbs</Text>
        </View>
        <View className="items-center">
          <Text className="text-yellow-400 text-lg font-bold">{foodItem.fats}g</Text>
          <Text className="text-zinc-500 text-xs">Fats</Text>
        </View>
      </View>
    </View>
  );

  const renderMeal = (meal) => (
    <View key={meal.id} className="bg-zinc-800 rounded-xl p-6 mb-4 border border-zinc-700">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Text className="text-3xl mr-3">{getMealIcon(meal.time)}</Text>
          <View>
            <Text className="text-white text-lg font-bold capitalize">
              {meal.time}
            </Text>
            <Text className="text-zinc-400 text-sm">
              {meal.foodItems?.length || 0} items
            </Text>
          </View>
        </View>
        <View className="bg-green-500 px-4 py-2 rounded-full">
          <Text className="text-black font-bold text-lg">
            {meal.totalCalories} cal
          </Text>
        </View>
      </View>

      {/* Macro Summary */}
      <View className="flex-row mb-6 -mx-1">
        {renderMacroCard('Protein', `${meal.totalProteinsContains}g`, null, 'orange')}
        {renderMacroCard('Carbs', `${meal.totalCarbsContains}g`, null, 'blue')}
        {renderMacroCard('Fats', `${meal.totalFatContains}g`, null, 'yellow')}
      </View>

      {/* Food Items */}
      <Text className="text-white text-base font-semibold mb-3">Food Items:</Text>
      {meal.foodItems?.map(foodItem => renderFoodItem(foodItem))}
    </View>
  );

  const renderMealPlan = (plan, index) => (
    <View key={`${plan.clientId}-${index}`} className="mb-8">
      {/* Plan Header */}
      <View className="bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-xl p-6 mb-4 border border-green-500/30">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-xl font-bold">
            Meal Plan #{index + 1}
          </Text>
          <View className="bg-green-500 px-3 py-1 rounded-full">
            <Text className="text-black text-xs font-medium uppercase">Active</Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <Text className="text-green-400 text-base font-medium">
            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
          </Text>
        </View>

        {/* Plan Stats */}
        <View className="flex-row mt-4 -mx-1">
          <View className="flex-1 mx-1 bg-zinc-800/50 rounded-lg p-3">
            <Text className="text-green-400 text-lg font-bold">
              {plan.meals?.length || 0}
            </Text>
            <Text className="text-zinc-400 text-xs">Total Meals</Text>
          </View>
          <View className="flex-1 mx-1 bg-zinc-800/50 rounded-lg p-3">
            <Text className="text-green-400 text-lg font-bold">
              {plan.meals?.reduce((total, meal) => total + (meal.totalCalories || 0), 0)}
            </Text>
            <Text className="text-zinc-400 text-xs">Total Calories</Text>
          </View>
          <View className="flex-1 mx-1 bg-zinc-800/50 rounded-lg p-3">
            <Text className="text-green-400 text-lg font-bold">
              {Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24)) + 1}
            </Text>
            <Text className="text-zinc-400 text-xs">Days</Text>
          </View>
        </View>
      </View>

      {/* Meals */}
      {plan.meals?.map(meal => renderMeal(meal))}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-zinc-400 mt-4 text-lg">Loading meal plans...</Text>
        </View>
      );
    }

    if (!mealPlans || mealPlans.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">🍽️</Text>
          <Text className="text-white text-xl font-bold mb-2">No Meal Plans Found</Text>
          <Text className="text-zinc-400 text-center">
            This client doesn't have any meal plans assigned yet.
          </Text>
          <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-xl mt-6">
            <Text className="text-black font-semibold">Create Meal Plan</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {mealPlans.map((plan, index) => renderMealPlan(plan, index))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-4 pb-6 bg-zinc-900 border-b border-zinc-800">
        <TouchableOpacity 
          className="mb-4"
          onPress={() => navigation?.goBack()}
        >
          <Text className="text-green-500 text-lg">← Back</Text>
        </TouchableOpacity>
        
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-green-500 rounded-2xl justify-center items-center mr-4">
            <Text className="text-black text-xl font-black">
              {client.name?.split(' ').map(n => n[0]).join('') || 'CL'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">{client.name}</Text>
            <Text className="text-zinc-400 text-base">{client.email}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-6 py-4 bg-zinc-900 border-b border-zinc-800">
        <TouchableOpacity 
          className={`flex-1 py-3 rounded-xl mr-2 ${
            activeTab === 'meals' ? 'bg-green-500' : 'bg-zinc-800'
          }`}
          onPress={() => setActiveTab('meals')}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'meals' ? 'text-black' : 'text-white'
          }`}>
            Meal Plans
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 py-3 rounded-xl ml-2 ${
            activeTab === 'workouts' ? 'bg-green-500' : 'bg-zinc-800'
          }`}
          onPress={() => setActiveTab('workouts')}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'workouts' ? 'text-black' : 'text-white'
          }`}>
            Workouts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'meals' ? (
        renderContent()
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-6xl mb-4">💪</Text>
          <Text className="text-white text-xl font-bold mb-2">Workout Plans</Text>
          <Text className="text-zinc-400 text-center px-6">
            Workout plans feature coming soon!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ViewClientDetails;