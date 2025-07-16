
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import WelcomeScreen from './screens/WelcomeScreen';
import DesignFormScreen from './screens/DesignFormScreen';
import ResultsScreen from './screens/ResultsScreen';
import MyDesignsScreen from './screens/MyDesignsScreen';
import MainHeader from './components/MainHeader';
import Footer from './components/Footer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={({ route }) => ({
            header: (props) => (
              <MainHeader
                {...props}
                showTryAgainButton={route.name === 'Results'}
                onTryAgainPress={() => props.navigation.navigate('DesignForm')}
              />
            ),
          })}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DesignForm" component={DesignFormScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="MyDesigns" component={MyDesignsScreen} />
        </Stack.Navigator>
        <Footer />
      </NavigationContainer>
    </PaperProvider>
  );
}
