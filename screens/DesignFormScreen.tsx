import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, ImageBackground, Dimensions } from 'react-native';
import ThreeDButton from '../components/ThreeDButton';
import { Colors } from '../lib/colors';
import SelectorRow, { SelectorOption } from '../components/SelectorRow';
import ColorPickerModal from '../components/ColorPickerModal';
import { generateDesigns } from '../lib/api';

// --- All your icon imports are correct ---
import LengthShortIcon from '../assets/images/length_short.svg';
import LengthMediumIcon from '../assets/images/length_medium.svg';
import LengthLongIcon from '../assets/images/length_long.svg';
import ShapeSquareIcon from '../assets/images/shape_square.svg';
import ShapeRoundIcon from '../assets/images/shape_round.svg';
import ShapeAlmondIcon from '../assets/images/shape_almond.svg';
import ShapeSquovalIcon from '../assets/images/shape_squoval.svg';
import ShapePointedIcon from '../assets/images/shape_pointed.svg';
import ShapeBallerinaIcon from '../assets/images/shape_ballerina.svg';
import StyleFrenchIcon from '../assets/images/style_french.svg';
import StyleFloralIcon from '../assets/images/style_floral.svg';
import StyleLineArtIcon from '../assets/images/style_line.svg';
import StyleGeometricIcon from '../assets/images/style_geometric.svg';
import StyleOmbreIcon from '../assets/images/style_ombre.svg';
import StyleAbstractIcon from '../assets/images/style_abstract.svg';
import StyleDotNailsIcon from '../assets/images/style_dots.svg';
import StyleGlitterIcon from '../assets/images/style_glitter.png';
import ColorBaseIcon from '../assets/images/color_select.svg';
import ColorMonochromaticIcon from '../assets/images/color_mono.svg';
import ColorAnalogousIcon from '../assets/images/color_analog.svg';
import ColorComplimentaryIcon from '../assets/images/color_complim.svg';
import ColorTriadIcon from '../assets/images/color_triad.svg';
import ColorTetradicIcon from '../assets/images/color_tetra.svg';


// --- All your options arrays are correct ---
const lengthOptions: SelectorOption[] = [
  { value: "Short", icon: LengthShortIcon },
  { value: "Medium", icon: LengthMediumIcon },
  { value: "Long", icon: LengthLongIcon },
];
const shapeOptions: SelectorOption[] = [
  { value: "Square", icon: ShapeSquareIcon },
  { value: "Round", icon: ShapeRoundIcon },
  { value: "Almond", icon: ShapeAlmondIcon },
  { value: "Squoval", icon: ShapeSquovalIcon },
  { value: "Pointed", icon: ShapePointedIcon },
  { value: "Ballerina", icon: ShapeBallerinaIcon },
];
const styleOptions: SelectorOption[] = [
  { value: "French", icon: StyleFrenchIcon },
  { value: "Floral", icon: StyleFloralIcon },
  { value: "Line Art", icon: StyleLineArtIcon },
  { value: "Geometric", icon: StyleGeometricIcon },
  { value: "Ombre", icon: StyleOmbreIcon },
  { value: "Abstract", icon: StyleAbstractIcon },
  { value: "Dot Nails", icon: StyleDotNailsIcon },
  { value: "Glitter", icon: StyleGlitterIcon },
];
const colorConfigOptions: SelectorOption[] = [
  { value: "Select", icon: ColorBaseIcon },
  { value: "Mono", icon: ColorMonochromaticIcon },
  { value: "Analog", icon: ColorAnalogousIcon },
  { value: "Contrast", icon: ColorComplimentaryIcon },
  { value: "Balanced", icon: ColorTriadIcon },
  { value: "Rich", icon: ColorTetradicIcon },
];


