import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
import { Card, IconButton, ToggleButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import * as api from '../lib/api';
import { Colors } from '../lib/colors';

const { width } = Dimensions.get('window');

const MyDesignsScreen = ({ navigation }) => {
  const [myDesigns, setMyDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'favorites'

  const fetchMyDesigns = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMyDesigns();
      const formattedDesigns = response.map(design => ({
        ...design,
        id: design._id,
        url: design.imageUrl,
      }));
      setMyDesigns(formattedDesigns || []);
    } catch (err) {
      setError('Failed to fetch designs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMyDesigns();
    }, [fetchMyDesigns])
  );

  const sortedDesigns = [...myDesigns].sort((a, b) => {
    if (sortOrder === 'favorites') {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleToggleFavorite = async (designId) => {
    const originalDesigns = myDesigns;
    setMyDesigns(prevDesigns =>
      prevDesigns.map(d => (d.id === designId ? { ...d, isFavorite: !d.isFavorite } : d))
    );
    try {
      await api.toggleFavorite(designId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setMyDesigns(originalDesigns);
      Alert.alert("Error", "Failed to update favorite status. Please try again.");
    }
  };

  const handleDeleteDesign = (designId) => {
    Alert.alert(
      "Delete Design",
      "Are you sure you want to permanently delete this design?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const originalDesigns = myDesigns;
            setMyDesigns(prevDesigns => prevDesigns.filter(d => d.id !== designId));
            try {
              await api.deleteDesign(designId);
            } catch (error) {
              console.error("Failed to delete design:", error);
              setMyDesigns(originalDesigns);
              Alert.alert("Error", "Failed to delete design. Please try again.");
            }
          },
        },
      ]
    );
  };

  const renderDesignItem = ({ item }) => (
    <Card style={styles.designCard}>
      <TouchableOpacity onPress={() => setFullScreenImage(item.url)}>
        <Image source={{ uri: item.url }} style={styles.designImage} />
      </TouchableOpacity>
      <Card.Actions style={styles.cardActions}>
        <IconButton
          icon={item.isFavorite ? "heart" : "heart-outline"}
          iconColor={Colors.teal}
          onPress={() => handleToggleFavorite(item.id)}
          size={24}
        />
        <IconButton
          icon="delete-outline"
          iconColor={Colors.lightRedSalmon}
          onPress={() => handleDeleteDesign(item.id)}
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <ImageBackground source={require('../assets/images/bg1.png')} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>My Saved Designs</Text>
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <ToggleButton.Group
              onValueChange={value => setSortOrder(value)}
              value={sortOrder}
            >
              <ToggleButton icon="clock-outline" value="recent" />
              <ToggleButton icon="heart" value="favorites" />
            </ToggleButton.Group>
          </View>
          {sortedDesigns.length > 0 ? (
            <FlatList
                data={sortedDesigns}
                renderItem={renderDesignItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <View style={styles.centeredContainer}>
                <Text style={styles.emptyText}>You haven't saved any designs yet.</Text>
            </View>
          )}
        </View>
        <Modal visible={!!fullScreenImage} transparent={true} onRequestClose={() => setFullScreenImage(null)}>
          <View style={styles.fullScreenModalContainer}>
            <Image source={{ uri: fullScreenImage }} style={styles.fullScreenImage} resizeMode="contain" />
            <TouchableOpacity style={styles.closeButton} onPress={() => setFullScreenImage(null)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
    container: { flex: 1, padding: 10 },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 36, fontFamily: 'PottaOne-Regular', color: Colors.lightYellowCream,     textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,textAlign: 'center', marginVertical: 20 },
    loadingText: { marginTop: 20, fontSize: 18, fontFamily: 'Inter-Variable', color: Colors.white },
    errorText: { fontSize: 18, fontFamily: 'Inter-Variable', color: Colors.lightRedSalmon, textAlign: 'center', marginBottom: 20 },
    emptyText: { fontSize: 18, fontFamily: 'Inter-Variable', color: Colors.white, textAlign: 'center' },
    sortContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    sortLabel: { fontSize: 16, marginRight: 10, color: Colors.lightPurple },
    sortButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginHorizontal: 5, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
    sortButtonActive: { backgroundColor: Colors.white },
    sortButtonText: { color: Colors.white, fontFamily: 'Inter-Bold' },
    sortButtonTextActive: { color: Colors.indigo },
    flatListContent: { alignItems: 'center' },
    designCard: { margin: 5, borderRadius: 15, overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
    designImage: { width: (width / 2) - 20, height: (width / 2) - 20 },
    cardActions: { justifyContent: 'space-around', backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    fullScreenModalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
    fullScreenImage: { width: '95%', height: '80%' },
    closeButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    closeButtonText: { color: Colors.white, fontSize: 18, fontFamily: 'Inter-Bold' },
    button: { backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, alignSelf: 'center', marginTop: 20 },
    buttonText: { fontSize: 18, fontFamily: 'Inter-Bold', color: Colors.darkPinkPurple },
});

export default MyDesignsScreen;