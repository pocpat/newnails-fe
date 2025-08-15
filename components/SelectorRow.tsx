import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, LayoutChangeEvent, Image, ImageSourcePropType } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Colors } from '../lib/colors';

export interface SelectorOption {
  value: string;
  icon: React.FC<SvgProps> | ImageSourcePropType;
}

interface SelectorRowProps {
  title: string;
  options: (string | SelectorOption)[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  baseColor?: string | null;
  isBaseColorSelected?: boolean;
  isActive?: boolean;
}

const SelectorRow = React.memo(React.forwardRef<View, SelectorRowProps>(({ title, options, onSelect, selectedValue, style, onLayout, baseColor, isBaseColorSelected, isActive }, ref) => {
  const isColorLight = (hexColor: string) => {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
  };

  return (
    <View ref={ref} style={[styles.container, style]} onLayout={onLayout}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isObject = typeof option === 'object' && option !== null;
          const value = isObject ? (option as SelectorOption).value : (option as string);
          const Icon = isObject ? (option as SelectorOption).icon : undefined;

          const isSelectedAndColorPalette = selectedValue === value && title === "Color Palette" && value === "Select" && baseColor;
          const optionBackgroundColor = isSelectedAndColorPalette ? baseColor : (selectedValue === value ? styles.selectedOption.backgroundColor : styles.option.backgroundColor);
          let optionBorderColor = styles.option.borderColor;
          let optionBorderWidth = styles.option.borderWidth;

          if (title === "Color Palette" && value === "Select") {
            if (baseColor) {
              optionBorderColor = baseColor;
              optionBorderWidth = 1;
            } else {
              optionBorderColor = '#FFFFFF';
              optionBorderWidth = 3;
            }
          } else if (selectedValue === value) {
            optionBorderColor = styles.selectedOption.borderColor;
            optionBorderWidth = 1;
          }

          const optionTextColor = isSelectedAndColorPalette ? (isColorLight(baseColor) ? Colors.black : Colors.white) : (selectedValue === value ? styles.selectedOptionText.color : styles.optionText.color);

          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.option,
                { backgroundColor: optionBackgroundColor, borderColor: optionBorderColor, borderWidth: optionBorderWidth },
                (title === "Nail Length" || title === "Nail Shape" || title === "Nail Style" || title === "Color Palette") && styles.lengthOption,
                title === "Color Palette" && value !== "Select" && !isBaseColorSelected && styles.colorSchemeDisabledOption,
                isActive ? styles.activeOptionShadow : styles.inactiveOptionShadow,
              ]}
              onPress={() => onSelect(value)}
              disabled={title === "Color Palette" && value !== "Select" && !isBaseColorSelected}
            >
              {Icon ? (
                <>
                  <View style={styles.optionIcon}>
                    {typeof Icon === 'number' ? (
                      <Image source={Icon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                    ) : (
                      (Icon as React.FC<SvgProps>)({ width: "100%", height: "100%", opacity: !isActive ? 0.3 : (title === "Color Palette" && value !== "Select" && !isBaseColorSelected ? 0.3 : 1) })
                    )}
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
}));

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.dustyBroun,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  option: {
    backgroundColor: 'rgba(119, 105, 121, 1)',

    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 0,
    borderColor: Colors.darkPinkPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOptionShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inactiveOptionShadow: {
    shadowOpacity: 0,
    elevation: 0,
  },
  selectedOption: {
    backgroundColor: Colors.lightPink,
    borderColor: Colors.lightPink,
  },
  optionText: {
    color: Colors.black,
    fontFamily: 'Inter-Variable',
    fontSize: 8,
  },
  selectedOptionText: {
    color: Colors.teal,
    fontFamily: 'Inter-Bold',
  },
  lengthOption: {
    width: 80,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 10,
  },
  optionIcon: {
    width: 60,
    height: 60,
  },
  colorSchemeDisabledOption: {
    opacity: 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  optionContent: {
    alignItems: 'center',
  },
});

export default SelectorRow;