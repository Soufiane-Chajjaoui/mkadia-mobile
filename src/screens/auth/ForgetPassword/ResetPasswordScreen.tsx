// screens/ForgotPasswordScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from "react-native";
import { Colors, Spacing, BorderRadius, Typography, Elevation } from "../../../constants/DesignSystem";
import { Mail, CheckCircle, Clock } from "lucide-react-native";
import { useToast } from "../../../hooks/useToast";
import { Toast } from "../../../components/Toast";
import { validateEmail } from "../../../utils/validators/emailValidator";
import { forgotPassword$ } from "../../../apis/AuthAPI";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigation";
import { showGlobalSuccess } from "../../../context/ToastContext";

const { height } = Dimensions.get('window');

type StepType = 'email' | 'sent' | 'success';

type ResetPasswordRouteProp = RouteProp<RootStackParamList, "ResetPassword">;


export default function ResetPasswordScreen() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [currentStep, setCurrentStep] = useState<StepType>('email');
    const [countdown, setCountdown] = useState(0);

    const route = useRoute<ResetPasswordRouteProp>();
    const { visible, toast, showSuccess, showError, showInfo, hideToast } = useToast();

    const validateFields = () => {
        setEmailError("");
        
        if (!email.trim()) {
            setEmailError("L'email est requis");
            return false;
        }
        
        if (!validateEmail(email)) {
            setEmailError("Format d'email invalide");
            return false;
        }
        
        return true;
    };

    // ✅ Gestion du countdown pour renvoyer l'email
    const startCountdown = () => {
        setCountdown(60); // 60 secondes
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleForgotPassword = async () => {
        if (!validateFields()) return;

        setIsLoading(true);

        try {
            // ✅ Appel API pour envoyer email de récupération
            forgotPassword$({ email: email.trim(), confirmPassword : "" , newPassword : "" , currentPassword : "" }).subscribe({
                next: (response) => {
                    setCurrentStep('sent');
                    startCountdown();
                    showGlobalSuccess("Email de récupération envoyé avec succès !");
                },
                error: (err: Error) => {
                    console.error("Erreur forgot password:", err.message);
                    
                    // ✅ Gestion des erreurs spécifiques
                    if (err.message.includes('utilisateur introuvable') || err.message.includes('user not found')) {
                        showError("Aucun compte associé à cette adresse email");
                    } else if (err.message.includes('rate limit') || err.message.includes('trop de tentatives')) {
                        showError("Trop de tentatives. Veuillez réessayer dans quelques minutes");
                    } else {
                        showError(err.message || "Erreur lors de l'envoi de l'email");
                    }
                    setIsLoading(false);
                },
                complete: () => {
                    setIsLoading(false);
                },
            });

        } catch (error) {
            console.error("Erreur forgot password:", error);
            showError("Problème de connexion. Vérifiez votre internet.");
            setIsLoading(false);
        }
    };

    const handleResendEmail = () => {
        if (countdown > 0) return;
        
        showInfo("Nouvel email en cours d'envoi...");
        handleForgotPassword();
    };

    const navigateToLogin = () => {
        // TODO: Navigation vers LoginScreen
        console.log("Navigate to Login");
    };

    const navigateBack = () => {
        // TODO: Navigation back
        console.log("Navigate back");
    };

    // ✅ Rendu conditionnel selon l'étape
    const renderContent = () => {
        switch (currentStep) {
            case 'email':
                return (
                    <View style={styles.formContainer}>
                        <View style={styles.iconContainer}>
                            <Mail size={60} color={Colors.DARK_GREEN_BG} />
                        </View>
                        
                        <Text style={styles.title}>Mot de passe oublié ?</Text>
                        <Text style={styles.subtitle}>
                            Pas de souci ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </Text>

                        {/* Champ email */}
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
                                    placeholder="Votre adresse email"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (emailError) setEmailError("");
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                    returnKeyType="send"
                                    onSubmitEditing={handleForgotPassword}
                                />
                            </View>
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        </View>

                        {/* Bouton envoyer */}
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleForgotPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.WHITE_TEXT} size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Envoyer le lien</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );

            case 'sent':
                return (
                    <View style={styles.formContainer}>
                        <View style={styles.iconContainer}>
                            <CheckCircle size={60} color={Colors.DARK_GREEN_BG} />
                        </View>
                        
                        <Text style={styles.title}>Email envoyé !</Text>
                        <Text style={styles.subtitle}>
                            Nous avons envoyé un lien de récupération à{'\n'}
                            <Text style={styles.emailHighlight}>{email}</Text>
                        </Text>

                        <View style={styles.instructionsContainer}>
                            <View style={styles.instructionStep}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>1</Text>
                                </View>
                                <Text style={styles.stepText}>Vérifiez votre boîte email</Text>
                            </View>
                            
                            <View style={styles.instructionStep}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>2</Text>
                                </View>
                                <Text style={styles.stepText}>Cliquez sur le lien de récupération</Text>
                            </View>
                            
                            <View style={styles.instructionStep}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>3</Text>
                                </View>
                                <Text style={styles.stepText}>Créez votre nouveau mot de passe</Text>
                            </View>
                        </View>

                        {/* Note sur les spams */}
                        <View style={styles.warningContainer}>
                            <Clock size={16} color={Colors.DARK_GREEN_BG} />
                            <Text style={styles.warningText}>
                                Si vous ne recevez pas l'email, vérifiez votre dossier spam
                            </Text>
                        </View>

                        {/* Bouton renvoyer */}
                        <TouchableOpacity
                            style={[
                                styles.resendButton,
                                countdown > 0 && styles.resendButtonDisabled
                            ]}
                            onPress={handleResendEmail}
                            disabled={countdown > 0}
                        >
                            <Text style={[
                                styles.resendButtonText,
                                countdown > 0 && styles.resendButtonTextDisabled
                            ]}>
                                {countdown > 0 
                                    ? `Renvoyer l'email (${countdown}s)`
                                    : "Renvoyer l'email"
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
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
                    {/* Contenu dynamique selon l'étape */}
                    {renderContent()}

                    {/* Footer - Retour à la connexion */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Vous vous souvenez de votre mot de passe ? </Text>
                        <TouchableOpacity onPress={navigateToLogin}>
                            <Text style={styles.footerLink}>Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        flexGrow: 1,
        padding: Spacing.XL,
        minHeight: height * 0.9,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.XL,
        paddingTop: Platform.OS === 'ios' ? Spacing.LG : 0,
    },
    backButton: {
        padding: Spacing.SM,
        marginLeft: -Spacing.SM, // Aligner avec le bord
    },
    logo: {
        width: 180,
        height: 120,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.XL,
    },
    title: {
        fontSize: Typography.HEADLINE.fontSize,
        fontWeight: Typography.HEADLINE.fontWeight,
        color: Colors.DARK_BLUE_TEXT,
        textAlign: 'center',
        marginBottom: Spacing.MD,
    },
    subtitle: {
        fontSize: Typography.BODY.fontSize,
        color: Colors.GRAY_TEXT,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.XL,
        paddingHorizontal: Spacing.MD,
    },
    emailHighlight: {
        fontWeight: '600',
        color: Colors.DARK_GREEN_BG,
    },
    inputContainer: {
        width: '100%',
        marginBottom: Spacing.XL,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.GRAY_ICON,
        borderRadius: BorderRadius.MD,
        backgroundColor: Colors.LIGHT_GRAY_BG,
        paddingHorizontal: Spacing.MD,
        height: 56,
    },
    inputError: {
        borderColor: Colors.RED,
        backgroundColor: '#FFF5F5',
    },
    inputFilled: {
        borderColor: Colors.DARK_GREEN_BG,
    },
    inputIcon: {
        marginRight: Spacing.SM,
    },
    input: {
        flex: 1,
        fontSize: Typography.BODY.fontSize,
        color: Colors.DARK_BLUE_TEXT,
        paddingVertical: 0,
    },
    errorText: {
        color: Colors.RED,
        fontSize: 12,
        marginTop: Spacing.XS,
        marginLeft: Spacing.SM,
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.DARK_GREEN_BG,
        borderRadius: BorderRadius.MD,
        justifyContent: "center",
        alignItems: "center",
        ...Elevation.MEDIUM,
    },
    buttonDisabled: {
        backgroundColor: Colors.GRAY_ICON,
    },
    buttonText: {
        color: Colors.WHITE_TEXT,
        fontSize: Typography.SUBHEAD.fontSize,
        fontWeight: Typography.SUBHEAD.fontWeight,
    },
    instructionsContainer: {
        width: '100%',
        marginVertical: Spacing.XL,
    },
    instructionStep: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.LG,
        paddingHorizontal: Spacing.MD,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.DARK_GREEN_BG,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.MD,
    },
    stepNumberText: {
        color: Colors.WHITE,
        fontSize: 14,
        fontWeight: '600',
    },
    stepText: {
        flex: 1,
        fontSize: Typography.BODY.fontSize,
        color: Colors.DARK_GRAY_TEXT,
        lineHeight: 20,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        padding: Spacing.MD,
        borderRadius: BorderRadius.SM,
        marginBottom: Spacing.XL,
        borderLeftWidth: 4,
        borderLeftColor: Colors.GREEN_SHADOW || '#FF9800',
    },
    warningText: {
        flex: 1,
        fontSize: Typography.CAPTION.fontSize,
        color: Colors.DARK_GRAY_TEXT,
        marginLeft: Spacing.SM,
        lineHeight: 18,
    },
    resendButton: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: Colors.DARK_GREEN_BG,
        borderRadius: BorderRadius.MD,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    resendButtonDisabled: {
        borderColor: Colors.GRAY_ICON,
        backgroundColor: Colors.LIGHT_GRAY_BG,
    },
    resendButtonText: {
        color: Colors.DARK_GREEN_BG,
        fontSize: Typography.BODY.fontSize,
        fontWeight: '500',
    },
    resendButtonTextDisabled: {
        color: Colors.GRAY_TEXT,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.XL,
        paddingVertical: Spacing.LG,
    },
    footerText: {
        fontSize: Typography.BODY.fontSize,
        color: Colors.GRAY_TEXT,
    },
    footerLink: {
        fontSize: Typography.BODY.fontSize,
        color: Colors.DARK_GREEN_BG,
        fontWeight: '600',
    },
});