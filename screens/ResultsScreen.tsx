import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import * as api from '../lib/api';
import MainHeader from '../components/MainHeader';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 40) / 2; // Two images per row with some padding

// Define the list of models to use for generation
const IMAGE_GENERATION_MODELS = [
  'stabilityai/sdxl-turbo:free',
  'google/gemini-2.0-flash-exp:free',
  'black-forest-labs/FLUX-1-schnell:free',
  'HiDream-ai/HiDream-I1-Full:free',
  // 'lodestones/Chroma:free', // Chroma model might require specific parameters or have issues
  // 'ByteDance/InfiniteYou:free', // InfiniteYou model might require specific parameters or have issues
];

const ResultsScreen = ({ route, navigation }) => {
  const { length, shape, style, colorConfig } = route.params || {};
  const [generatedDesigns, setGeneratedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const handleTryAgain = () => {
    setHasFetched(false); // Reset fetch status
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <MainHeader />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        setError(null);

        const prompt = `A ${length} ${shape} nail with ${style} design and ${colorConfig} color scheme.`;
        const allGeneratedImages = [];

        for (const model of IMAGE_GENERATION_MODELS) {
          try {
            const response = await api.generateDesigns({
              prompt,
              model,
              n: 1, // Request 1 image per model
              size: '1024x1024',
            });
            // Assuming response.imageUrls is an array of URLs
            if (response.imageUrls && response.imageUrls.length > 0) {
              allGeneratedImages.push({
                id: `${model}-${allGeneratedImages.length}`,
                url: response.imageUrls[0], // Take the first image from the response
                saved: false,
              });
            }
          } catch (modelError) {
            console.error(`Error generating with model ${model}:`, modelError);
            // Continue to the next model even if one fails
          }
        }
        setGeneratedDesigns(allGeneratedImages);
      } catch (err) {
        setError(`Failed to generate designs: ${err.message || 'Unknown error'}`);
        console.error('Error generating designs:', err);
      } finally {
        setLoading(false);
        setHasFetched(true); // Mark as fetched
      }
    };

    if (!hasFetched) {
      fetchDesigns();
    }
  }, [length, shape, style, colorConfig, hasFetched]);

  const handleSaveDesign = async (designToSave) => {
    // Optimistically update the UI to show the design as saved
    setGeneratedDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design.id === designToSave.id ? { ...design, saved: true } : design
      )
    );

    try {
      await api.saveDesign({
        prompt: `A ${length} ${shape} nail with ${style} design and ${colorConfig} color scheme.`,
        temporaryImageUrl: designToSave.url,
      });
    } catch (error) {
      console.error("Failed to save design:", error);
      // Revert the UI change on error
      setGeneratedDesigns(prevDesigns =>
        prevDesigns.map(design =>
          design.id === designToSave.id ? { ...design, saved: false } : design
        )
      );
      setError("Failed to save design. Please try again.");
    }
  };

  const renderDesignItem = ({ item }) => (
    <Card style={styles.designCard}>
      <TouchableOpacity onPress={() => setFullScreenImage(item.url)}>
        <Image source={{ uri: item.url }} style={styles.designImage} />
      </TouchableOpacity>
      <Card.Actions style={styles.cardActions}>
        <IconButton
          icon={item.saved ? "check" : "content-save"}
          color={item.saved ? "green" : "gray"}
          onPress={() => handleSaveDesign(item)}
          disabled={item.saved}
        />
        <IconButton
          icon="fullscreen"
          color="gray"
          onPress={() => setFullScreenImage(item.url)}
        />
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Generating your unique designs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={handleTryAgain}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Generated Designs</Text>
      <FlatList
        data={generatedDesigns}
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

export default ResultsScreen;