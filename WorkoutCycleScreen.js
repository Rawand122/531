import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {calculateWorkoutWeights, combineWorkouts} from './workoutCalculationService'; // Import the calculation service
import styles from './styles';
// WorkoutItem component memoized for optimization
const WorkoutItem = memo(({ item, toggleCompletion, handleSaveComments, comments }) => (
    <View style={styles.workoutItem}>
        <Text style={styles.workoutTitle}>{item.lift} - Cycle {item.week}</Text>
        {/* Render workout sets */}
        {item.sets.map((set, index) => (
            <TouchableOpacity key={set.id} onPress={() => toggleCompletion(set.id)}>
                <View style={[styles.setItem, { backgroundColor: set.completed ? '#c0e0c0' : '#fff' }]}>
                    <Text>
                        Set {index + 1} - {set.percentage}% x {set.reps} reps @ {set.weight} lbs
                    </Text>
                </View>
            </TouchableOpacity>
        ))}
        {/* Input field for comments */}
        <TextInput
            style={styles.commentInput}
            placeholder="Add comment"
            value={comments[item.lift + '_' + item.week] || ''}
            onChangeText={(text) => handleSaveComments(item.lift, item.week, text)}
        />
    </View>
));

const WorkoutCycleScreen = () => {
    const [workouts, setWorkouts] = useState([]);
    const [isSaving, setIsSaving] = useState(false); // State to track saving status
    const [comments, setComments] = useState({}); // State to store comments
    const [showNewValues, setShowNewValues] = useState(false); // State to control visibility of new value inputs
    const [squatMax, setSquatMax] = useState('');
    const [benchMax, setBenchMax] = useState('');
    const [deadliftMax, setDeadliftMax] = useState('');
    const [pressMax, setPressMax] = useState('');
    const navigation = useNavigation();
    const [reloadData, setReloadData] = useState(false);


    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const savedWorkoutsJson = await AsyncStorage.getItem('workouts');
                const savedCommentsJson = await AsyncStorage.getItem('comments');
                if (savedWorkoutsJson) {
                    const savedWorkouts = JSON.parse(savedWorkoutsJson);

                    setWorkouts(savedWorkouts);
                } else {
                    console.log('No saved workouts found.');
                }
                if (savedCommentsJson) {
                    const savedComments = JSON.parse(savedCommentsJson);
                    setComments(savedComments);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchWorkouts();

        const removeListener = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });

        return () => removeListener();
    }, [reloadData]);

    // Function to handle saving comments
    const handleSaveComments = async (lift, week, comment) => {
        try {
            const updatedComments = { ...comments, [lift + '_' + week]: comment };
            setComments(updatedComments);
            await AsyncStorage.setItem('comments', JSON.stringify(updatedComments));
        } catch (error) {
            console.error('Error saving comments:', error);
        }
    };

    const toggleCompletion = async (setId) => {
        setIsSaving(true); // Update state to reflect the toggle
        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout) => {
                if (workout.sets && Array.isArray(workout.sets)) {
                    return {
                        ...workout,
                        sets: workout.sets.map((set) =>
                            set.id === setId ? { ...set, completed: !set.completed } : set
                        ),
                    };
                } else {
                    return workout;
                }
            })
        );

        try {
            // Save the completion state to AsyncStorage
            const workoutsJson = JSON.stringify(workouts); // Use the updated state directly
            await AsyncStorage.setItem('workouts', workoutsJson);
        } catch (error) {
            console.error('Error saving workout completion state:', error);
        } finally {
            setIsSaving(false); // Hide loading indicator after saving
        }
    };

    // Function to recalculate workouts based on new maxes
    const handleSaveNewMaxes = async () => {
        try {
            if (!squatMax || !benchMax || !deadliftMax || !pressMax) {
                Alert.alert('All fields are mandatory!');
                return;
            }

            const regex = /^\d*\.?\d*$/; // Regular expression to match numeric values
            if (!regex.test(squatMax) || !regex.test(benchMax) || !regex.test(deadliftMax) || !regex.test(pressMax)) {
                Alert.alert('Please enter valid numeric values!');
                return;
            }

            const squatWeights = calculateWorkoutWeights(parseFloat(squatMax), 'Squat', 3);
            const benchWeights = calculateWorkoutWeights(parseFloat(benchMax), 'Bench Press', 3);
            const deadliftWeights = calculateWorkoutWeights(parseFloat(deadliftMax), 'Deadlift', 3);
            const pressWeights = calculateWorkoutWeights(parseFloat(pressMax), 'Overhead Press', 3);
            const allWorkouts = combineWorkouts(squatWeights, benchWeights, deadliftWeights, pressWeights);

            setWorkouts(allWorkouts);

            await AsyncStorage.setItem('workouts', JSON.stringify(allWorkouts));
            setReloadData(!reloadData);
            setShowNewValues(false); // Hide new value inputs after saving
        } catch (error) {
            console.error('Error saving new maxes:', error);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Workout Cycles</Text>
            </View>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setShowNewValues(!showNewValues)}>
                <Text style={styles.toggleButtonText}>{showNewValues ? 'Hide New Values' : 'Enter New Values'}</Text>
            </TouchableOpacity>
            {showNewValues && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter New Squat Max"
                        value={squatMax}
                        onChangeText={setSquatMax}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter New Bench Max"
                        value={benchMax}
                        onChangeText={setBenchMax}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter New Deadlift Max"
                        value={deadliftMax}
                        onChangeText={setDeadliftMax}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter New Press Max"
                        value={pressMax}
                        onChangeText={setPressMax}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSaveNewMaxes}>
                        <Text style={styles.buttonText}>Save New Maxes</Text>
                    </TouchableOpacity>
                </>
            )}
            {isSaving && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />}
            <FlatList
                data={workouts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <WorkoutItem
                        item={item}
                        toggleCompletion={toggleCompletion}
                        handleSaveComments={handleSaveComments}
                        comments={comments}
                    />
                )}
            />

        </View>
    );
};

export default WorkoutCycleScreen;
