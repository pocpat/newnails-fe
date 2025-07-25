import React from 'react';
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
import { AuthProvider, useAuth } from './lib/auth'; // Import from the new auth file

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
    // You might want to render a loading spinner or splash screen here
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
        <Stack.Screen name="MyDesigns" component={MyDesignsScreen} options={({ navigation }) => ({
          header: (props) => (
            <MainHeader
              {...props}
              showTryAgainButton={true}
              onTryAgainPress={() => navigation.navigate('DesignForm', { clear: true })}
            />
          ),
        })} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Footer />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
