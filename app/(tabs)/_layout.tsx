import { View, Text, Animated, Easing } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RootLayout = () => {
  const bounceAnimGreen = useRef(new Animated.Value(1)).current;
  const bounceAnimYellow = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bounceGreen = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimGreen, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimGreen, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    const bounceYellow = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimYellow, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimYellow, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    bounceGreen.start();
    bounceYellow.start();

    return () => {
      bounceGreen.stop();
      bounceYellow.stop();
    };
  }, [bounceAnimGreen, bounceAnimYellow]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="Cus"
        options={{
          headerShown: false,
          tabBarLabel: "Custom",
          tabBarIcon: ({ color, size }) => (
            <Animated.View
              style={[styles.circularButtonYellow, { transform: [{ scale: bounceAnimYellow }] }]}
            >
              <Ionicons name="timer" size={14} color="#fff" />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="analitics"
        options={{
          headerShown: false,
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => (
            <Animated.View
              style={[styles.circularButtonGreen, { transform: [{ scale: bounceAnimGreen }] }]}
            >
              <Ionicons name="glasses" size={24} color="voilate" />
            </Animated.View>
          ),
        }}
      />
     
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#e0f7fa', // Light cyan color
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    height: 80,
  },
  tabBarLabel: {
    marginTop :6,
    fontSize: 13,
    fontWeight: 'bold',
  },
  tabBarIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularButtonGreen: {
    width: 42,
    height: 42,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  circularButtonYellow: {
    width: 42,
    height: 42,
    borderRadius: 25,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#fff107',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});

export default RootLayout;
