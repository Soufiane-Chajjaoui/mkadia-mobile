// SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Search, Sliders } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const navigation = useNavigation();

  const goToSearchScreen = () => {
    navigation.navigate("Search" as never);
  };

  return (
    <View style={styles.searchRow}>
      {/* Barre de recherche */}
      <Pressable style={styles.searchBar} onPress={goToSearchScreen}>
        <Search size={20} color="#999" />
        <TextInput 
          placeholder="Que cherchez-vous aujourd'hui ?" 
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
          editable={false} 
          pointerEvents="none"
        />
      </Pressable>

      {/* Bouton filtres */}
      <TouchableOpacity 
        style={styles.filterBtn} 
        activeOpacity={0.8}
        onPress={goToSearchScreen}
      >
        <Sliders size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20,
    gap: 12,
  },

  searchBar: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#F8F9FA", // fond doux comme les boutons du header
    borderRadius: 16, 
    paddingHorizontal: 16,
    paddingVertical: 4.2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  searchInput: { 
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#2C3E50",
  },

  filterBtn: { 
    backgroundColor: "#4CAF50", 
    padding: 13, 
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
});

export default SearchBar;
