import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, IconButton } from 'react-native-paper';
import * as api from '../lib/api';

const IMAGE_GENERATION_MODELS = [
  'stabilityai/sdxl-turbo:free',
  'google/gemini-2.0-flash-exp:free',
  'black-forest-labs/FLUX-1-schnell:free',
  'HiDream-ai/HiDream-I1-Full:free',
];

const ResultsScreen = ({ route, navigation }) => {
  const { length, shape, style, colorConfig } = route.params || {};
  const [generatedDesigns, setGeneratedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

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
              num_images: 1,
              width: 1024,
              height: 1024,
            });
            if (response.imageUrls && response.imageUrls.length > 0) {
              allGeneratedImages.push({
                id: `${model}-${allGeneratedImages.length}`,
                url: response.imageUrls[0],
                saved: false,
              });
            }
          } catch (modelError) {
            console.error(`Error generating with model ${model}:`, modelError);
          }
        }
        setGeneratedDesigns(allGeneratedImages);
      } catch (err) {
        setError(`Failed to generate designs: ${err.message || 'Unknown error'}`);
        console.error('Error generating designs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [length, shape, style, colorConfig]);

  const handleSaveDesign = async (designToSave) => {
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
        <Image
          source={{ uri: item.url }}
          style={styles.designImage}
          onError={(e) => console.error('Image loading error:', e.nativeEvent.error, 'for URL:', item.url)}
        />
      </TouchableOpacity>
      <Card.Actions style={styles.cardActions}>
        <IconButton
          icon={item.saved ? "check-circle" : "content-save-outline"}
          iconColor={item.saved ? "#4CAF50" : "#FFFFFF"}
          onPress={() => handleSaveDesign(item)}
          disabled={item.saved}
          size={24}
        />
        <IconButton
          icon="fullscreen"
          iconColor="#FFFFFF"
          onPress={() => setFullScreenImage(item.url)}
          size={24}
        />
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <ImageBackground source={require('../assets/images/bg1.png')} style={styles.background}>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Generating your unique designs...</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={require('../assets/images/bg1.png')} style={styles.background}>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../assets/images/bg1.png')} style={styles.background}>
      <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Your Designs</Text>
          <FlatList
            data={generatedDesigns}
            renderItem={renderDesignItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!fullScreenImage}
          onRequestClose={() => setFullScreenImage(null)}
        >
          <View style={styles.fullScreenModalContainer}>
            <Image
              source={{ uri: fullScreenImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFullScreenImage(null)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1 },
  container: {
    flex: 1,
    padding: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PottaOne-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Inter-Variable',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Variable',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  flatListContent: {
    alignItems: 'center',
  },
  designCard: {
    margin: 5,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  designImage: {
    width: (Dimensions.get('window').width / 2) - 20,
    height: (Dimensions.get('window').width / 2) - 20,
  },
  cardActions: {
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '95%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4B0082',
  },
});

export default ResultsScreen;
