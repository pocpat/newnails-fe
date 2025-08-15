import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { Feather } from "@expo/vector-icons";
import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withRepeat,
  withTiming,
  Easing,
   SharedValue, 
} from "react-native-reanimated";
import { Colors } from "../lib/colors";

// SparkleIcon to use @expo/vector-icons
const SparkleIcon = ({ size, color }: { size: number; color: string }) => (
  <Feather name="star" size={size} color={color} />
);

const icons = [
  { id: 1, size: 20, color: Colors.lightPinkPurple, startX: 10, startY: 20 },
  { id: 2, size: 30, color: Colors.lightPurple, startX: 80, startY: 30 },
  { id: 3, size: 15, color: Colors.lightPink, startX: 90, startY: 80 },
  { id: 4, size: 25, color: Colors.lightPinkPurple, startX: 20, startY: 70 },
  { id: 5, size: 20, color: Colors.lightPurple, startX: 50, startY: 50 },
  { id: 6, size: 35, color: Colors.lightPink, startX: 5, startY: 90 },
  { id: 7, size: 20, color: Colors.lightPinkPurple, startX: 40, startY: 40 },
  { id: 8, size: 30, color: Colors.lightPurple, startX: 80, startY: 80 },
  { id: 9, size: 15, color: Colors.lightPink, startX: 20, startY: 60 },
  { id: 10, size: 25, color: Colors.lightPinkPurple, startX: 70, startY: 40 },
  { id: 11, size: 20, color: Colors.lightPurple, startX: 90, startY: 60 },
  { id: 12, size: 35, color: Colors.lightPink, startX: 5, startY: 70 },
];

const FloatingIcons = ({ isVisible = true }: { isVisible?: boolean }) => {
  // 1. Create the master "clock" shared value
  const clock = useSharedValue(0);

  // 2. Use useEffect to start the infinite animation loop
  useEffect(() => {
    // Animate the clock value from 0 to 1 over 10 seconds, and repeat forever.
    clock.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.linear }),
      -1, // -1 means infinite repetitions
      false // Do not reverse the animation
    );
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <MotiView
          style={styles.container}
          from={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        >
          {icons.map((icon) => (
            // 3. Pass the master clock down to each icon
            <AnimatedIcon key={icon.id} {...icon} clock={clock} />
          ))}
        </MotiView>
      )}
    </AnimatePresence>
  );
};

// 4. Update AnimatedIcon to accept the clock prop
const AnimatedIcon = ({
  size,
  color,
  startX,
  startY,
  clock, // <-- Accept the shared value as a prop
}: {
  size: number;
  color: string;
  startX: number;
  startY: number;
  clock: { value: number }; // Type for a Reanimated SharedValue
}) => {
  const radius = Math.random() * 5 + 8; // Smaller radius for more subtle movement
  const speedMultiplier = (Math.random() + 0.5) * 2; // Each icon gets a different speed
  const phase = Math.random() * Math.PI * 2; // Random starting point in the circle

  // 5. useAnimatedStyle now derives its values from the clock prop
  const animatedStyle = useAnimatedStyle(() => {
    // The clock.value goes from 0 to 1 repeatedly.
    // We multiply by 2 * PI to get a full circle (radian).
    const angle = clock.value * 2 * Math.PI * speedMultiplier + phase;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle * 1.5) * radius;

    const opacity = interpolate(dy, [-radius, 0, radius], [0.6, 1, 0.6]);
    const scale = interpolate(dx, [-radius, 0, radius], [0.8, 1.2, 0.8]);

       const style: ViewStyle = {
      opacity,
      transform: [{ translateX: dx }, { translateY: dy }, { scale }],
    };

    return style;
  });
  return (
    <MotiView
      style={[
        styles.iconWrapper,
        {
          left: `${startX}%`,
          top: `${startY}%`,
        },
        animatedStyle,
      ]}
      from={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "timing", duration: 600 }}
    >
      <SparkleIcon size={size} color={color} />
    </MotiView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  iconWrapper: {
    position: "absolute",
  },
});

export default FloatingIcons;
