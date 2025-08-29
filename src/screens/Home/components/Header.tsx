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
      <View style={styles.headerLeft}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bonjour 👋</Text>
          <View style={styles.location}>
            <MapPin size={16} color="#4CAF50" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.headerRight}>
        {/* Panier */}
        <TouchableOpacity style={styles.cartBtn} activeOpacity={0.7}>
          <ShoppingBag size={22} color="#4CAF50" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Notifications */}
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
          <Bell size={22} color="#4CAF50" />
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
    alignItems: "flex-start", 
    marginBottom: 20,
    paddingTop: 10,
  },
  
  headerLeft: {
    flex: 1,
  },
  
  welcomeSection: {
    gap: 4,
  },
  
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
  },
  
  location: { 
    flexDirection: "row", 
    alignItems: "center",
  },
  
  locationText: { 
    marginLeft: 4, 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#4CAF50" 
  },
  
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  
  cartBtn: {
    position: "relative",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#E53935",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  
  notificationBtn: { 
    position: "relative",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  
  badge: { 
    position: "absolute", 
    top: 6, 
    right: 6, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: "#E53935" 
  },
});

export default Header;