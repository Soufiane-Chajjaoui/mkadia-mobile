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
    Dimensions
} from "react-native";
import { useDispatch } from "react-redux";
import { Colors, Spacing, BorderRadius, Typography, Elevation } from "../../../constants/DesignSystem";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { login$ } from "../../../apis/AuthAPI";
import { navigate } from "../../../navigation/NavigationService";
import { Subscription } from "rxjs";
import { loginAsync } from "../../../features/auth/authSlice";
import { AppDispatch } from "../../../features/store";
import { showGlobalError, showGlobalInfo, showGlobalSuccess, useToast } from "../../../context/ToastContext";
const { height, width } = Dimensions.get('window');



export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const subscriptionRef = useRef<Subscription | null>(null);

    const dispatch = useDispatch<AppDispatch>();



    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateFields = () => {
        let isValid = true;
        setEmailError("");
        setPasswordError("");

        if (!email.trim()) {
            setEmailError("L'email est requis");
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError("Format d'email invalide");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Le mot de passe est requis");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = () => {
        if (!validateFields()) return;

        setIsLoading(true);

        subscriptionRef.current = login$({ email, password }).subscribe({
            next: async (data) => {
                const { accessToken, refreshToken } = data.object;
                await dispatch(loginAsync({ accessToken, refreshToken }));
                console.log(data)
                showGlobalSuccess("Connexion réussie ! Bienvenue");
                navigate("Home")
            },
            error: (err: Error) => {
                showGlobalError(err.message || "Identifiants incorrects");
                setIsLoading(false);
            },
            complete: () => {
                setIsLoading(false);
            },
        });
    };

    useEffect(() => {
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, []);


    const handleGoogleAuth = () => {
        showGlobalInfo("Authentification Google en cours de développement");
    };

    const handleForgotPassword = () => {
        navigate("ResetPassword");
    };

    return (
        <>
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
                        <Text style={styles.welcomeText}>Bienvenue !</Text>
                        <Text style={styles.subtitleText}>Connectez-vous à votre compte</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                emailError ? styles.inputError : null,
                                email ? styles.inputFilled : null
                            ]}>
                                <Mail
                                    size={20}
                                    color={emailError ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email ou Username"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (emailError) setEmailError("");
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                />
                            </View>
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                passwordError ? styles.inputError : null,
                                password ? styles.inputFilled : null
                            ]}>
                                <Lock
                                    size={20}
                                    color={passwordError ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mot de passe"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
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
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.WHITE_TEXT} size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Se connecter</Text>
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
                            onPress={handleGoogleAuth}
                            disabled={isLoading}
                        >
                            <Image
                                source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleText}>Continuer avec Google</Text>
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Pas encore de compte ? </Text>
                            <TouchableOpacity onPress={() => navigate("SignUp")}>
                                <Text style={styles.signupLink}>S'inscrire</Text>
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
        minHeight: height * 0.9
    },
    header: {
        alignItems: "center",
        marginBottom: Spacing.XXXL
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
    inputContainer: {
        marginBottom: Spacing.LG
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
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginBottom: Spacing.XL
    },
    forgotPasswordText: {
        color: Colors.DARK_GREEN_BG,
        fontSize: Typography.CAPTION.fontSize,
        fontWeight: "500"
    },
    button: {
        height: 56,
        backgroundColor: Colors.DARK_GREEN_BG,
        borderRadius: BorderRadius.MD,
        justifyContent: "center",
        alignItems: "center",
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
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: Spacing.XL
    },
    signupText: {
        color: Colors.GRAY_TEXT,
        fontSize: Typography.BODY.fontSize
    },
    signupLink: {
        color: Colors.DARK_GREEN_BG,
        fontSize: Typography.BODY.fontSize,
        fontWeight: "600"
    },

    // ✅ Styles pour le Toast
    toastContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: Spacing.MD,
        right: Spacing.MD,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.MD,
        paddingVertical: Spacing.SM,
        borderRadius: BorderRadius.MD,
        zIndex: 9999,
        ...Elevation.HIGH,
    },
    toastText: {
        flex: 1,
        color: 'white',
        fontSize: Typography.BODY.fontSize,
        fontWeight: '500',
        marginLeft: Spacing.SM,
        marginRight: Spacing.SM,
    },
    toastCloseButton: {
        padding: Spacing.XS,
    },
});