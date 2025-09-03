import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Bell, ShoppingBag } from 'lucide-react-native';

interface HeaderProps {
  cartCount: number;
  hasNotification: boolean;
  location: string;
}

const Header: React.FC<HeaderProps> = ({ cartCount, hasNotification, location }) => {
  return (
    <View style={styles.header}>
      {/* Partie gauche */}
      <View style={styles.headerLeft}>
        <Text style={styles.welcomeText}>Bonjour 👋</Text>
        <View style={styles.location}>
          <MapPin size={16} color="#4CAF50" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
      
      {/* Partie droite */}
      <View style={styles.headerRight}>
        {/* Panier */}
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <ShoppingBag size={22} color="#2C3E50" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Notifications */}
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Bell size={22} color="#2C3E50" />
          {hasNotification && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingTop: 10,
  },

  headerLeft: {
    flex: 1,
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
  },

  location: { 
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 4,
  },

  locationText: { 
    marginLeft: 4, 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#4CAF50",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBtn: {
    position: "relative",
    padding: 10,
    backgroundColor: "#F8F9FA", // fond clair moderne
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#E53935",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  badge: { 
    position: "absolute", 
    top: 6, 
    right: 6, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: "#E53935",
  },
});

export default Header;
