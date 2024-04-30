export const calculateWorkoutWeights = (initialTrainingMax, liftName, numCycles) => {
    const workouts = [];
    let trainingMax = initialTrainingMax;
    let increment = liftName === 'Overhead Press' ? 2.5 : 5; // Adjust increment based on lift

    for (let cycle = 1; cycle <= numCycles; cycle++) {
        for (let week = 1; week <= 4; week++) {
            const percentages = getPercentages(week);
            const weekWorkout = {
                cycle,
                week,
                lift: liftName,
                sets: percentages.map((percentage, index) => {
                    const reps = getReps(week, index + 1);
                    return {
                        id: `${liftName}_${cycle}_${week}_${index}`,
                        weight: Math.round((percentage / 100) * trainingMax),
                        percentage,
                        reps,
                        completed: false,
                    };
                }),
            };
            workouts.push(weekWorkout);
        }

        // Increment training max for the next cycle
        trainingMax += increment;
    }

    return workouts;
};

export const getReps = (week, setNumber) => {
    switch (week) {
        case 1:
            return setNumber === 3 ? '5+' : 5;
        case 2:
            return setNumber === 3 ? '3+' : 3;
        case 3:
            switch (setNumber) {
                case 1:
                    return 5;
                case 2:
                    return 3;
                case 3:
                    return setNumber === 3 ? '1+' : 1;
                default:
                    return 0;
            }
        case 4:
            return 5; // All sets are 5 reps for week 4
        default:
            return 0;
    }
};


export const getPercentages = (week) => {
    switch (week) {
        case 1:
            return [65, 75, 85];
        case 2:
            return [70, 80, 90];
        case 3:
            return [75, 85, 95];
        case 4: // Deload week
            return [40, 50, 60];
        default:
            return [];
    }
};

export const combineWorkouts = (...workoutsArrays) => {
    const combinedWorkouts = [];
    const maxWeeks = workoutsArrays.reduce((max, workouts) => Math.max(max, workouts.length), 0);

    for (let week = 0; week < maxWeeks; week++) {
        workoutsArrays.forEach((workouts) => {
            if (workouts.length > week) {
                combinedWorkouts.push(workouts[week]);
            }
        });
    }

    return combinedWorkouts;
};
