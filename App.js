import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TrainingMaxInputScreen from './TrainingMaxInputScreen';
import WorkoutCycleScreen from './WorkoutCycleScreen';
import WorkoutScreen from './WorkoutScreen';
import InitialLoadingScreen from './InitialLoadingScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="InitialLoadingScreen" component={InitialLoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WorkoutCycleScreen" component={WorkoutCycleScreen} options={{ title: 'Workout cycles', headerTitleAlign: 'center',headerLeft: null, gestureEnabled: false }} />
        <Stack.Screen name="TrainingMaxInputScreen" component={TrainingMaxInputScreen} options={{ title: 'Enter your 1RM', headerTitleAlign: 'center',headerLeft: null, gestureEnabled: false }} />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
