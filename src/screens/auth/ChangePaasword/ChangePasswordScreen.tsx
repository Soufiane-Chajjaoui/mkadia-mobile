// screens/ChangePasswordScreen.tsx
import React, { useEffect, useState } from "react";
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
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react-native";
import { validatePassword } from "../../../utils/validators/passwordValidator";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Toast } from "../../../components/Toast";
import { Colors, Spacing, Typography, BorderRadius, Elevation } from "../../../constants/DesignSystem";
import { useToast } from "../../../hooks/useToast";
import { RootStackParamList } from "../../../types/navigation";
import { changePassword$ } from "../../../apis/AuthAPI";
import { navigate } from "../../../navigation/NavigationService";

const { height } = Dimensions.get('window');

type StepType = 'form' | 'success';

type ChangePasswordRouteProp = RouteProp<RootStackParamList, "ChangePassword">;

export default function ChangePasswordScreen() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [currentStep, setCurrentStep] = useState<StepType>('form');

    const route = useRoute<ChangePasswordRouteProp>();
    const { email } = route.params || {};
    const { visible, toast, showSuccess, showError, hideToast } = useToast();

    const validateFields = () => {
        setNewPasswordError("");
        setConfirmPasswordError("");
        let isValid = true;
        
        // Validation nouveau mot de passe
        if (!newPassword.trim()) {
            setNewPasswordError("Le nouveau mot de passe est requis");
            isValid = false;
        } else if (!validatePassword(newPassword)) {
            setNewPasswordError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre");
            isValid = false;
        }
        
        // Validation confirmation
        if (!confirmPassword.trim()) {
            setConfirmPasswordError("La confirmation est requise");
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Les mots de passe ne correspondent pas");
            isValid = false;
        }
        
        return isValid;
    };

    const handleChangePassword = async () => {
        if (!validateFields()) return;

        setIsLoading(true);

        try {
            // ✅ Appel API pour changer le mot de passe
            changePassword$({
                email: email!, 
                newPassword: newPassword.trim(),
                confirmPassword: confirmPassword.trim(),
                currentPassword: "",
            }).subscribe({
                next: (response) => {
                    setCurrentStep('success');
                    showSuccess("Mot de passe modifié avec succès !");
                },
                error: (err: Error) => {
                    console.error("Erreur change password:", err.message);
                    
                    // ✅ Gestion des erreurs spécifiques
                    if (err.message.includes('token invalide') || err.message.includes('expired')) {
                        showError("Le lien de récupération a expiré. Veuillez redemander un nouveau lien");
                    } else if (err.message.includes('mot de passe trop faible')) {
                        showError("Le mot de passe ne respecte pas les critères de sécurité");
                    } else {
                        showError(err.message || "Erreur lors de la modification du mot de passe");
                    }
                    setIsLoading(false);
                },
                complete: () => {
                    setIsLoading(false);
                },
            });

        } catch (error) {
            console.error("Erreur change password:", error);
            showError("Problème de connexion. Vérifiez votre internet.");
            setIsLoading(false);
        }
    };

    const navigateToLogin = () => {
        navigate("Login");
    };

    const navigateBack = () => {
        // TODO: Navigation back
        console.log("Navigate back");
    };

    // ✅ Rendu conditionnel selon l'étape
    const renderContent = () => {
        switch (currentStep) {
            case 'form':
                return (
                    <View style={styles.formContainer}>
                        <View style={styles.iconContainer}>
                            <Lock size={60} color={Colors.DARK_GREEN_BG} />
                        </View>
                        
                        <Text style={styles.title}>Nouveau mot de passe {email}</Text>
                        <Text style={styles.subtitle}>
                            Créez votre nouveau mot de passe sécurisé. Assurez-vous qu'il soit unique et difficile à deviner.
                        </Text>

                        {/* Champ nouveau mot de passe */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                newPasswordError ? styles.inputError : null,
                                newPassword ? styles.inputFilled : null
                            ]}>
                                <Lock
                                    size={20}
                                    color={newPasswordError ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nouveau mot de passe"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        if (newPasswordError) setNewPasswordError("");
                                    }}
                                    secureTextEntry={!showNewPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={20} color={Colors.GRAY_ICON} />
                                    ) : (
                                        <Eye size={20} color={Colors.GRAY_ICON} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
                        </View>

                        {/* Champ confirmation mot de passe */}
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.inputWrapper,
                                confirmPasswordError ? styles.inputError : null,
                                confirmPassword ? styles.inputFilled : null
                            ]}>
                                <Lock
                                    size={20}
                                    color={confirmPasswordError ? Colors.RED : Colors.GRAY_ICON}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirmer le mot de passe"
                                    placeholderTextColor={Colors.GRAY_TEXT}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (confirmPasswordError) setConfirmPasswordError("");
                                    }}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    onSubmitEditing={handleChangePassword}
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
                            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                        </View>

                        {/* Critères de sécurité */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.criteriaTitle}>Le mot de passe doit contenir :</Text>
                            <View style={styles.criteriaItem}>
                                <CheckCircle 
                                    size={16} 
                                    color={newPassword.length >= 8 ? Colors.DARK_GREEN_BG : Colors.GRAY_ICON} 
                                />
                                <Text style={[
                                    styles.criteriaText,
                                    newPassword.length >= 8 && styles.criteriaTextValid
                                ]}>
                                    Au moins 8 caractères
                                </Text>
                            </View>
                            <View style={styles.criteriaItem}>
                                <CheckCircle 
                                    size={16} 
                                    color={/[A-Z]/.test(newPassword) ? Colors.DARK_GREEN_BG : Colors.GRAY_ICON} 
                                />
                                <Text style={[
                                    styles.criteriaText,
                                    /[A-Z]/.test(newPassword) && styles.criteriaTextValid
                                ]}>
                                    Une lettre majuscule
                                </Text>
                            </View>
                            <View style={styles.criteriaItem}>
                                <CheckCircle 
                                    size={16} 
                                    color={/[a-z]/.test(newPassword) ? Colors.DARK_GREEN_BG : Colors.GRAY_ICON} 
                                />
                                <Text style={[
                                    styles.criteriaText,
                                    /[a-z]/.test(newPassword) && styles.criteriaTextValid
                                ]}>
                                    Une lettre minuscule
                                </Text>
                            </View>
                            <View style={styles.criteriaItem}>
                                <CheckCircle 
                                    size={16} 
                                    color={/[0-9]/.test(newPassword) ? Colors.DARK_GREEN_BG : Colors.GRAY_ICON} 
                                />
                                <Text style={[
                                    styles.criteriaText,
                                    /[0-9]/.test(newPassword) && styles.criteriaTextValid
                                ]}>
                                    Un chiffre
                                </Text>
                            </View>
                        </View>

                        {/* Bouton modifier */}
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleChangePassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.WHITE_TEXT} size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Modifier le mot de passe</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );

            case 'success':
                return (
                    <View style={styles.formContainer}>
                        <View style={styles.iconContainer}>
                            <CheckCircle size={60} color={Colors.DARK_GREEN_BG} />
                        </View>
                        
                        <Text style={styles.title}>Mot de passe modifié !</Text>
                        <Text style={styles.subtitle}>
                            Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                        </Text>

                        {/* Bouton se connecter */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateToLogin}
                        >
                            <Text style={styles.buttonText}>Se connecter</Text>
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
                {/* Header avec bouton retour (uniquement sur l'étape form) */}
                {currentStep === 'form' && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
                            <ArrowLeft size={24} color={Colors.DARK_BLUE_TEXT} />
                        </TouchableOpacity>
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Contenu dynamique selon l'étape */}
                    {renderContent()}
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
    header: {
        paddingHorizontal: Spacing.XL,
        paddingTop: Platform.OS === 'ios' ? Spacing.XL : Spacing.LG,
        paddingBottom: Spacing.MD,
    },
    backButton: {
        padding: Spacing.SM,
        marginLeft: -Spacing.SM,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: Spacing.XL,
        minHeight: height * 0.8,
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
        backgroundColor: Colors.LIGHT_GRAY_BG || '#F0F9FF',
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
    inputContainer: {
        width: '100%',
        marginBottom: Spacing.LG,
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
    eyeIcon: {
        padding: Spacing.XS,
    },
    errorText: {
        color: Colors.RED,
        fontSize: 12,
        marginTop: Spacing.XS,
        marginLeft: Spacing.SM,
    },
    criteriaContainer: {
        width: '100%',
        backgroundColor: Colors.LIGHT_GRAY_BG || '#F8F9FA',
        padding: Spacing.MD,
        borderRadius: BorderRadius.SM,
        marginBottom: Spacing.XL,
    },
    criteriaTitle: {
        fontSize: Typography.SUBHEAD.fontSize,
        fontWeight: '600',
        color: Colors.DARK_BLUE_TEXT,
        marginBottom: Spacing.SM,
    },
    criteriaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.XS,
    },
    criteriaText: {
        fontSize: Typography.CAPTION.fontSize,
        color: Colors.GRAY_TEXT,
        marginLeft: Spacing.SM,
    },
    criteriaTextValid: {
        color: Colors.DARK_GREEN_BG,
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
});