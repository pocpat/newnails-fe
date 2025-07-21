
import React from 'react';
import { Appbar, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface MainHeaderProps {
  showTryAgainButton?: boolean;
  onTryAgainPress?: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ showTryAgainButton, onTryAgainPress }) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeMenu();
      navigation.navigate('Welcome'); // Navigate to Welcome after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Appbar.Header>
      <Appbar.Content title="Tipsy" />
      {showTryAgainButton && (
        <Button mode="text" onPress={onTryAgainPress} textColor="white">
          Let's Try Again
        </Button>
      )}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
        {user ? (
          <>
            <Menu.Item onPress={() => { navigation.navigate('MyDesigns'); closeMenu(); }} title="My Designs" />
            <Menu.Item onPress={() => { navigation.navigate('DesignForm', { clear: true }); closeMenu(); }} title="Start Over" />
            <Menu.Item onPress={handleLogout} title="Logout" />
          </>
        ) : (
          <Menu.Item onPress={() => { navigation.navigate('Login'); closeMenu(); }} title="Login" />
        )}
      </Menu>
    </Appbar.Header>
  );
};

export default MainHeader;
