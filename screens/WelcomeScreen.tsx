
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../App'; // Import useAuth hook

const WelcomeScreen = ({ navigation }) => {
  const { user } = useAuth(); // Get user from AuthContext

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipsy</Text>
      {user ? (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('DesignForm')}
        >
          Press to start
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
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
  },
});

export default WelcomeScreen;
