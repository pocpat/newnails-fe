import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts, PottaOne_400Regular } from '@expo-google-fonts/potta-one';

import WelcomeScreen from './screens/WelcomeScreen';
import DesignFormScreen from './screens/DesignFormScreen';
import ResultsScreen from './screens/ResultsScreen';
import MyDesignsScreen from './screens/MyDesignsScreen';
import LoginScreen from './screens/LoginScreen';
import MainHeader from './components/MainHeader';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './lib/auth';

// Define the types for the navigation stack
export type RootStackParamList = {
  Welcome: undefined;
  DesignForm: { clear?: boolean };
  Results: {
    length: string;
    shape: string;
    style: string;
    colorConfig: string;
  };
  MyDesigns: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// This is the new component that holds all the navigation logic.
// Because it's a child of AuthProvider, it can safely use the useAuth hook.
const AppNavigator = () => {
  const { loading } = useAuth();

  // We can show a splash screen here while the auth state is loading
  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={({ route, navigation }) => ({
          header: (props) => (
            <MainHeader
              {...props}
              showTryAgainButton={route.name === 'Results'}
              onTryAgainPress={() => navigation.navigate('DesignForm')}
            />
          ),
        })}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DesignForm" component={DesignFormScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen
          name="MyDesigns"
          component={MyDesignsScreen}
          options={({ navigation }) => ({
            header: (props) => (
              <MainHeader
                {...props}
                showTryAgainButton={true}
                onTryAgainPress={() => navigation.navigate('DesignForm', { clear: true })}
              />
            ),
          })}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Footer />
    </NavigationContainer>
  );
};

// This is the main App component.
// Its only job is to set up the providers and load assets.
export default function App() {
  const [fontsLoaded] = useFonts({
    'PottaOne-Regular': PottaOne_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Or a loading indicator
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}