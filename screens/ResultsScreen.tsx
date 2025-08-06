// FIXED ResultsScreen.tsx
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

import { Card, IconButton } from 'react-native-paper';
import * as api from '../lib/api';
import { Colors } from '../lib/colors';

const IMAGE_GENERATION_MODELS = [
  'stabilityai/sdxl-turbo:free',
  'google/gemini-2.0-flash-exp:free',
  'black-forest-labs/FLUX-1-schnell:free',
  'HiDream-ai/HiDream-I1-Full:free',
];

const ResultsScreen = ({ route, navigation }) => {
  // CHANGE: Accept the new params structure
  const { generatedImages, length, shape, style, color, baseColor } = route.params || {};
  
  const [generatedDesigns, setGeneratedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    // CHANGE: If we already have generatedImages, use them instead of generating new ones
    if (generatedImages && generatedImages.length > 0) {
      const formattedImages = generatedImages.map((url, index) => ({
        id: `existing-${index}`,
        url: url,
        saved: false,
      }));
      setGeneratedDesigns(formattedImages);
      setLoading(false);
      return;
    }

    // CHANGE: Only generate if we don't have images but have the form data
    if (length && shape && style) {
      fetchDesigns();
    } else {
      setError("Missing design parameters");
      setLoading(false);
    }
  }, [generatedImages, length, shape, style, color, baseColor]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError(null);

      // CHANGE: Use the new raw params format instead of prompt
      const designOptions = {
        length: length,
        shape: shape,
        style: style,
        color: color, // This is the color config (Analog, etc.)
        baseColor: baseColor, // This is the hex color
      };

      console.log("ResultsScreen: Sending design options:", designOptions);

      const allGeneratedImages = [];

      for (const model of IMAGE_GENERATION_MODELS) {
        try {
          // CHANGE: Send raw params instead of prompt
          const response = await api.generateDesigns({
            ...designOptions,
            model: model,
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

  const handleSaveDesign = async (designToSave) => {
    setGeneratedDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design.id === designToSave.id ? { ...design, saved: true } : design
      )
    );

    try {
      // CHANGE: Build a proper prompt for saving (this is just for the save record)
      const savePrompt = `${length} ${shape} nails with ${style} style${color && color !== 'Pick a Base Color' ? ` in ${color} colors` : ''}${baseColor ? ` using ${baseColor} as base color` : ''}.`;
      
      await api.saveDesign({
        prompt: savePrompt,
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
          iconColor={item.saved ? Colors.green : Colors.teal}
          onPress={() => handleSaveDesign(item)}
          disabled={item.saved}
          size={24}
        />
        <IconButton
          icon="fullscreen"
          iconColor={Colors.teal}
          onPress={() => setFullScreenImage(item.url)}
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <ImageBackground source={require('../assets/images/bg1.png')} style={styles.background}>
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={Colors.white} />
            <Text style={styles.loadingText}>Generating your unique designs...</Text>
          </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={require('../assets/images/bg1.png')} style={styles.background}>
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../assets/images/bg1.png')} style={styles.background}>
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
    </ImageBackground>
  );
};

// ... styles remain the same ...
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
    color: Colors.lightYellowCream,
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Inter-Variable',
    color: Colors.white,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Variable',
    color: Colors.lightRedSalmon,
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
    color: Colors.darkPinkPurple,
  },
});

export default ResultsScreen;