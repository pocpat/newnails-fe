import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MotiView, AnimatePresence } from "moti"; // <-- Changed from framer-motion
import { fetchRandomFunFact } from "../lib/api"; // Assuming this is already native-friendly
import { Colors } from "../lib/colors"; // Assuming this exists
import FloatingIcons from "../components/FloatingIcons"; // You will also need to refactor this component

// Get screen dimensions for scaling
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoadingPage = () => {
  const [funFact, setFunFact] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const getFact = async () => {
      try {
        const data = await fetchRandomFunFact();
        if (isMounted) setFunFact(data.text);
      } catch (err) {
        if (isMounted) setError("Waiting for the magic to happen...");
        console.error(err);
      }
    };

    getFact();
    const intervalId = setInterval(getFact, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    // Use View instead of divs
    <View style={styles.pageContainer}>
      <FloatingIcons isVisible={true} />
      <View style={styles.centeredContent}>
        {/* We can't easily animate a gradient background with a border radius like this.
            For now, let's use a static shape. A LinearGradient component could be used for more advanced effects. */}
        <View style={styles.headerCircle}>
          <Text style={styles.title}>Generating your designs...</Text>
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Please wait, this can take a moment.
          </Text>
        </View>

        <View style={styles.funFactWrapper}>
          <View style={styles.funFactContainer}>
            {/* AnimatePresence and MotiView work just like Framer Motion! */}
            <AnimatePresence exitBeforeEnter>
              <MotiView
                key={funFact || error}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -20 }}
                transition={{ type: 'timing', duration: 500 }}
              >
                <Text style={styles.funFactText}>{error || funFact}</Text>
              </MotiView>
            </AnimatePresence>
          </View>
        </View>
      </View>
    </View>
  );
};

// Use StyleSheet.create for performance and validation
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1, // Use flex: 1 to fill the screen
    backgroundColor: Colors.white,
    position: 'relative',
    overflow: 'hidden',
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Adjust justification
    zIndex: 1,
  },
  headerCircle: {
    width: '120%', // Use percentages for responsiveness
    height: screenHeight * 0.5, // Use screen height for sizing
    backgroundColor: Colors.darkCherry, // Simplified static background
    borderBottomLeftRadius: 900, // Large radius to create the curve
    borderBottomRightRadius: 900,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '30%', // Adjust padding
    transform: [{ translateY: -screenHeight * 0.25 }], // Move it up
  },
  title: {
    fontFamily: 'PottaOne-Regular', // Font file name must match
    fontSize: 32,
    color: Colors.white, // Changed color for contrast
    textAlign: 'center',
    position: 'relative',
    top: screenHeight * 0.04, // Adjust positioning
  },
  subtitleContainer: {
    marginTop: -screenHeight * 0.2, // Adjust margin
    textAlign: 'center',
    marginBottom:0,
  },
  subtitle: {
    fontFamily: 'Inter-Medium', // Ensure you have this font weight
    fontSize: 20,
    fontWeight: '500',
    color: Colors.greyAzure,
    textAlign: 'center',
   
  },
  funFactWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  funFactContainer: {
    minHeight: 120, // Give it a minimum height
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  funFactText: {
    fontFamily: 'PottaOne-Regular',
    fontSize: 28,
    color: Colors.greyAzure,
    textAlign: 'center',
  },
});

export default LoadingPage;