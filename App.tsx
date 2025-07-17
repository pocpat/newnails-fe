
import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import WelcomeScreen from './screens/WelcomeScreen';
import DesignFormScreen from './screens/DesignFormScreen';
import ResultsScreen from './screens/ResultsScreen';
import MyDesignsScreen from './screens/MyDesignsScreen';
import LoginScreen from './screens/LoginScreen'; // Import LoginScreen
import MainHeader from './components/MainHeader';
import Footer from './components/Footer';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const Stack = createNativeStackNavigator();

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    // You might want to render a loading spinner or splash screen here
    return null; 
  }

  return (
    <PaperProvider>
      <AuthContext.Provider value={{ user, loading }}>
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
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
          <Footer />
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}
