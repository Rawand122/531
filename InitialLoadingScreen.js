import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InitialLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkDataAndNavigate = async () => {
    console.log("inside initial loading screen ")
      try {
        // Check if there is any data available
        const hasData = await checkData();

        // Navigate based on data availability
        if (hasData) {
          navigation.navigate('WorkoutCycleScreen');
        } else {
          navigation.navigate('TrainingMaxInputScreen');
        }
      } catch (error) {
        console.error('Error checking data:', error);
        // Handle error, e.g., show error message or navigate to an error screen
      }
    };

    checkDataAndNavigate();
  }, []);

  const checkData = async () => {
    // Check if there is any data available in AsyncStorage
    // You can use any other data storage mechanism here
    const workoutData = await AsyncStorage.getItem('workouts');

    // Check if workoutData is available
    return !!workoutData;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
};

export default InitialLoadingScreen;
