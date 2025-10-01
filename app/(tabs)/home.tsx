import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BASE_URL = 'http://192.168.1.10:3000';

interface JwtPayload {
    _id: string;
    username: string;
    email: string;
    class: string;
    candidate: boolean;
    voted: boolean;
    iat: number;
    exp: number;
}

const HomeScreen = () => {
    const router = useRouter();

    const [isDelegate, setIsDelegate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        checkCandidateStatus();
    }, []);

    const checkCandidateStatus = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");

            if (!token) {
                console.log("Aucun token trouvé");
                setIsLoading(false);
                return;
            }

            // Décoder le JWT pour récupérer les infos utilisateur
            const decoded = jwtDecode<JwtPayload>(token);
            console.log("Token décodé:", decoded);
            
            setUsername(decoded.username);
            setIsDelegate(decoded.candidate || false);

        } catch (error) {
            console.error("Erreur checkCandidateStatus:", error);
            if (error instanceof Error && error.message.includes('expired')) {
                Alert.alert("Session expirée", "Veuillez vous reconnecter");
                await SecureStore.deleteItemAsync("token");
                router.push('/');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        setIsApplying(true);

        try {
            const token = await SecureStore.getItemAsync("token");

            if (!token) {
                Alert.alert("Erreur", "Veuillez vous reconnecter pour postuler.");
                router.push('/');
                return;
            }

            console.log("Appel API pour devenir candidat");

            // La route est POST / avec authMiddleware
            const response = await axios.post(
                `${BASE_URL}/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("Réponse devenir candidat:", response.data);

            if (response.status === 200) {
                Alert.alert("Succès !", response.data.message || "Votre candidature est enregistrée !");
                
                // Mettre à jour le token avec les nouvelles infos
                if (response.data.user) {
                    setIsDelegate(true);
                }
                
                // Optionnel: rafraîchir le token si le backend en renvoie un nouveau
                // Sinon, on recharge juste le statut
                await checkCandidateStatus();
            }

        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.error("Erreur devenir candidat:", err.response?.status, err.response?.data);
                const errorMessage = err.response?.data?.message || "Échec de la candidature.";
                Alert.alert('Échec', errorMessage);
            } else {
                console.error("Erreur inconnue:", err);
                Alert.alert('Erreur', 'Une erreur inconnue est survenue lors de la postulation.');
            }
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#4287f5" />
                <Text style={{ marginTop: 10, color: '#333' }}>Chargement du statut...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#4287f5" />
            <View style={styles.mainContent}>

                {isDelegate ? (
                    <View style={styles.statusContainerAccepted}>
                        <View style={styles.statusBorder} />
                        <View>
                            <Text style={styles.sectionTitle}>Statut de Candidature</Text>
                            <View style={styles.statusContent}>
                                <MaterialIcons name="check-circle" size={24} color="#2ECC71" style={styles.statusIcon} />
                                <View>
                                    <Text style={styles.statusTextAccepted}>Candidature Acceptée</Text>
                                    <Text style={styles.statusSubtitle}>Vous pouvez créer des posts de campagne</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Statut de Candidature</Text>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleApply}
                            disabled={isApplying}
                        >
                            {isApplying ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    Postuler comme Délégué
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.cardsRow}>
                    <TouchableOpacity style={styles.card} onPress={() => router.push('/feed')}>
                        <MaterialIcons name="article" size={30} color="#333" />
                        <Text style={styles.cardTitle}>Fil de Campagne</Text>
                        <Text style={styles.cardSubtitle}>Voir les posts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => router.push('/results')}>
                        <MaterialIcons name="trending-up" size={30} color="#2ECC71" />
                        <Text style={styles.cardTitle}>Résultats</Text>
                        <Text style={styles.cardSubtitle}>Voir les votes</Text>
                    </TouchableOpacity>
                </View>

                {isDelegate && (
                    <TouchableOpacity
                        style={styles.candidateSpace}
                        onPress={() => router.push('/profile')}
                    >
                        <MaterialIcons name="group" size={30} color="#fff" />
                        <View>
                            <Text style={styles.candidateSpaceTitle}>Espace Candidat</Text>
                            <Text style={styles.candidateSpaceSubtitle}>Gérer mes posts de campagne</Text>
                        </View>
                    </TouchableOpacity>
                )}

            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    mainContent: {
        flex: 1,
        padding: 20,
    },

    sectionContainer: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    primaryButton: {
        backgroundColor: '#4287f5',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    statusContainerAccepted: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statusBorder: {
        width: 5,
        backgroundColor: '#2ECC71',
        marginRight: 10,
        borderRadius: 2,
    },
    statusContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        marginRight: 10,
    },
    statusTextAccepted: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2ECC71',
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#555',
    },

    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        width: (width - 60) / 2,
        height: 120,
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#777',
    },

    candidateSpace: {
        backgroundColor: '#9B59B6',
        borderRadius: 10,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    candidateSpaceTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    candidateSpaceSubtitle: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 15,
        opacity: 0.8,
    },
});