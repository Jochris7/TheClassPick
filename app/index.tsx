import axios, { isAxiosError } from "axios";
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { height } = Dimensions.get("window");

const BASE_URL = "http://192.168.1.8:3000";

interface InputState {
    email: string;
    password: string;
}

export default function Index() {
    const router = useRouter();

    const [inputValue, setInputValue] = useState<InputState>({
        email: '',
        password: ''
    });

    const getInputValue = (keyValue: keyof InputState, valueChange: string) => {
        setInputValue({
            ...inputValue,
            [keyValue]: valueChange
        });
    };

    const handleLogin = async () => {
        if (!inputValue.email || !inputValue.password) {
            Alert.alert('Attention', 'Veuillez entrer votre email et votre mot de passe');
            return;
        }

        try {
            console.log("Tentative de connexion...");
            
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                email: inputValue.email,
                password: inputValue.password
            });

            console.log("Réponse login:", response.data);

            if (response.data && response.data.access_token) {
                // Sauvegarder le token directement (pas de JSON.stringify)
                await SecureStore.setItemAsync("token", response.data.access_token);
                console.log("Token sauvegardé avec succès");
                
                router.push('/(tabs)/home');
            } else {
                Alert.alert("Erreur de connexion", "Réponse API invalide ou token manquant.");
            }
        } catch (err: unknown) {
            console.error("Erreur login:", err);
            
            if (isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || err.message;
                Alert.alert("Erreur de connexion", errorMessage);
            } else if (err instanceof Error) {
                Alert.alert("Erreur de connexion", err.message);
            } else {
                Alert.alert("Erreur", 'Une erreur inconnue est survenue');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <StatusBar barStyle="light-content" backgroundColor="#4285F4" />

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.topSection}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.appNameText}>TheClassPick</Text>
                    <Text style={styles.taglineText}>
                        La plateforme mobile qui permet d'élire un délégué de classe de façon simple et rapide
                    </Text>
                </View>

                <View style={styles.loginCard}>
                    <Text style={styles.cardTitle}>Connexion Utilisateur</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#666"
                        value={inputValue.email}
                        onChangeText={(text) => getInputValue('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor="#666"
                        value={inputValue.password}
                        onChangeText={(text) => getInputValue('password', text)}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>SE CONNECTER</Text>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Pas de compte ? </Text>
                        <TouchableOpacity onPress={() => router.push('/(signup)')}>
                            <Text style={styles.signupLink}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4285F4",
    },
    scrollContent: {
        flexGrow: 1,
    },
    topSection: {
        height: height * 0.4,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    welcomeText: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "300",
        marginBottom: 5,
    },
    appNameText: {
        fontSize: 36,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 20,
    },
    taglineText: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        lineHeight: 24,
    },

    loginCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 30,
        paddingTop: 40,
        alignItems: "center",
        marginBottom: 0,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: "600",
        color: "#333",
        marginBottom: 30,
    },

    input: {
        width: "100%",
        height: 55,
        backgroundColor: "#f0f0f0",
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },

    loginButton: {
        width: "80%",
        height: 50,
        backgroundColor: "#335599",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    signupContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    signupText: {
        color: "#666",
        fontSize: 16,
    },
    signupLink: {
        color: "#335599",
        fontSize: 16,
        fontWeight: "600",
    },
});