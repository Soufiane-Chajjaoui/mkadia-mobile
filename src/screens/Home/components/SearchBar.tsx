import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, Sliders } from 'lucide-react-native';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBar}>
        <Search size={20} color="#999" />
        <TextInput 
          placeholder="Que cherchez-vous aujourd'hui ?" 
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
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
    backgroundColor: "#FFFFFF", 
    borderRadius: 16, 
    paddingHorizontal: 16,
    paddingVertical: 4,
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
  },
});

export default SearchBar;