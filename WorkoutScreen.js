import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './styles';

const WorkoutScreen = ({ route }) => {
  const { date } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>Workout for {date}</Text>
      {/* Your workout content goes here */}
    </View>
  );
};



export default WorkoutScreen;
