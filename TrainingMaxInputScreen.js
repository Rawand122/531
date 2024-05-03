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
  const [unit, setUnit] = useState('lbs'); // State for unit selection
  const navigation = useNavigation();

    const toggleUnit = () => {
        setUnit(unit === 'lbs' ? 'kg' : 'lbs');
    };
  const handleSave = async () => {
    try {
        const squatMaxConverted = unit === 'kg' ? parseFloat(squatMax) * 2.20462 : parseFloat(squatMax);
        const benchMaxConverted = unit === 'kg' ? parseFloat(benchMax) * 2.20462 : parseFloat(benchMax);
        const deadliftMaxConverted = unit === 'kg' ? parseFloat(deadliftMax) * 2.20462 : parseFloat(deadliftMax);
        const pressMaxConverted = unit === 'kg' ? parseFloat(pressMax) * 2.20462 : parseFloat(pressMax);


        const squatWeights = calculateWorkoutWeights(parseFloat(squatMaxConverted), 'Squat', 3);
      const benchWeights = calculateWorkoutWeights(parseFloat(benchMaxConverted), 'Bench Press', 3);
      const deadliftWeights = calculateWorkoutWeights(parseFloat(deadliftMaxConverted), 'Deadlift', 3);
      const pressWeights = calculateWorkoutWeights(parseFloat(pressMaxConverted), 'Overhead Press', 3);
      const allWorkouts = combineWorkouts(squatWeights, benchWeights, deadliftWeights, pressWeights);

      await AsyncStorage.setItem('workouts', JSON.stringify(allWorkouts));

      navigation.navigate('WorkoutCycleScreen');
    } catch (error) {
      console.error('Error saving training maxes:', error);
    }
  };

  return (
      <View style={styles.container}>
          {/* Toggle button for lbs/kg */}
          <TouchableOpacity style={styles.toggleButton} onPress={toggleUnit}>
              <Text style={styles.toggleButtonText}>{unit === 'lbs' ? 'Switch to kg' : 'Switch to lbs'}</Text>
          </TouchableOpacity>
        <TextInput
            style={styles.input}
            placeholder={`Enter Squat Max in (${unit})`}
            value={squatMax}
            onChangeText={setSquatMax}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder={`Enter Bench Press Max in (${unit})`}
            value={benchMax}
            onChangeText={setBenchMax}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder={`Enter Deadlift Max in (${unit})`}
            value={deadliftMax}
            onChangeText={setDeadliftMax}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder={`Enter Press Max in (${unit})`}
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
