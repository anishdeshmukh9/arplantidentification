import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import * as Location from "expo-location";

const SpeedTracker = () => {
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [timerDuration, setTimerDuration] = useState(4); // in minutes

  const lastSpeedRef = useRef(0);
  const lastUpdateTimeRef = useRef(Date.now());
  const lastPositionRef = useRef(null);
  const speedHistoryRef = useRef([]);
  const recordedDataRef = useRef([]);
  const remainingTimeRef = useRef(0);
  const stepsRef = useRef(0);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 0 },
        (location) => {
          const { latitude, longitude, speed: rawSpeed, accuracy } = location.coords;
          const currentTime = Date.now();
          setCurrentAccuracy(accuracy);

          if (accuracy > 10) return; // Ignore low accuracy readings

          const lastPosition = lastPositionRef.current;

          if (lastPosition && latitude === lastPosition.latitude && longitude === lastPosition.longitude) {
            if (currentTime - lastUpdateTimeRef.current > 1500) {
              setSpeed(0);
              setAcceleration(0);
            }
            return;
          }

          lastPositionRef.current = { latitude, longitude };

          let speedKmH = (rawSpeed || 0) * 3.6;
          if (speedKmH < 0.3) speedKmH = 0;

          speedHistoryRef.current = [...speedHistoryRef.current.slice(-6), speedKmH];

          // Simple moving average
          const smoothedSpeed = speedHistoryRef.current.reduce((a, b) => a + b, 0) / speedHistoryRef.current.length;

          // Compute acceleration
          const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
          if (deltaTime === 0) return; // Avoid division by zero

          const deltaSpeed = smoothedSpeed - lastSpeedRef.current;
          const computedAcceleration = deltaSpeed / deltaTime;

          setSpeed(smoothedSpeed.toFixed(2));
          setAcceleration(isFinite(computedAcceleration) ? computedAcceleration.toFixed(2) : 0);

          lastSpeedRef.current = smoothedSpeed;
          lastUpdateTimeRef.current = currentTime; // Update time after calculations

          if (timerRunning && smoothedSpeed > 0.5 && accuracy < 10) {
            recordedDataRef.current.push({ time: currentTime, speed: smoothedSpeed, acceleration: computedAcceleration });
            stepsRef.current += 1;
          }
        }
      );
    };

    startTracking();
  }, [timerRunning]);

  const startTimer = () => {
    remainingTimeRef.current = timerDuration * 60;
    setTimerRunning(true);
    setAnalytics(null);
    recordedDataRef.current = [];
    stepsRef.current = 0;

    timerIntervalRef.current = setInterval(() => {
      remainingTimeRef.current -= 1;
      if (remainingTimeRef.current <= 0) {
        clearInterval(timerIntervalRef.current);
        setTimerRunning(false);
        calculateAnalytics();
      }
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerIntervalRef.current);
    setTimerRunning(false);
    calculateAnalytics();
  };

  const calculateAnalytics = () => {
    if (recordedDataRef.current.length === 0) return;

    const totalSpeed = recordedDataRef.current.reduce((sum, data) => sum + data.speed, 0);
    const avgSpeed = (totalSpeed / recordedDataRef.current.length).toFixed(2);

    const totalAcceleration = recordedDataRef.current.reduce((sum, data) => sum + parseFloat(data.acceleration), 0);
    const avgAcceleration = (totalAcceleration / recordedDataRef.current.length).toFixed(2);

    setAnalytics({ avgSpeed, avgAcceleration, totalSteps: stepsRef.current });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speed Tracker</Text>
      <Text style={styles.speed}>{speed} km/h</Text>
      <Text style={styles.acceleration}>Acceleration: {acceleration} km/h/s</Text>
      <Text style={styles.accuracy}>Accuracy: {parseInt(currentAccuracy)} meters</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <View style={styles.timerControls}>
        <TextInput style={styles.input} keyboardType="numeric" value={String(timerDuration)} onChangeText={(text) => setTimerDuration(parseInt(text) || 0)} />
        <Text style={{ color: "orange" }}> minutes</Text>
        {!timerRunning ? (
          <TouchableOpacity style={styles.button} onPress={startTimer}>
            <Text style={styles.buttonText}>Start Timer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={stopTimer}>
            <Text style={styles.buttonText}>Stop Timer</Text>
          </TouchableOpacity>
        )}
      </View>

      {timerRunning && <Text style={styles.timer}>Time Remaining: {Math.floor(remainingTimeRef.current / 60)}:{String(remainingTimeRef.current % 60).padStart(2, "0")}</Text>}

      {analytics && (
        <View style={styles.analytics}>
          <Text style={styles.analyticsText}>Avg Speed: {analytics.avgSpeed} km/h</Text>
          <Text style={styles.analyticsText}>Avg Acceleration: {analytics.avgAcceleration} km/h/s</Text>
          <Text style={styles.analyticsText}>Total Steps: {analytics.totalSteps}</Text>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#24f13",
      padding: 20, // Add padding for better spacing
    },
    title: {
      fontSize: 28, // Increase title font size
      fontWeight: "bold",
      color: "black",
      marginBottom: 20,
    },
    speed: {
      fontSize: 50, // Increase speed font size
      fontWeight: "bold",
      color: "black",
      marginBottom: 10,
    },
    acceleration: {
      fontSize: 20,
      color: "black",
      marginTop: 10,
    },
    accuracy: {
      fontSize: 18,
      color: "#AAA",
      marginTop: 10,
    },
    error: {
      fontSize: 16,
      color: "red",
      marginTop: 20,
    },
    timerControls: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30, // Increase margin
    },
    input: {
      borderWidth: 1,
      borderColor: "#555", // Darker border
      padding: 10, // Increase padding
      width: 60, // Increase width
      marginRight: 10,
      color: "black",
      borderRadius: 8, // Rounded corners
      fontSize: 16, // Increase font size
    },
    button: {
      backgroundColor: "#00FF",
      paddingVertical: 12, // Increase vertical padding
      paddingHorizontal: 20, // Increase horizontal padding
      borderRadius: 8,
      marginLeft: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    timer: {
      marginTop: 20, // Increase margin
      fontSize: 20, // Increase font size
      color: "black",
      fontWeight: "500",
    },
    analytics: {
      marginTop: 30, // Increase margin
      width: "100%", // Take full width
      alignItems: 'center', // Center content
    },
    analyticsText: {
      fontSize: 18,
      color: "black",
      marginBottom: 8,
      textAlign: 'center',
    },
    analyticsContainer: {
      backgroundColor: "",
      padding: 20,
      borderRadius: 12,
      width: '90%',
    }
  });
export default SpeedTracker;