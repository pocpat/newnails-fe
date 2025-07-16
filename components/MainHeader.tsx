
import React from 'react';
import { Appbar, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface MainHeaderProps {
  showTryAgainButton?: boolean;
  onTryAgainPress?: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ showTryAgainButton, onTryAgainPress }) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const navigation = useNavigation();

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
        <Menu.Item onPress={() => { navigation.navigate('MyDesigns'); closeMenu(); }} title="My Designs" />
        <Menu.Item onPress={() => { navigation.navigate('DesignForm'); closeMenu(); }} title="Start Over" />
        <Menu.Item onPress={() => { console.log('Logout'); closeMenu(); }} title="Logout" />
      </Menu>
    </Appbar.Header>
  );
};

export default MainHeader;
