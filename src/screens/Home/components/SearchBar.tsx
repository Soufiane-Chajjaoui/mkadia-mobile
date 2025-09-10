import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Pressable, Animated } from 'react-native';
import { Search, Sliders, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BorderRadius, Colors, Elevation, IconSize, Spacing, Typography } from '../../../constants/DesignSystem';


interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterPress?: () => void;
  onSearchPress?: () => void;
  showClearButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  onFilterPress,
  onSearchPress,
  showClearButton = true
}) => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      navigation.navigate("Search" as never);
    }
  };

  const handleFilterPress = () => {
    if (onFilterPress) {
      onFilterPress();
    } else {
      navigation.navigate("Search" as never);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.searchRow}>
      {/* Barre de recherche */}
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused
      ]}>
        <Search 
          size={IconSize.MD} 
          color={isFocused ? Colors.GREEN_BG : Colors.GRAY_TEXT} 
        />
        <TextInput 
          placeholder="Que cherchez-vous aujourd'hui ?" 
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.GRAY_TEXT}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel="Champ de recherche"
          accessibilityRole="search"
        />
        {showClearButton && searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={handleClearSearch}
            style={styles.clearButton}
            accessibilityLabel="Effacer la recherche"
            accessibilityRole="button"
          >
            <X size={IconSize.SM} color={Colors.GRAY_TEXT} />
          </TouchableOpacity>
        )}
      </View>

      {/* Bouton filtres */}
      <TouchableOpacity 
        style={[
          styles.filterBtn,
          isFocused && styles.filterBtnFocused
        ]} 
        activeOpacity={0.8}
        onPress={handleFilterPress}
        accessibilityLabel="Filtres de recherche"
        accessibilityRole="button"
      >
        <Sliders size={IconSize.MD} color={Colors.WHITE_TEXT} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: Spacing.SM,
    paddingHorizontal: Spacing.XXS,
    gap: Spacing.SM,
  },

  searchContainer: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.LG, 
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BG,
    ...Elevation.LOW,
  },

  searchContainerFocused: {
    borderColor: Colors.GREEN_BG,
    backgroundColor: Colors.WHITE,
  },

  searchInput: { 
    flex: 1,
    marginLeft: Spacing.SM,
    marginRight: Spacing.SM,
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    padding: Spacing.XS, // Important pour iOS
  },

  clearButton: {
    padding: Spacing.XS,
  },

  filterBtn: { 
    backgroundColor: Colors.GREEN_BG, 
    padding: Spacing.MD, 
    borderRadius: BorderRadius.LG,
    ...Elevation.MEDIUM,
  },

  filterBtnFocused: {
    backgroundColor: Colors.DARK_GREEN_BG,
  },
});

export default SearchBar;