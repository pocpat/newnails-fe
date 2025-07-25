import React from 'react';
import { Appbar, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { StyleSheet, View } from 'react-native';

interface MainHeaderProps {
  showTryAgainButton?: boolean;
  onTryAgainPress?: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ showTryAgainButton, onTryAgainPress }) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeMenu();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" color="#E0BBE4" onPress={openMenu} />
      {showTryAgainButton && (
        <View style={styles.centerButtonContainer}>
          <Button mode="contained" onPress={onTryAgainPress} labelStyle={styles.buttonLabel} style={styles.tryAgainButton}>
            Start Over
          </Button>
        </View>
      )}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" color="#E0BBE4" onPress={openMenu} />}
      >
        {user ? (
          <>
            <Menu.Item
              onPress={() => { navigation.navigate('MyDesigns'); closeMenu(); }}
              title="My Designs"
              titleStyle={styles.menuItem}
            />
            <Menu.Item
              onPress={() => { navigation.navigate('DesignForm', { clear: true }); closeMenu(); }}
              title="Start Over"
              titleStyle={styles.menuItem}
            />
            <Menu.Item onPress={handleLogout} title="Logout" titleStyle={styles.menuItem} />
          </>
        ) : (
          <Menu.Item
            onPress={() => { navigation.navigate('Login'); closeMenu(); }}
            title="Login"
            titleStyle={styles.menuItem}
          />
        )}
      </Menu>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
    elevation: 0,
    shadowOpacity: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#E0BBE4',
    fontFamily: 'PottaOne-Regular',
    fontSize: 24,
  },
  buttonLabel: {
    color: '#4B0082',
    fontFamily: 'Inter-Bold',
    fontSize: 12, // Smaller font size for the button label
  },
  tryAgainButton: {
    backgroundColor: '#E0BBE4',
    borderRadius: 20,
    paddingHorizontal: 10, // Reduced horizontal padding
    paddingVertical: 3, // Reduced vertical padding
  },
  menuItem: {
    fontFamily: 'Inter-Variable',
    color: '#E0BBE4',
  },
});

export default MainHeader;