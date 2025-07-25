import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SelectorRow from '../components/SelectorRow';
import { generateDesigns } from '../lib/api';

const lengthOptions = ["Short", "Medium", "Long"];
const shapeOptions = ["Square", "Round", "Almond", "Squoval", "Pointed", "Ballerina"];
const styleOptions = ["Classic French", "Floral", "Line Art", "Geometric", "Ombre", "Abstract", "Dot Nails", "Glitter"];
const colorConfigOptions = ["Base Color Picker", "Monochromatic", "Analogous", "Complimentary", "Triad", "Tetradic"];

const DesignFormScreen = ({ navigation, route }) => {
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedColorConfig, setSelectedColorConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.clear) {
      setSelectedLength(null);
      setSelectedShape(null);
      setSelectedStyle(null);
      setSelectedColorConfig(null);
      navigation.setParams({ clear: false });
    }
  }, [route.params?.clear]);

  const allOptionsSelected = selectedLength && selectedShape && selectedStyle && selectedColorConfig;

  const handleImpressMe = async () => {
    setLoading(true);
    try {
      const prompt = `A detailed closeup Nail design with ${selectedLength} length, ${selectedShape} shape, ${selectedStyle} style, and ${selectedColorConfig} color configuration.`
      const generatedImages = await generateDesigns({ prompt, model: "stabilityai/sdxl-turbo:free" });
      setLoading(false);
      navigation.navigate('Results', { generatedImages, length: selectedLength, shape: selectedShape, style: selectedStyle, colorConfig: selectedColorConfig });
    } catch (error) {
      setLoading(false);
      console.error("Error generating designs:", error);
      alert("Failed to generate designs. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg1.png')}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.title}>Create Your Masterpiece</Text>

          <SelectorRow title="Nail Length" options={lengthOptions} onSelect={setSelectedLength} selectedValue={selectedLength} />
          <SelectorRow title="Nail Shape" options={shapeOptions} onSelect={setSelectedShape} selectedValue={selectedShape} />
          <SelectorRow title="Nail Style" options={styleOptions} onSelect={setSelectedStyle} selectedValue={selectedStyle} />
          <SelectorRow title="Color Palette" options={colorConfigOptions} onSelect={setSelectedColorConfig} selectedValue={selectedColorConfig} />

          {allOptionsSelected && (
            <TouchableOpacity style={styles.impressMeButton} onPress={handleImpressMe} disabled={loading}>
              {loading ? <ActivityIndicator color="#4B0082" /> : <Text style={styles.buttonText}>Impress Me</Text>}
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1 },
  scrollViewContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PottaOne-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  impressMeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4B0082',
  },
});

export default DesignFormScreen;
