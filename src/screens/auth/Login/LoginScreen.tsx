// screens/LoginScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    Animated,
} from "react-native";
import { useDispatch } from "react-redux";
import { Colors, Spacing, BorderRadius, Typography, Elevation } from "../../../constants/DesignSystem";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, X } from "lucide-react-native";
import { login$ } from "../../../apis/AuthAPI";
import { loginSuccess } from "../../../features/auth/authSlice";

const { height, width } = Dimensions.get('window');

// ✅ Types pour le Toast
type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    visible: boolean;
    onHide: () => void;
}

// ✅ Composant Toast
const Toast = ({ message, type, visible, onHide }: ToastProps) => {
    const [slideAnim] = useState(new Animated.Value(-100));

    React.useEffect(() => {
        if (visible) {
            // Slide down
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // Stay visible
                Animated.delay(3000),
                // Slide up
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onHide();
            });
        }
    }, [visible, slideAnim, onHide]);

    if (!visible) return null;

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '#10B981',
                    icon: <CheckCircle size={20} color="white" />,
                };
            case 'error':
                return {
                    backgroundColor: '#EF4444',
                    icon: <AlertCircle size={20} color="white" />,
                };
            default:
                return {
                    backgroundColor: '#3B82F6',
                    icon: <AlertCircle size={20} color="white" />,
                };
        }
    };

    const { backgroundColor, icon } = getToastConfig();

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                { backgroundColor, transform: [{ translateY: slideAnim }] },
            ]}
        >
            {icon}
            <Text style={styles.toastText} numberOfLines={2}>
                {message}
            </Text>
            <TouchableOpacity onPress={onHide} style={styles.toastCloseButton}>
                <X size={18} color="white" />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const dispatch = useDispatch();

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
    };
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
        width: 120,
        height: 120,
        marginBottom: Spacing.LG
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