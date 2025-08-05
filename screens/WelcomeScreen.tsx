import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../lib/auth';
import { Colors } from '../lib/colors';

const WelcomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <ImageBackground
      source={require('../assets/images/bg1.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>DiPSY</Text>
        <Text style={styles.subtitle}>Create unique designs</Text>
        <Image source={require('../assets/images/hero-img.png')} style={styles.heroImage} />
        {user ? (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('DesignForm')}
            labelStyle={{ fontFamily: 'Inter-Bold', color: Colors.lightPink }}
            buttonColor={Colors.darkPinkPurple}
          >
            Press to start
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            labelStyle={{ fontFamily: 'Inter-Bold', color: Colors.lightPink }}
            buttonColor={Colors.darkPinkPurple}
          >
            Login / Sign Up
          </Button>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 44,
    marginBottom: 10, // Reduced margin
    fontFamily: 'PottaOne-Regular',
    color: Colors.lightYellowCream,
    textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Variable',
    marginBottom: 20, // Added margin
    color: Colors.lightYellowCream,
    textAlign: 'center',
  },
  heroImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30, // Added margin
  },
});

export default WelcomeScreen;
