import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import WelcomeScreen from './screens/WelcomeScreen';
import DesignFormScreen from './screens/DesignFormScreen';
import ResultsScreen from './screens/ResultsScreen';
import MyDesignsScreen from './screens/MyDesignsScreen';
import LoginScreen from './screens/LoginScreen';
import MainHeader from './components/MainHeader';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './lib/auth';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Welcome: undefined;
  DesignForm: { clear?: boolean };
  Results: { length: string; shape: string; style: string; colorConfig: string };
  MyDesigns: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Auth loading is handled by the main App component
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
        <Stack.Screen name="MyDesigns" component={MyDesignsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Footer />
    </NavigationContainer>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          'PottaOne-Regular': require('./assets/fonts/PottaOne-Regular.ttf'),
          'Inter-Variable': require('./assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
          'Inter-Bold': require('./assets/fonts/Inter_18pt-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}