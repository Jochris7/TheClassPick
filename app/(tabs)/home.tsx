import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
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

const BASE_URL = 'http://192.168.252.148:3000'; 

const HomeScreen = () => {
    
    const router = useRouter();
    
    const [isDelegate, setIsDelegate] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
    const [isApplying, setIsApplying] = useState(false); 

    useEffect(() => {
        checkCandidateStatus();
    }, []);

    const checkCandidateStatus = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");

            if (!token) {
                setIsLoading(false);
                return;
            }

            const tokenObject = JSON.parse(token);
            const userToken = tokenObject.access_token;

            const response = await axios.get(`${BASE_URL}/me`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.data && response.data.user) {
                setIsDelegate(response.data.user.candidate); 
            } else {
                 setIsDelegate(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    const handleApply = async () => {
        setIsApplying(true); 

        try {
            const token = await SecureStore.getItemAsync("token");

            if (!token) {
                Alert.alert("Erreur", "Veuillez vous reconnecter pour postuler.");
                router.push('/');
                return;
            }

            const tokenObject = JSON.parse(token);
            const userToken = tokenObject.access_token;
            
            const BECOME_CANDIDATE_ENDPOINT = `${BASE_URL}/apply-delegate`; 

            const response = await axios.post(
                BECOME_CANDIDATE_ENDPOINT, 
                {}, 
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}` 
                    }
                }
            );

            if (response.status === 200) {
                Alert.alert("Succès !", "Félicitations, votre candidature est enregistrée !");
                setIsDelegate(true);
            }

        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || "Échec de la candidature (Problème de connexion ou route API).";

                Alert.alert('Échec', errorMessage);
                
            } else {
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