import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../lib/auth';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <ImageBackground
      source={require('../assets/images/bg1.png')}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.title}>TiPSY</Text>
          <Text style={styles.subtitle}>Your AI assistant</Text>
          <Image source={require('../assets/images/hero-img.png')} style={styles.heroImage} />
          {user ? (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('DesignForm')}
              labelStyle={{ fontFamily: 'Inter-Bold' }}
            >
              Press to start
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              labelStyle={{ fontFamily: 'Inter-Bold' }}
            >
              Login / Sign Up
            </Button>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
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
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Variable',
    marginBottom: 20, // Added margin
    color: '#FFFFFF',
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