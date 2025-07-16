import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Card, IconButton, ToggleButton } from 'react-native-paper';
import * as api from '../lib/api'; // Assuming api.ts is in lib/

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 40) / 2; // Two images per row with some padding

const MyDesignsScreen = ({ navigation }) => {
  const [myDesigns, setMyDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'favorites'

  const fetchMyDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      // Placeholder for actual API call
      // const response = await api.getMyDesigns();
      // setMyDesigns(response.designs);

      // Mock data for now
      const mockDesigns = [
        { id: 'd1', url: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Saved1', isFavorite: false, createdAt: new Date('2025-07-15T10:00:00Z') },
        { id: 'd2', url: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Saved2', isFavorite: true, createdAt: new Date('2025-07-14T10:00:00Z') },
        { id: 'd3', url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Saved3', isFavorite: false, createdAt: new Date('2025-07-13T10:00:00Z') },
        { id: 'd4', url: 'https://via.placeholder.com/150/FFFF00/FFFFFF?text=Saved4', isFavorite: true, createdAt: new Date('2025-07-12T10:00:00Z') },
      ];
      setMyDesigns(mockDesigns);
    } catch (err) {
      setError('Failed to fetch designs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDesigns();
  }, []);

  const sortedDesigns = [...myDesigns].sort((a, b) => {
    if (sortOrder === 'favorites') {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleToggleFavorite = async (designId) => {
    // Implement toggle favorite logic here, call api.toggleFavorite
    console.log("Toggling favorite for:", designId);
    setMyDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design.id === designId ? { ...design, isFavorite: !design.isFavorite } : design
      )
    );
  };

  const handleDeleteDesign = async (designId) => {
    // Implement delete logic here, call api.deleteDesign
    console.log("Deleting design:", designId);
    // Show confirmation modal first
    if (confirm("Are you sure you want to delete this design?")) {
      setMyDesigns(prevDesigns => prevDesigns.filter(design => design.id !== designId));
    }
  };

  const renderDesignItem = ({ item }) => (
    <Card style={styles.designCard}>
      <TouchableOpacity onPress={() => setFullScreenImage(item.url)}>
        <Image source={{ uri: item.url }} style={styles.designImage} />
      </TouchableOpacity>
      <Card.Actions style={styles.cardActions}>
        <IconButton
          icon={item.isFavorite ? "star" : "star-outline"}
          color={item.isFavorite ? "gold" : "gray"}
          onPress={() => handleToggleFavorite(item.id)}
        />
        <IconButton
          icon="delete"
          color="red"
          onPress={() => handleDeleteDesign(item.id)}
        />
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your designs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchMyDesigns}>Retry</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Saved Designs</Text>
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ToggleButton.Group
          onValueChange={value => setSortOrder(value)}
          value={sortOrder}
        >
          <ToggleButton icon="clock-outline" value="recent" />
          <ToggleButton icon="star" value="favorites" />
        </ToggleButton.Group>
      </View>
      <FlatList
        data={sortedDesigns}
        renderItem={renderDesignItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />

      <Modal
        visible={!!fullScreenImage}
        transparent={true}
        onRequestClose={() => setFullScreenImage(null)}
      >
        <View style={styles.fullScreenModalContainer}>
          <Image source={{ uri: fullScreenImage }} style={styles.fullScreenImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeButton} onPress={() => setFullScreenImage(null)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  sortLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  flatListContent: {
    justifyContent: 'space-between',
  },
  designCard: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  designImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'cover',
  },
  cardActions: {
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyDesignsScreen;