import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = 'http://192.168.1.10:3000';

interface JwtPayload {
    _id: string;
    username: string;
    email: string;
    class: string;
    candidate: boolean;
    voted: boolean;
}

type Campaign = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    candidate: string;
};

const ProfileScreen = () => {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        loadUserInfoAndCampaigns();
    }, []);

    const loadUserInfoAndCampaigns = async () => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync("token");
            
            if (!token) {
                Alert.alert("Erreur", "Veuillez vous reconnecter");
                router.push('/');
                return;
            }

            // Décoder le JWT pour avoir les infos utilisateur
            const decoded = jwtDecode<JwtPayload>(token);
            setUsername(decoded.username);
            setUserEmail(decoded.email);

            // Récupérer les campagnes de l'utilisateur
            await fetchUserCampaigns(decoded.username, token);
            
        } catch (error) {
            console.error("Erreur chargement profil:", error);
            Alert.alert("Erreur", "Impossible de charger votre profil");
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchUserCampaigns = async (candidateUsername: string, token: string) => {
        try {
            // GET /campaigns/:usernameCandidate
            const response = await axios.get(
                `${BASE_URL}/campaigns/${candidateUsername}`, 
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            console.log("Réponse campaigns:", response.data);

            // Le backend renvoie { campaign: {...} } pour un seul post
            if (response.data && response.data.campaign) {
                setCampaigns([response.data.campaign]);
            } else {
                setCampaigns([]);
            }
            
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 404) {
                // Aucune campagne trouvée, c'est normal
                setCampaigns([]);
            } else {
                console.error("Erreur fetch campaigns:", error);
            }
        }
    };

    const handleCreateCampaign = async () => {
        if (!newTitle.trim() || !newDescription.trim()) {
            Alert.alert("Attention", "Veuillez remplir le titre et la description");
            return;
        }
        
        setIsPosting(true);
        
        try {
            const token = await SecureStore.getItemAsync("token");
            
            if (!token) {
                Alert.alert("Erreur", "Veuillez vous reconnecter");
                router.push('/');
                return;
            }
            
            // POST /campaigns avec { title, description }
            const response = await axios.post(
                `${BASE_URL}/campaigns`, 
                { 
                    title: newTitle.trim(),
                    description: newDescription.trim()
                }, 
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Réponse création campagne:", response.data);

            if (response.status === 201 && response.data.campaign) {
                Alert.alert("Succès", "Campagne créée avec succès !");
                setCampaigns([response.data.campaign, ...campaigns]);
                setNewTitle('');
                setNewDescription('');
                setIsFormVisible(false);
                Keyboard.dismiss();
            }

        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.error("Erreur création campagne:", err.response?.data);
                const errorMessage = err.response?.data?.message || "Erreur lors de la création.";
                Alert.alert('Échec', errorMessage);
            } else {
                console.error("Erreur inconnue:", err);
                Alert.alert('Erreur', 'Une erreur inconnue est survenue.');
            }
        } finally {
            setIsPosting(false);
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("token");
        Alert.alert("Déconnexion", "Vous êtes déconnecté.");
        router.push('/');
    };

    const renderCampaignForm = () => (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Créer une nouvelle campagne</Text>
            
            <TextInput
                style={styles.titleInput}
                placeholder="Titre de la campagne"
                value={newTitle}
                onChangeText={setNewTitle}
            />
            
            <TextInput
                style={styles.descriptionInput}
                placeholder="Description de votre campagne..."
                multiline
                numberOfLines={4}
                value={newDescription}
                onChangeText={setNewDescription}
            />
            
            <View style={styles.formButtonRow}>
                <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => {
                        setIsFormVisible(false);
                        setNewTitle('');
                        setNewDescription('');
                        Keyboard.dismiss();
                    }}
                >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styles.formButton, 
                        styles.sendButton, 
                        (!newTitle.trim() || !newDescription.trim() || isPosting) && styles.disabledButton
                    ]}
                    onPress={handleCreateCampaign}
                    disabled={!newTitle.trim() || !newDescription.trim() || isPosting}
                >
                    {isPosting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.sendButtonText}>Créer</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
    
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#004488" />
                <Text style={{ marginTop: 10, color: '#333' }}>Chargement...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.profileHeaderContainer}>
                    <View>
                        <Text style={styles.profileTitle}>Hey, {username} 👋</Text>
                        <Text style={styles.profileSubtitle}>{userEmail}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <MaterialIcons name="logout" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => {
                        setIsFormVisible(true);
                        setNewTitle('');
                        setNewDescription('');
                    }}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                    <Text style={styles.createButtonText}>Créer une campagne</Text>
                </TouchableOpacity>

                {isFormVisible && renderCampaignForm()}
                
                <Text style={styles.sectionTitle}>Mes campagnes</Text>

                {campaigns.length === 0 ? (
                    <Text style={styles.noDataText}>
                        Aucune campagne trouvée. Créez votre première campagne !
                    </Text>
                ) : (
                    campaigns.map(campaign => (
                        <View key={campaign._id} style={styles.campaignCard}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="campaign" size={24} color="#004488" />
                                <View style={styles.cardHeaderText}>
                                    <Text style={styles.campaignTitle}>{campaign.title}</Text>
                                    <Text style={styles.campaignDate}>
                                        {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}
                                    </Text>
                                </View>
                            </View>
                            
                            <Text style={styles.campaignDescription}>
                                {campaign.description}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    scrollContent: {
        padding: 20,
    },
    
    profileHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    logoutButton: {
        padding: 8,
    },
    
    createButton: {
        flexDirection: 'row',
        backgroundColor: '#004488',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    
    campaignCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardHeaderText: {
        marginLeft: 10,
        flex: 1,
    },
    campaignTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    campaignDate: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    campaignDescription: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    
    formContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    formButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    formButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    sendButton: {
        backgroundColor: '#2ECC71',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#a9e1be',
    },
});