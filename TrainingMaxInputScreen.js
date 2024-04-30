import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { calculateWorkoutWeights, getReps, getPercentages, combineWorkouts } from './workoutCalculationService';
import styles from './styles';

const TrainingMaxInputScreen = () => {
  const [squatMax, setSquatMax] = useState('');
  const [benchMax, setBenchMax] = useState('');
  const [deadliftMax, setDeadliftMax] = useState('');
  const [pressMax, setPressMax] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    try {
      const squatWeights = calculateWorkoutWeights(parseFloat(squatMax), 'Squat', 3);
      const benchWeights = calculateWorkoutWeights(parseFloat(benchMax), 'Bench Press', 3);
      const deadliftWeights = calculateWorkoutWeights(parseFloat(deadliftMax), 'Deadlift', 3);
      const pressWeights = calculateWorkoutWeights(parseFloat(pressMax), 'Overhead Press', 3);
      const allWorkouts = combineWorkouts(squatWeights, benchWeights, deadliftWeights, pressWeights);

      await AsyncStorage.setItem('workouts', JSON.stringify(allWorkouts));

      navigation.navigate('WorkoutCycleScreen');
    } catch (error) {
      console.error('Error saving training maxes:', error);
    }
  };

  return (
      <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Enter Squat Max"
            value={squatMax}
            onChangeText={setSquatMax}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder="Enter Bench Max"
            value={benchMax}
            onChangeText={setBenchMax}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder="Enter Deadlift Max"
            value={deadliftMax}
            onChangeText={setDeadliftMax}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder="Enter Press Max"
            value={pressMax}
            onChangeText={setPressMax}
            keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
  );
};

export default TrainingMaxInputScreen;
