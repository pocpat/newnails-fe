import React from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const logoXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116.13 143.58"><defs><style>.cls-1{fill:#fff;}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M13.45,126.24c3.54-.95,5.24,1.06,7.2,2,27.14,13.52,62.56,3,76.61-22.73,8.76-16.08,7.16-37.33-5-51-10.76-12-22.59-23.09-33.88-34.66-1.78-1.82-2.89-1.39-4.46.19-10.66,10.78-21.67,21.22-32,32.29C9.83,65.27,10.78,85.48,23.4,98a33.24,33.24,0,0,0,45.7,1c8.87-8.06,9.4-20.65,1.14-29.37-3.78-4-7.8-7.75-11.58-11.74-1.67-1.76-2.89-2.27-4.81-.21-4,4.26-8.35,8.15-12.26,12.47-5.48,6.06-6.62,13.19-4,21.05C26.83,87.31,23,71.69,31,62.39c7.24-8.46,15.57-16,23.36-24,1.69-1.73,2.73-1,4.07.37,7.5,7.58,15.35,14.84,22.5,22.72C94.94,77,91.28,100.35,73.22,112.69,53.23,126.36,27,122.77,11,104.2a45.94,45.94,0,0,1,1.66-61.53C26,28.68,39.95,15.29,53.53,1.55c1.95-2,3.2-2.14,5.23-.08,13.8,14,28,27.58,41.5,41.9,21.65,23,21,59.13-1,81.92a60.13,60.13,0,0,1-81.59,4.42C16.43,128.66,15.15,127.63,13.45,126.24Z"/></g></g></svg>`;

const MainHeader: React.FC = () => {
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
      <Appbar.Action
        icon={() => <SvgXml xml={logoXml} width="24" height="24" fill="#ab8a98" />}
        onPress={openMenu}
      />
      {showTryAgainButton ? (
        <View style={styles.centerButtonContainer}>
          <Button mode="contained" onPress={onTryAgainPress} labelStyle={styles.buttonLabel} style={styles.tryAgainButton}>
            Start Over
          </Button>
        </View>
      ) : (
        <Appbar.Content title="Tipsy" titleStyle={styles.title} />
      )}

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" color="#ab8a98" onPress={openMenu} />}
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
    textAlign: 'center',
  },
  buttonLabel: {
    color: 'rgba(0, 0, 0, 0.3)',
    fontFamily: 'Inter-Bold',
    fontSize: 12, // Smaller font size for the button label
  },
  tryAgainButton: {
    backgroundColor: '#ab8a98',
    borderRadius: 20,
    paddingHorizontal: 10, // Reduced horizontal padding
    paddingVertical: 3, // Reduced vertical padding
  },
  menuItem: {
    fontFamily: 'Inter-Variable',
    color: 'rgba(0, 0, 0, 0.3)',
  },
});

export default MainHeader;