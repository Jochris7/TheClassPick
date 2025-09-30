//import BASE_URL from '@/BaseUrl';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import secureLocalStorage from "react-secure-storage";


const { height } = Dimensions.get("window");
const CLASSES = ['Prépa 1', 'Prépa 2', 'Ing 1', 'Ing 2', 'Ing 3'];


const SignUp = () => {

const BASE_URL = "http://192.168.1.3:3000"
const router = useRouter();
 const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  const [inputValue, setInputValue] = useState({
    email : '',
    password: '',
    username:'',
    userClass:''
  })

  const getInputValue = (keyValue : string,valueChange:string)=>{
      setInputValue({
        ...inputValue,
        [keyValue]: valueChange
      })
  }

  const handleSignUp = async () =>{
    if(!inputValue.email || !inputValue.password || !inputValue.username){
        Alert.alert('Veuillez entrer votre mot de passe ou votre email ou username')
        return
    }

    try{

      const response = await axios.post(`${BASE_URL}/auth/register`,{
        "email":inputValue.email,
        "password":inputValue.password,
        "username":inputValue.username,
        "class":inputValue.userClass
      },
      { headers:{
          'Content-Type': 'application/json'
        }
      }
  )

     if(response.data && response.data.access_token){
        console.log(" token : ",response.data.access_token)
        secureLocalStorage.setItem("token",response.data.access_token)
        router.push('/(tabs)/home')
     }
    }catch(err){
      console.log("erreur lors de l'inscription : ", (err as any))
    }
  }
  

  return (
    <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#4285F4" />
    
          {/* Partie Bleue Supérieure */}
          <View style={styles.topSection}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appNameText}>TheClassPick</Text>
            <Text style={styles.taglineText}>
              La plateforme mobile qui permet d'élire un délégué de classe de façon
              simple et rapide
            </Text>
          </View>
    
          <View style={styles.loginCard}>
            {/* Changement : Titre en français pour cohérence */}
            <Text style={styles.cardTitle}>Inscription Utilisateur</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#666"
              value={inputValue.username}
              onChangeText={(text:string)=>getInputValue('username',text)}
              
            />
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor="#666"
              value={inputValue.email}
              onChangeText={(text:string)=>getInputValue('email',text)}
            />
             <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              >
                <Text style={{ color: inputValue.userClass ? '#000' : '#666' }}>
                  {inputValue.userClass || "Sélectionner une classe..."}
                </Text>
                <Ionicons
                  name={isClassDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              
              {isClassDropdownOpen && (
                <View style={styles.dropdownContainer}>
                  {CLASSES.map((classe, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        getInputValue('userClass', classe);
                        setIsClassDropdownOpen(false);
                      }}
                    >
                      <Text>{classe}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
        )}
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#666"
              value={inputValue.password}
              onChangeText={(text:string)=>getInputValue('password',text)}
              secureTextEntry
            />
            
    
            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp} >
              <Text style={styles.loginButtonText}>S'INSCRIRE</Text>
            </TouchableOpacity>
    
          </View>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4285F4",
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
  dropdownButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});