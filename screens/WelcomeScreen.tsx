import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../lib/auth';

const WelcomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <ImageBackground
      source={require('../assets/images/bg1.png')}
      style={styles.background}
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
            buttonColor="#ab8a98"
          >
            Press to start
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            labelStyle={{ fontFamily: 'Inter-Bold' }}
            buttonColor="#ab8a98"
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
    color: '#F5E9D3',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Variable',
    marginBottom: 20, // Added margin
    color: '#F5E9D3',
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
