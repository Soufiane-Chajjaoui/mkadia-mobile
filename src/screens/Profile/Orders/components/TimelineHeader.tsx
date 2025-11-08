import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Colors, Spacing, Typography, IconSize } from '../../../../constants/DesignSystem';

interface TimelineHeaderProps {
  month: string;
  year: string;
  count: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ month, year, count }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Calendar size={20} color={Colors.WHITE} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.monthYear}>
            {month} {year}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.count}>
              {count} commande{count > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: Spacing.LG,
  },
  line: {
    position: 'absolute',
    left: 21,
    top: 22,
    bottom: -Spacing.LG,
    width: 2,
    backgroundColor: Colors.GRAY_ICON,
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: Colors.LIGHT_GRAY_BG,
    paddingVertical: Spacing.SM,
    paddingRight: Spacing.MD,
    zIndex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.GREEN_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.MD,
    borderWidth: 3,
    borderColor: Colors.LIGHT_GRAY_BG,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthYear: {
    ...Typography.SUBHEAD,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 18,
  },
  badge: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.MD,
    paddingVertical: 6,
    borderRadius: 20,
  },
  count: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TimelineHeader;

