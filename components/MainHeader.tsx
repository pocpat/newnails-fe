import React from 'react';
import { Appbar, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAuth } from '../lib/auth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Colors } from '../lib/colors';

const logoXml = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve">
<style type="text/css">
	.st0{fill:${Colors.solidTeal};}
</style>
<g>
	<g id="Layer_2_1_">
		<g id="Layer_1-2_1_">
			<path class="st0" d="M13.6,42.7c0.8-0.2,2.7,0.5,3.2,0.7c6.3,2.8,13.9,1,17.2-4.3c1-1.6,1.4-3.4,1.1-5.1c0-1.8-0.7-3.5-1.9-4.9
				c-1.1-1.3-2.7-3.6-3.9-4.8c-2.9-3.4-3.5-7.2-4.2-11.6c-1.9,3.8-1.3,8.8-4.8,12.2c-1.2,1.2-2.8,3.1-3.7,4.6
				c-0.9,1.3-1.2,2.8-0.8,4.4c0.2,1.5,1,2.8,2.1,3.8c2.9,2.6,6.3,2.6,9.4,0.2c1-0.8,1.7-2,1.6-3.3c-0.1-1.1-0.7-1.9-1.3-2.7
				c-0.7-0.8-1.3-1.7-2.1-2.4c-0.4-0.4-0.7-0.5-1.1,0c-1,1-2.4,2-3.3,3.1c-0.7,0.9-0.5,2.3,0.3,3.5c0.1,0.1,0.5,0.5,0.6,0.7
				c0-0.1-0.6-0.3-0.6-0.3c-1.4-0.5-3.1-1.8-3.6-3.2c-0.6-1.8,1.1-3.5,1.8-4c1.6-1.3,3.4-2.8,4.9-4.2c0.4-0.4,0.6-0.1,0.9,0.3
				c1.7,1.4,4.2,3.2,5.9,4.8c3.3,3.2,2.4,8-1.8,10.5c-2.8,1.7-6.4,2-9.6,1.4c-1.7-0.3-3.4-1-4.8-2s-2.6-2.3-1.8-3.5
				C11.1,34.1,11,32,14,30.3c-1.8-1.9-0.7-3.3,1.3-4.5c4.8-7.4,7.9-15.6,9.2-24.4c2.5,8.2,4.4,17,10.4,24.1c1.4,1.3,2.7,2.6,1.4,4.2
				c3,1.8,3.4,3.6,0.4,5.8c2.8,1.4,2.3,3.2,0.5,5.1c0.3,0.8-0.5,1.8-1.5,2.7c-5.1,4.6-14,5-19.7,0.9C15.7,43.9,14,42.9,13.6,42.7z"
				/>
		</g>
	</g>
</g>
</svg>`;

interface MainHeaderProps {
  showTryAgainButton?: boolean;
  onTryAgainPress?: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ showTryAgainButton = false, onTryAgainPress }) => {
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
        icon={() => <SvgXml xml={logoXml} width="30" height="28" fill={Colors.solidTeal} />}
        onPress={openMenu}
      />
      {showTryAgainButton ? (
        <View style={styles.centerButtonContainer}>
          <Button mode="contained" onPress={onTryAgainPress} labelStyle={styles.buttonLabel} style={styles.tryAgainButton}>
            Start Over
          </Button>
        </View>
      ) : (
        <Appbar.Content title="DiPSY" titleStyle={styles.title} />
      )}

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" color={Colors.solidTeal} onPress={openMenu} />}
        contentStyle={{ backgroundColor: Colors.greyAzure }}
      >
        {user ? (
          <>
            <Menu.Item
              onPress={() => { navigation.navigate('MyDesigns'); closeMenu(); }}
              title="My Library"
              titleStyle={{ color: Colors.darkPinkPurple }}
            />
            <Menu.Item
              onPress={() => { navigation.navigate('DesignForm', { clear: true }); closeMenu(); }}
              title="Start Over"
              titleStyle={{ color: Colors.darkPinkPurple }}
            />
            <Menu.Item onPress={handleLogout} title="Logout" titleStyle={{ color: Colors.darkPinkPurple }} />
          </>
        ) : (
          <Menu.Item
            onPress={() => { navigation.navigate('Login'); closeMenu(); }}
            title="Login"
            titleStyle={{ color: Colors.darkPinkPurple }}
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
    color: Colors.solidTeal,
    fontFamily: 'PottaOne-Regular',
    fontSize: 24,
    textAlign: 'center',
  },
  buttonLabel: {
    color: Colors.darkPinkPurple,
    fontFamily: 'Inter-Bold',
    fontSize: 12, // Smaller font size for the button label
  },
  tryAgainButton: {
    backgroundColor: Colors.solidTeal,
    borderRadius: 20,
    paddingHorizontal: 10, // Reduced horizontal padding
    paddingVertical: 3, // Reduced vertical padding
  },
});

export default MainHeader;