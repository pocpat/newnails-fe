
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const WelcomeScreen = ({ navigation }) => {
  // Since we are not using Clerk, we will just have the button enabled by default
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipsy</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('DesignForm')}
      >
        Press to start
      </Button>
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
