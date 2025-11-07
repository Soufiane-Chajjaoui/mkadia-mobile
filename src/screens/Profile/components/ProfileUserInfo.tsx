import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Edit2, Mail, Award } from 'lucide-react-native';
import { Colors, Spacing, Typography, Elevation } from '../../../constants/DesignSystem';

interface ProfileUserInfoProps {
  fullName: string;
  email: string;
  onEditPress?: () => void;
  memberSince?: string;
  showEditButton?: boolean;
}

const ProfileUserInfo: React.FC<ProfileUserInfoProps> = ({ 
  fullName, 
  email,
  onEditPress,
  showEditButton = true
}) => {
  const getInitials = () => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        {/* Avatar avec badge */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {fullName ? (
                <Text style={styles.avatarInitials}>{getInitials()}</Text>
              ) : (
                <User size={50} color={Colors.WHITE_ICON} />
              )}
            </View>
            {showEditButton && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={onEditPress}
                activeOpacity={0.8}
              >
                <Edit2 size={16} color={Colors.WHITE_ICON} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Informations utilisateur */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{fullName}</Text>

          {email && (
            <View style={styles.emailContainer}>
              <Mail size={16} color={Colors.GRAY_TEXT} />
              <Text style={styles.userEmail}>{email}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginBottom: Spacing.MD,
    paddingBottom: Spacing.LG,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Elevation.LOW,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: Spacing.XL,
    paddingHorizontal: Spacing.LG,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.LG,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.GREEN_BG,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.MEDIUM,
    borderWidth: 5,
    borderColor: Colors.WHITE,
  },
  avatarInitials: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.WHITE_TEXT,
    letterSpacing: 2,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.DARK_BLUE_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.WHITE,
    ...Elevation.LOW,
  },
  verifiedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.GREEN_BG,
    ...Elevation.LOW,
  },
  userInfoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    ...Typography.HEADLINE,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.SM,
    letterSpacing: 0.5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY_BG,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: 20,
    marginBottom: Spacing.SM,
  },
  userEmail: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    marginLeft: Spacing.XS,
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: Spacing.LG,
    paddingHorizontal: Spacing.LG,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.SM,
  },
});

export default ProfileUserInfo;