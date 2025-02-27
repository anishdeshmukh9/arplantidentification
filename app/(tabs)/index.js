import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // For battery & GPS icons

const SpeedTracker = () => {
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lastSpeed, setLastSpeed] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [gpsStatus, setGpsStatus] = useState(true);
  const speedLimit = 110; // Set speed limit for alerts

  useEffect(() => {
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("GPS Permission Denied");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 500,
          distanceInterval: 0,
        },
        (location) => {
          const { speed: rawSpeed } = location.coords;
          let speedKmH = (rawSpeed || 0) * 3.6; // Convert m/s to km/h

          // Ignore low-speed fluctuations
          if (speedKmH < 2) speedKmH = 0;

          setSpeed(speedKmH.toFixed(1));

          // Acceleration Calculation
          const currentTime = Date.now();
          if (lastSpeed !== null) {
            const deltaTime = (currentTime - lastUpdateTime) / 1000; // in seconds
            if (deltaTime > 0) {
              const deltaSpeed = speedKmH - lastSpeed;
              const currentAcceleration = deltaSpeed / deltaTime;
              setAcceleration(currentAcceleration.toFixed(2));
            }
          }

          setLastSpeed(speedKmH);
          setLastUpdateTime(currentTime);
          setGpsStatus(true);
        }
      );
    };
    startTracking();
  }, []);

  return (
    <View style={styles.container}>
      {/* Battery & GPS Icons */}
      <View style={styles.topBar}>
        <Ionicons name={gpsStatus ? "location" : "location-off"} size={34} color={gpsStatus ? "lightgreen" : "red"} />
      </View>

      {/* Digital Speed Display */}
      <View style={styles.speedContainer}>
        <Text style={speed > speedLimit ? styles.speedAlert : styles.speed}>{speed}</Text>
        <Text style={styles.unit}>km/h</Text>
      </View>

      {/* Acceleration Display */}
      <Text style={styles.acceleration}>Acceleration: {acceleration} m/s²</Text>

      {/* Speed Limit Warning */}
      {speed > speedLimit && <Text style={styles.warning}>⚠ Overspeeding!</Text>}

      {/* GPS Error */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#24f13",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    top: 20,
  },
  speedContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  speed: {
    fontSize: 80,
    fontWeight: "bold",
    color: "black",
  },
  speedAlert: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#ff0000z",
    textShadowColor: "rgba(255, 0, 0, 0.6)",
    textShadowRadius: 10,
  },
  unit: {
    fontSize: 20,
    color: "#aaa",
    marginBottom: 12,
    marginLeft: 5,
  },
  acceleration: {
    fontSize: 18,
    fontWeight:"bold",
    color: "green",
    marginTop: 10,
  },
  warning: {
    fontSize: 18,
    color: "#ffcc00",
    marginTop: 10,
  },
  error: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});

export default SpeedTracker;
