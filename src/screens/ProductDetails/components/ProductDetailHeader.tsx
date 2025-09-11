import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { ArrowLeft, Heart, Share2 } from "lucide-react-native";
import { Colors, IconSize, Spacing, BorderRadius } from "../../../constants/DesignSystem";


interface ProductDetailHeaderProps {
  isFavorite: boolean;
  onBackPress: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
}

const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({ 
  isFavorite,
  onBackPress,
  onShare,
  onToggleFavorite
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
      
      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={onBackPress}
        >
          <ArrowLeft size={IconSize.LG} color={Colors.GREEN_BG} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerButton, { marginRight: Spacing.SM }]}
            onPress={onShare}
          >
            <Share2 size={IconSize.MD} color={Colors.GREEN_BG} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onToggleFavorite}
          >
            <Heart 
              size={IconSize.MD} 
              color={isFavorite ? Colors.RED_ICON : Colors.GREEN_BG}
              fill={isFavorite ? Colors.RED_ICON : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.XXS,
    paddingVertical: Spacing.SM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY_BG,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.CIRCULAR,
    opacity: 20,
    // backgroundColor: Colors.LIGHT_GRAY_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
});

export default ProductDetailHeader;