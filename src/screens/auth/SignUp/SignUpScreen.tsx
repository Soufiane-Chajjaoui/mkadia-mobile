// screens/SignupScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { Colors, Spacing, BorderRadius, Typography, Elevation } from "../../../constants/DesignSystem";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react-native";
import { signup$ } from "../../../apis/AuthAPI";
import { loginSuccess } from "../../../features/auth/authSlice";
import { useToast } from "../../../hooks/useToast";
import { Toast } from "../../../components/Toast";
import { navigate } from "../../../navigation/NavigationService";
import { SignupRequest } from "../../../types/SignUpRequest";
import { validateSignupFields } from "../../../utils/validators/signupValidator";
import { Subscription } from "rxjs";

const { height } = Dimensions.get('window');
export interface SignupFormData extends SignupRequest {
  confirmPassword: string;
}


export default function SignupScreen() {
    const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const subscriptionRef = useRef<Subscription | null>(null);

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        terms: "",
    });

    const dispatch = useDispatch();
    const { toast, visible, showSuccess, showError, showInfo, showWarning, hideToast } = useToast();

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error on type
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleSignup = async () => {
        const { isValid, errors: validationErrors } = validateSignupFields(formData, acceptTerms);

        if (!isValid) {
            setErrors(validationErrors);
            showWarning("Veuillez corriger les erreurs dans le formulaire");
            return;
        }

        setIsLoading(true);

        try {
            // Préparer les données pour l'API
            const signupData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.replace(/\s/g, ''),
                password: formData.password,
            };

            // Appel API d'inscription
            subscriptionRef.current = signup$(signupData).subscribe({
                next: (data) => {
                    dispatch(
                        loginSuccess({
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                        })
                    );
                    showSuccess(`Bienvenue ${formData.lastName} ! Compte créé avec succès`);
                    navigateToLogin();
                },
                error: (err: Error) => {
                    console.error("Erreur inscription:", err.message);
                    showError(err.message || "Erreur lors de la création du compte");
                    setIsLoading(false);
                },
                complete: () => {
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error("Erreur signup:", error);
            showError("Problème de connexion. Vérifiez votre internet.");
            setIsLoading(false);
        }
    };

    // ✅ cleanup automatique quand le composant est démonté
    useEffect(() => {
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, []);

    const handleGoogleSignup = () => {
        showWarning("Inscription Google en cours de développement");
    };

    const navigateToLogin = () => {
        navigate("Login")
    };

    return (
        <>
            {/* Toast Component */}
            <Toast
                visible={visible}
                toast={toast}
                onHide={hideToast}
            />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Image
                            source={require("../../../../assets/images/logo-with-border.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.welcomeText}>Créer un compte</Text>
                        <Text style={styles.subtitleText}>Rejoignez-nous dès maintenant</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Ligne Prénom + Nom */}
                        <View style={styles.rowContainer}>
                            <View style={[styles.inputContainer, styles.halfWidth]}>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.firstName ? styles.inputError : null,
                                    formData.firstName ? styles.inputFilled : null
                                ]}>
                                    <User
                                        size={20}
                                        color={errors.firstName ? Colors.RED : Colors.GRAY_ICON}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Prénom"
                                        placeholderTextColor={Colors.GRAY_TEXT}
                                        value={formData.firstName}
                                        onChangeText={(text) => handleInputChange('firstName', text)}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                    />
                                </View>
                                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
                            </View>

                            <View style={[styles.inputContainer, styles.halfWidth]}>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.lastName ? styles.inputError : null,
                                    formData.lastName ? styles.inputFilled : null
                                ]}>
                                    <User
                                        size={20}
                                        color={errors.lastName ? Colors.RED : Colors.GRAY_ICON}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nom"
                                        placeholderTextColor={Colors.GRAY_TEXT}
                                        value={formData.lastName}
                                        onChangeText={(text) => handleInputChange('lastName', text)}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                    />
                                </View>
                                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                errors.email ? styles.inputError : null,
                                formData.email ? styles.inputFilled : null
                            ]}>
                                <Mail
                                    size={20}
                                    color={errors.email ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Adresse email"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    value={formData.email}
                                    onChangeText={(text) => handleInputChange('email', text)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                />
                            </View>
                            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                        </View>

                        {/* Téléphone */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                errors.phone ? styles.inputError : null,
                                formData.phone ? styles.inputFilled : null
                            ]}>
                                <Phone
                                    size={20}
                                    color={errors.phone ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Numéro de téléphone"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    value={formData.phone}
                                    onChangeText={(text) => handleInputChange('phone', text)}
                                    keyboardType="phone-pad"
                                    returnKeyType="next"
                                />
                            </View>
                            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                        </View>

                        {/* Mot de passe */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                errors.password ? styles.inputError : null,
                                formData.password ? styles.inputFilled : null
                            ]}>
                                <Lock
                                    size={20}
                                    color={errors.password ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mot de passe"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    secureTextEntry={!showPassword}
                                    value={formData.password}
                                    onChangeText={(text) => handleInputChange('password', text)}
                                    returnKeyType="next"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color={Colors.GRAY_ICON} />
                                    ) : (
                                        <Eye size={20} color={Colors.GRAY_ICON} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        </View>

                        {/* Confirmer mot de passe */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                errors.confirmPassword ? styles.inputError : null,
                                formData.confirmPassword ? styles.inputFilled : null
                            ]}>
                                <Lock
                                    size={20}
                                    color={errors.confirmPassword ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirmer le mot de passe"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    secureTextEntry={!showConfirmPassword}
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                                    returnKeyType="done"
                                    onSubmitEditing={handleSignup}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color={Colors.GRAY_ICON} />
                                    ) : (
                                        <Eye size={20} color={Colors.GRAY_ICON} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
                        </View>

                        {/* Checkbox Termes et conditions */}
                        <TouchableOpacity 
                            style={styles.checkboxContainer}
                            onPress={() => {
                                setAcceptTerms(!acceptTerms);
                                if (errors.terms) {
                                    setErrors(prev => ({ ...prev, terms: "" }));
                                }
                            }}
                        >
                            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                                {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxText}>
                                J'accepte les <Text style={styles.linkText}>termes et conditions</Text> et la{' '}
                                <Text style={styles.linkText}>politique de confidentialité</Text>
                            </Text>
                        </TouchableOpacity>
                        {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

                        {/* Bouton inscription */}
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.WHITE_TEXT} size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Créer mon compte</Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>ou</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Google */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={handleGoogleSignup}
                            disabled={isLoading}
                        >
                            <Image
                                source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleText}>S'inscrire avec Google</Text>
                        </TouchableOpacity>

                        {/* Lien vers connexion */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Déjà un compte ? </Text>
                            <TouchableOpacity onPress={navigateToLogin}>
                                <Text style={styles.loginLink}>Se connecter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.XL,
        minHeight: height * 0.95,
    },
    header: {
        alignItems: "center",
        marginBottom: Spacing.XL
    },
    logo: {
        width: 300,
        height: 120,
        marginBottom: Spacing.XXS
    },
    welcomeText: {
        fontSize: Typography.HEADLINE.fontSize,
        fontWeight: Typography.HEADLINE.fontWeight,
        color: Colors.DARK_BLUE_TEXT,
        marginBottom: Spacing.SM
    },
    subtitleText: {
        fontSize: Typography.BODY.fontSize,
        color: Colors.GRAY_TEXT,
        textAlign: "center"
    },
    formContainer: {
        width: "100%"
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    inputContainer: {
        marginBottom: Spacing.LG
    },
    halfWidth: {
        width: "48%"
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.GRAY_ICON,
        borderRadius: BorderRadius.MD,
        backgroundColor: Colors.LIGHT_GRAY_BG,
        paddingHorizontal: Spacing.MD,
        height: 56
    },
    inputError: {
        borderColor: Colors.RED,
        backgroundColor: '#FFF5F5'
    },
    inputFilled: {
        borderColor: Colors.DARK_GREEN_BG
    },
    inputIcon: {
        marginRight: Spacing.SM
    },
    input: {
        flex: 1,
        fontSize: Typography.BODY.fontSize,
        color: Colors.DARK_BLUE_TEXT,
        paddingVertical: 0
    },
    eyeIcon: {
        padding: Spacing.XS
    },
    errorText: {
        color: Colors.RED,
        fontSize: 12,
        marginTop: Spacing.XS,
        marginLeft: Spacing.SM
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: Spacing.LG
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: Colors.GRAY_ICON,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginRight: Spacing.SM,
        marginTop: 2
    },
    checkboxChecked: {
        backgroundColor: Colors.DARK_GREEN_BG,
        borderColor: Colors.DARK_GREEN_BG
    },
    checkmark: {
        color: Colors.WHITE,
        fontSize: 12,
        fontWeight: "bold"
    },
    checkboxText: {
        flex: 1,
        fontSize: Typography.CAPTION.fontSize,
        color: Colors.DARK_GRAY_TEXT,
        lineHeight: 18
    },
    linkText: {
        color: Colors.DARK_GREEN_BG,
        textDecorationLine: "underline"
    },
    button: {
        height: 56,
        backgroundColor: Colors.DARK_GREEN_BG,
        borderRadius: BorderRadius.MD,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Spacing.SM,
        ...Elevation.MEDIUM
    },
    buttonDisabled: {
        backgroundColor: Colors.GRAY_ICON
    },
    buttonText: {
        color: Colors.WHITE_TEXT,
        fontSize: Typography.SUBHEAD.fontSize,
        fontWeight: Typography.SUBHEAD.fontWeight
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: Spacing.XL
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.GRAY_ICON
    },
    dividerText: {
        marginHorizontal: Spacing.MD,
        color: Colors.GRAY_TEXT,
        fontSize: Typography.CAPTION.fontSize
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 56,
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.GRAY_ICON,
        borderRadius: BorderRadius.MD,
        ...Elevation.LOW
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: Spacing.SM
    },
    googleText: {
        color: Colors.DARK_GRAY_TEXT,
        fontSize: Typography.BODY.fontSize,
        fontWeight: "500"
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: Spacing.XL
    },
    loginText: {
        color: Colors.GRAY_TEXT,
        fontSize: Typography.BODY.fontSize
    },
    loginLink: {
        color: Colors.DARK_GREEN_BG,
        fontSize: Typography.BODY.fontSize,
        fontWeight: "600"
    },
});