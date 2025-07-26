import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
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
  const [activeSection, setActiveSection] = useState('length');

  const scrollViewRef = useRef(null);

  // Define approximate Y offsets for each section
  const sectionOffsets = useRef({
    length: 0,
    shape: 280, // Approximate offset for shape section
    style: 550, // Approximate offset for style section
    color: 800, // Approximate offset for color section
    done: 1350, // Approximate offset for the end of the form
  });

  useEffect(() => {
    if (route.params?.clear) {
      setSelectedLength(null);
      setSelectedShape(null);
      setSelectedStyle(null);
      setSelectedColorConfig(null);
      setActiveSection('length');
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
      navigation.setParams({ clear: false });
    }
  }, [route.params?.clear]);

  const allOptionsSelected = selectedLength && selectedShape && selectedStyle && selectedColorConfig;

  const handleSelect = (setter, value, nextSection) => {
    setter(value);
    setActiveSection(nextSection);

    if (scrollViewRef.current) {
      const targetOffset = sectionOffsets.current[nextSection];
      if (typeof targetOffset === 'number') {
        scrollViewRef.current.scrollTo({ y: targetOffset, animated: true });
      }
    }
  };

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
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.title}>Create Your Masterpiece</Text>

          <SelectorRow title="Nail Length" options={lengthOptions} onSelect={(value) => handleSelect(setSelectedLength, value, 'shape')} selectedValue={selectedLength} style={activeSection === 'length' ? styles.activeSection : styles.inactiveSection} />
          <SelectorRow title="Nail Shape" options={shapeOptions} onSelect={(value) => handleSelect(setSelectedShape, value, 'style')} selectedValue={selectedShape} style={activeSection === 'shape' ? styles.activeSection : styles.inactiveSection} />
          <SelectorRow title="Nail Style" options={styleOptions} onSelect={(value) => handleSelect(setSelectedStyle, value, 'color')} selectedValue={selectedStyle} style={activeSection === 'style' ? styles.activeSection : styles.inactiveSection} />
          <SelectorRow title="Color Palette" options={colorConfigOptions} onSelect={(value) => handleSelect(setSelectedColorConfig, value, 'done')} selectedValue={selectedColorConfig} style={activeSection === 'color' ? styles.activeSection : styles.inactiveSection} />

          {allOptionsSelected && (
            <TouchableOpacity style={styles.impressMeButton} onPress={handleImpressMe} disabled={loading}>
              {loading ? <ActivityIndicator color="#4B0082" /> : <Text style={styles.buttonText}>Impress Me</Text>}
            </TouchableOpacity>
          )}
          <View style={styles.spacer} />
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
  activeSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 20,
  },
  inactiveSection: {
    opacity: 0.5,
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
  spacer: {
    height: Dimensions.get('window').height / 2,
  },
});

export default DesignFormScreen;