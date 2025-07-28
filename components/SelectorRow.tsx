import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, LayoutChangeEvent, Image } from 'react-native';
import { SvgProps } from 'react-native-svg';

export interface SelectorOption {
  value: string;
  icon: React.FC<SvgProps>;
}

interface SelectorRowProps {
  title: string;
  options: (string | SelectorOption)[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  baseColor?: string | null; // New prop for the base color
  isBaseColorSelected?: boolean; // New prop to indicate if base color is selected
  isActive?: boolean; // New prop to indicate if the row is active
}

const SelectorRow = React.forwardRef<View, SelectorRowProps>(({ title, options, onSelect, selectedValue, style, onLayout, baseColor, isBaseColorSelected, isActive }, ref) => {
  // Helper function to determine if a color is light or dark
  const isColorLight = (hexColor: string) => {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155; // Adjust threshold as needed
  };

  return (
    <View ref={ref} style={[styles.container, style]} onLayout={onLayout}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isObject = typeof option === 'object' && option !== null;
          const value = isObject ? (option as SelectorOption).value : (option as string);
          const IconComponent = isObject ? (option as SelectorOption).icon : undefined;

          const isSelectedAndColorPalette = selectedValue === value && title === "Color Palette" && value === "Select" && baseColor;
          const optionBackgroundColor = isSelectedAndColorPalette ? baseColor : (selectedValue === value ? styles.selectedOption.backgroundColor : styles.option.backgroundColor);
          let optionBorderColor = styles.option.borderColor;
          let optionBorderWidth = styles.option.borderWidth;

          if (title === "Color Palette" && value === "Select") {
            if (baseColor) {
              // If base color is selected, border should match background (disappear)
              optionBorderColor = baseColor;
              optionBorderWidth = 1; // Reset to default or hide
            } else {
              // If no base color yet, but it's the "Select" button, show a distinct border
              optionBorderColor = '#FFFFFF'; // White border for visibility
              optionBorderWidth = 3; // Make border wider
            }
          } else if (selectedValue === value) {
            // For other selected options, use the selectedOption border color
            optionBorderColor = styles.selectedOption.borderColor;
            optionBorderWidth = 1; // Default border width for selected options
          }

          const optionTextColor = isSelectedAndColorPalette ? (isColorLight(baseColor) ? '#000000' : '#FFFFFF') : (selectedValue === value ? styles.selectedOptionText.color : styles.optionText.color);

          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.option,
                { backgroundColor: optionBackgroundColor, borderColor: optionBorderColor, borderWidth: optionBorderWidth },
                (title === "Nail Length" || title === "Nail Shape" || title === "Nail Style" || title === "Color Palette") && styles.lengthOption,
                title === "Color Palette" && value !== "Select" && !isBaseColorSelected && styles.colorSchemeDisabledOption,
              ]}
              onPress={() => onSelect(value)}
              disabled={title === "Color Palette" && value !== "Select" && !isBaseColorSelected}
            >
              {IconComponent ? (
                <>
                  <View style={styles.optionIcon}>
                    <IconComponent width="100%" height="100%" opacity={!isActive ? 0.3 : (title === "Color Palette" && value !== "Select" && !isBaseColorSelected ? 0.3 : 1)} />
                  </View>
                  <Text style={[styles.optionText, { color: optionTextColor }]}>
                    {value}
                  </Text>
                </>
              ) : (
                <Text
                  style={[
                    styles.optionText,
                    { color: optionTextColor },
                  ]}
                >
                  {value}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#C1B8C5',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  option: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#6d435a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#EFC9DA',
    borderColor: '#EFC9DA',
  },
  optionText: {
    color: '#6d435a',
    fontFamily: 'Inter-Variable',
    fontSize: 8,
  },
  selectedOptionText: {
    color: '#2EC4B6',
    fontFamily: 'Inter-Bold',
  },
  lengthOption: {
    width: 80,
    height: 100,
    flexDirection: 'column',
    // Switched to space-between to push icon up and text down
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 10, // Added padding top for balance
  },
  optionIcon: {
    width: 60,
    height: 60,
    // Removed marginBottom as justify-content will handle spacing
  },
  colorSchemeDisabledOption: {
    opacity: 0.8, // Brighter opacity for disabled color scheme options
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  // optionContent is no longer used, but can be kept for future use.
  optionContent: {
    alignItems: 'center',
  },
});

export default SelectorRow;