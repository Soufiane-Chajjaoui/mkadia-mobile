import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StatusBar,
} from 'react-native';
import { LogIn, ShoppingCart, User, ArrowRight, ArrowLeft, MapPin, Bell, ShoppingBag } from 'lucide-react-native';
import { Colors, IconSize, Spacing, BorderRadius, Elevation, Typography } from '../../../constants/DesignSystem';
import { navigate } from '../../../navigation/NavigationService';

export interface LoginRequiredScreenProps {
  navigation?: any;
  onLoginPress?: () => void;
  onGuestPress?: () => void;
  onBackPress?: () => void;
  title?: string;
  subtitle?: string;
  showGuestOption?: boolean;
  showBackButton?: boolean;

  // 👇 Nouveaux props pour icons dynamiques
  icons?: {
    primary?: React.ReactNode;
    secondary?: React.ReactNode;
    benefits?: {
      icon: React.ReactNode;
      text: string;
    }[];
  };
}

const LoginRequiredScreen: React.FC<LoginRequiredScreenProps> = ({
  navigation,
  onLoginPress,
  onGuestPress,
  onBackPress,
  title = "Connexion requise",
  subtitle = "Vous devez être connecté pour accéder à votre panier et passer commande",
  showGuestOption = true,
  showBackButton = true,
  icons, // 👈 récupération des icônes
}) => {
  const handleLoginPress = () => {
    navigate('Login');
  };

  const handleRegisterPress = () => {
    navigate('SignUp');
  };

  const handleGuestPress = () => {
    if (onGuestPress) onGuestPress();
    else if (navigation) navigate('Home');
  };

  const handleBackPress = () => {
    if (onBackPress) onBackPress();
    else if (navigation) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header avec bouton retour repositionné */}
        {showBackButton && (
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleBackPress}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={IconSize.MD} color={Colors.DARK_BLUE_TEXT} />
            </TouchableOpacity>
          </View>
        )}

        {/* Contenu principal centré verticalement */}
        <View style={styles.mainContent}>
          {/* Section des icônes - plus compacte */}
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <View style={styles.primaryIcon}>
                {icons?.primary ?? <LogIn size={48} color={Colors.RED} />}
              </View>
              <View style={styles.secondaryIcon}>
                {icons?.secondary ?? <ShoppingCart size={28} color={Colors.GRAY_ICON} />}
              </View>
            </View>
          </View>

          {/* Section de contenu textuel */}
          <View style={styles.textSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Section des bénéfices - layout horizontal pour plus de compacité */}
          <View style={styles.benefitsSection}>
            <View style={styles.benefitsGrid}>
              {(icons?.benefits ?? [
                { icon: <ShoppingBag size={IconSize.SM} color={Colors.GREEN_TEXT} />, text: "Sauvegardez votre panier" },
                { icon: <Bell size={IconSize.SM} color={Colors.GREEN_TEXT} />, text: "Recevez des notifications" },
                { icon: <MapPin size={IconSize.SM} color={Colors.GREEN_TEXT} />, text: "Livraison précise" },
              ]).map((benefit, idx) => (
                <View key={idx} style={styles.benefitCard}>
                  <View style={styles.benefitIcon}>{benefit.icon}</View>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Section des boutons - repositionnée en bas */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLoginPress}
              activeOpacity={0.8}
            >
              <LogIn size={IconSize.MD} color={Colors.WHITE_ICON} />
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleRegisterPress}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Créer un compte</Text>
            </TouchableOpacity>

            {showGuestOption && (
              <TouchableOpacity 
                style={styles.guestButton}
                onPress={handleGuestPress}
                activeOpacity={0.7}
              >
                <Text style={styles.guestButtonText}>Continuer en tant qu'invité</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer repositionné */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              En continuant, vous acceptez nos conditions d'utilisation
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  
  safeArea: {
    flex: 1,
  } as ViewStyle,

  // Header repositionné et simplifié
  header: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.SM,
    zIndex: 1,
  } as ViewStyle,
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.LG,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.LOW,
  } as ViewStyle,

  // Contenu principal centré
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.XL,
  } as ViewStyle,

  // Section des icônes - plus compacte
  iconSection: {
    alignItems: 'center',
    marginBottom: Spacing.XL,
  } as ViewStyle,

  iconContainer: {
    position: 'relative',
  } as ViewStyle,
  
  primaryIcon: {
    width: 100,
    height: 100,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.LG,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.LOW,
  } as ViewStyle,
  
  secondaryIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 44,
    height: 44,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.LG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.LIGHT_GRAY_BG,
    ...Elevation.LOW,
  } as ViewStyle,

  // Section textuelle
  textSection: {
    alignItems: 'center',
    marginBottom: Spacing.XL,
  } as ViewStyle,

  title: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.SM,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
  } as TextStyle,
  
  subtitle: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
    paddingHorizontal: Spacing.SM,
  } as TextStyle,

  // Section des bénéfices - layout en grille
  benefitsSection: {
    marginBottom: Spacing.SM,
  } as ViewStyle,

  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  } as ViewStyle,

  benefitCard: {
    width: '48%',
    backgroundColor: Colors.WHITE,
    padding: Spacing.MD,
    borderRadius: BorderRadius.LG,
    alignItems: 'center',
    marginBottom: Spacing.MD,
    ...Elevation.LOW,
  } as ViewStyle,

  benefitIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.LG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  } as ViewStyle,
  
  benefitText: {
    ...Typography.CAPTION,
    color: Colors.DARK_BLUE_TEXT,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  // Section du bas avec boutons et footer
  bottomSection: {
    paddingHorizontal: Spacing.XL,
    paddingBottom: Spacing.LG,
  } as ViewStyle,

  buttonsContainer: {
    marginBottom: Spacing.LG,
  } as ViewStyle,
  
  loginButton: {
    backgroundColor: Colors.GREEN_BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.LG,
    borderRadius: BorderRadius.LG,
    marginBottom: Spacing.MD,
    ...Elevation.LOW,
  } as ViewStyle,
  
  loginButtonText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
    marginLeft: Spacing.SM,
    fontSize: 16,
    fontWeight: '700',
  } as TextStyle,
  
  registerButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.MD,
    borderColor: Colors.GRAY_TEXT,
    marginBottom: Spacing.SM,
  } as ViewStyle,
  
  registerButtonText: {
    ...Typography.SUBHEAD,
    color: Colors.RED,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  } as TextStyle,
  
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.MD,
    borderWidth: 1,
    borderColor: Colors.GRAY_TEXT,
  } as ViewStyle,
  
  guestButtonText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  } as TextStyle,

  // Footer repositionné
  footer: {
    alignItems: 'center',
  } as ViewStyle,
  
  footerText: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 16,
    fontSize: 12,
  } as TextStyle,
});

export default LoginRequiredScreen;