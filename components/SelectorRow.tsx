import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, LayoutChangeEvent, Image } from 'react-native';

export interface SelectorOption {
  value: string;
icon: React.FC<React.SVGProps<SVGSVGElement>>;}

interface SelectorRowProps {
  title: string;
  options: (string | SelectorOption)[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const SelectorRow = React.forwardRef<View, SelectorRowProps>(({ title, options, onSelect, selectedValue, style, onLayout }, ref) => {
  return (
    <View ref={ref} style={[styles.container, style]} onLayout={onLayout}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isObject = typeof option === 'object' && option !== null;
          const value = isObject ? (option as SelectorOption).value : (option as string);
          const IconComponent = isObject ? (option as SelectorOption).icon : undefined;

          // The console.log can be removed now that we've diagnosed the issue.
          // console.log('IconComponent type:', typeof IconComponent, 'value:', IconComponent);

          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.option,
                selectedValue === value && styles.selectedOption,
                (title === "Nail Length" || title === "Nail Shape" || title === "Nail Style") && styles.lengthOption,
              ]}
              onPress={() => onSelect(value)}
            >
              {IconComponent ? (
                // FIX: Render icon inside a fixed-size View to prevent layout loops, and also render the text.
                <>
                  <View style={styles.optionIcon}>
                    <IconComponent width="100%" height="100%" />
                  </View>
                  <Text style={[styles.optionText, selectedValue === value && styles.selectedOptionText]}>
                    {value}
                  </Text>
                </>
              ) : (
                // Fallback for options without an icon
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === value && styles.selectedOptionText,
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
    color: '#FFFFFF',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Variable',
    fontSize: 8,
  },
  selectedOptionText: {
    color: '#4B0082',
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
  // optionContent is no longer used, but can be kept for future use.
  optionContent: {
    alignItems: 'center',
  },
});

export default SelectorRow;