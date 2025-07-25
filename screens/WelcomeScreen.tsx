import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../lib/auth'; // Import useAuth hook

const WelcomeScreen = ({ navigation }) => {
  const { user } = useAuth(); // Get user from AuthContext

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    marginBottom: 40,
    fontFamily: 'PottaOne-Regular',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter-Variable',
    marginTop: -30,
  },
  heroImage: {
    width: '100%',
    height: 300, 
    resizeMode: 'contain',
    marginVertical: 20,
  },
});

export default WelcomeScreen;