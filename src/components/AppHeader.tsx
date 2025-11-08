import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, Settings } from 'lucide-react-native';
import { Colors, Spacing, Typography, IconSize, Elevation } from '../constants/DesignSystem';

interface AppHeaderProps {
  onBackPress: () => void;
  onSettingsPress?: () => void;
  showSettings?: boolean;
  title: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onBackPress, 
  onSettingsPress,
  title,
  showSettings = false 
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <ChevronLeft size={IconSize.XL} color={Colors.DARK_BLUE_TEXT} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.titleUnderline} />
        </View>
        
        {showSettings ? (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Settings size={IconSize.MD} color={Colors.DARK_BLUE_TEXT} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.WHITE,
    ...Elevation.MEDIUM,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.MD,
    paddingTop: Spacing.LG,
    paddingBottom: Spacing.MD,
    backgroundColor: Colors.WHITE,
  },
  backButton: {
    width: 15,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.HEADLINE,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    letterSpacing: 0.3,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: Colors.GREEN_BG,
    borderRadius: 2,
    marginTop: Spacing.XS,
  },
});

export default AppHeader;