const DesignFormScreen = ({ navigation, route }) => {
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedColorConfig, setSelectedColorConfig] = useState(null);
  const [selectedBaseColor, setSelectedBaseColor] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isBaseColorSelected, setIsBaseColorSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('length');

  const scrollViewRef = useRef(null);
  const sectionOffsets = useRef({
    length: 0,
    shape: 340,
    style: 620,
    color: 1020,
    done: 2500,
  });

  useEffect(() => {
    if (route.params?.clear) {
      setSelectedLength(null);
      setSelectedShape(null);
      setSelectedStyle(null);
      setSelectedColorConfig(null);
      setSelectedBaseColor(null);
      setActiveSection('length');
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
      navigation.setParams({ clear: false });
    }
  }, [route.params?.clear]);

  const allOptionsSelected = selectedLength && selectedShape && selectedStyle && selectedColorConfig && (selectedColorConfig !== "Select" || selectedBaseColor);

  const handleColorSelect = (hex: string) => {
    setSelectedBaseColor(hex);
    setSelectedColorConfig("Select");
    setShowColorPicker(false);
    setIsBaseColorSelected(true);
  };

  const handleSelect = (setter, value, nextSection) => {
    const startTime = Date.now();
    console.log('handleSelect called');
    if (value === "Select") {
      setShowColorPicker(true);
      return;
    }
    setter(value);
    setActiveSection(nextSection);
    setTimeout(() => {
      if (scrollViewRef.current) {
        const targetOffset = sectionOffsets.current[nextSection];
        if (typeof targetOffset === 'number') {
          scrollViewRef.current.scrollTo({ y: targetOffset, animated: true });
        }
      }
    }, 50);
    const endTime = Date.now();
    console.log(`handleSelect execution time: ${endTime - startTime}ms`);
  };

  const handleImpressMe = async () => {
    if (!allOptionsSelected) {
      alert("Please complete all selections before generating.");
      return;
    }
    setLoading(true);
    try {
      let prompt = `A detailed closeup Nail design with ${selectedLength} length, ${selectedShape} shape, ${selectedStyle} style,`;
      if (selectedColorConfig === "Select" && selectedBaseColor) {
        prompt += ` and a base color of ${selectedBaseColor} with a ${selectedColorConfig} color configuration.`;
      } else {
        prompt += ` and ${selectedColorConfig} color configuration.`;
      }

      const result = await generateDesigns({ prompt, model: "stabilityai/sdxl-turbo:free" });

      setLoading(false);
      navigation.navigate('Results', { 
        generatedImages: result.imageUrls, 
        length: selectedLength, 
        shape: selectedShape, 
        style: selectedStyle, 
        colorConfig: selectedColorConfig, 
        baseColor: selectedBaseColor 
      });

    } catch (error) {
      setLoading(false);
      console.error("Fatal error in handleImpressMe:", error);
      alert(`Generation Failed: ${error.message}`);
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/images/bg1.png')}
        style={styles.background}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.title}>Create Your Masterpiece</Text>
          <SelectorRow title="Nail Length" options={lengthOptions} onSelect={(value) => handleSelect(setSelectedLength, value, 'shape')} selectedValue={selectedLength} style={activeSection === 'length' ? styles.activeSection : styles.inactiveSection} isActive={activeSection === 'length'} />
          <SelectorRow title="Nail Shape" options={shapeOptions} onSelect={(value) => handleSelect(setSelectedShape, value, 'style')} selectedValue={selectedShape} style={activeSection === 'shape' ? styles.activeSection : styles.inactiveSection} isActive={activeSection === 'shape'} />
          <SelectorRow title="Nail Style" options={styleOptions} onSelect={(value) => handleSelect(setSelectedStyle, value, 'color')} selectedValue={selectedStyle} style={activeSection === 'style' ? styles.activeSection : styles.inactiveSection} isActive={activeSection === 'style'} />
          <SelectorRow title="Color Palette" options={colorConfigOptions} onSelect={(value) => handleSelect(setSelectedColorConfig, value, 'done')} selectedValue={selectedColorConfig} style={activeSection === 'color' ? styles.activeSection : styles.inactiveSection} baseColor={selectedBaseColor} isBaseColorSelected={isBaseColorSelected} isActive={activeSection === 'color'} />
          
          {allOptionsSelected && (
            <ThreeDButton
              onPress={handleImpressMe}
              disabled={loading}
              loading={loading}
              title="Impress Me"
            />
          )}
          <View style={styles.spacer} />
        </ScrollView>
      </ImageBackground>
      <ColorPickerModal
        isVisible={showColorPicker}
        onSelectColor={handleColorSelect}
        onClose={() => setShowColorPicker(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  scrollViewContainer: { padding: 20, paddingTop: 40 },
  title: {
    fontSize: 36,
    fontFamily: 'PottaOne-Regular',
    color: Colors.lightYellowCream,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  activeSection: { backgroundColor: Colors.lightGrayPurple, borderRadius: 10, marginBottom: 20 },
  inactiveSection: { backgroundColor: Colors.lightDustyBroun, opacity: 0.25 },
  spacer: { height: Dimensions.get('window').height / 2 },
});

export default DesignFormScreen;