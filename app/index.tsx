import BASE_URL from '@/BaseUrl';
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

// Définition du type pour l'état du formulaire
interface InputState {
  email: string;
  password: string;
}

export default function Index() {
  const router = useRouter();

  // Utilisation du type InputState
  const [inputValue, setInputValue] = useState<InputState>({
    email: '',
    password: ''
  })

  // Typage explicite des paramètres : keyValue est la clé de l'objet (email ou password) et valueChange est la nouvelle valeur (string).
  const getInputValue = (keyValue: keyof InputState, valueChange: string) => {
    setInputValue({
      ...inputValue,
      [keyValue]: valueChange
    })
  }

  const handleLogin = async () => {
    if (!inputValue.email || !inputValue.password) {
      Alert.alert('Veuillez entrer votre mot de passe ou votre email')
      return
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        "email": inputValue.email,
        "password": inputValue.password
      })

      if (response.data && response.data.access_token) {
        console.log(" token : ", response.data)
        await SecureStore.setItemAsync("token", response.data.access_token)
        router.push('/(tabs)/home')
      }
    } catch (err: unknown) {
      if (isAxiosError(err))  {
        console.log("erreur lors de la connexion : ", err.message)
      } else if (err instanceof Error) {
        console.log("erreur lors de la connexion : ", err.message)
      } else {
        console.log("erreur lors de la connexion : une erreur inconnue est survenue")
      }
    }
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4285F4" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Partie Bleue Supérieure */}
        <View style={styles.topSection}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appNameText}>TheClassPick</Text>
          <Text style={styles.taglineText}> La plateforme mobile qui permet d'élire un délégué de classe de façon simple et rapide </Text>
        </View>

        <View style={styles.loginCard}>
          {/* Changement : Titre en français pour cohérence */}
          <Text style={styles.cardTitle}>Connexion Utilisateur</Text>

          <TextInput
            style={styles.input}
            placeholder="email"
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
            <Text style={styles.loginButtonText}>SE CONNECTER</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/(signup)')}  >
              <Text style={styles.signupLink} > S'inscrire </Text >
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