import axios, { isAxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = "http://192.168.1.8:3000";

// Interface pour le candidat peuplé par Mongoose
interface PopulatedCandidate {
    _id: string;
    username: string;
    class: string;
}

interface Campaign {
    _id: string;
    title: string;
    description: string;
    candidate: PopulatedCandidate; // Peuplé par .populate()
    createdAt: string;
}

interface CandidateCardProps {
    id: string;
    initials: string;
    name: string;
    time: string;
    title: string;
    description: string;
}

interface CandidateCardProps {
    id: string;
    initials: string;
    name: string;
    username: string;
    time: string;
    title: string;
    description: string;
    onVote: (username: string) => void;
}

const CandidateCard = ({ initials, name, username, time, title, description, onVote }: CandidateCardProps) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.candidateName}>{name}</Text>
                    <Text style={styles.timeText}>{time}</Text>
                </View>
            </View>
            
            <Text style={styles.campaignTitle}>{title}</Text>
            <Text style={styles.campaignMessage}>{description}</Text>

            <TouchableOpacity 
                style={styles.voteButton} 
                onPress={() => onVote(username)}
            >
                <Text style={styles.voteButtonText}>Voter</Text>
            </TouchableOpacity>
        </View>
    );
};

const FeedScreen = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false);

    const formatTimeAgo = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diffInSeconds < 60) return "À l'instant";
            if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
            if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
            return date.toLocaleDateString('fr-FR');

        } catch {
            return "Récemment";
        }
    };

    const getCandidateInitials = (candidate: PopulatedCandidate): string => {
        const name = candidate.username;
        const parts = name.split(' ');
        if (parts.length > 1) {
            return parts.map(n => n[0]).join('.').toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getCandidateName = (candidate: PopulatedCandidate): string => {
        return `${candidate.username} (${candidate.class})`;
    };

    const handleVote = async (username: string) => {
        Alert.alert(
            "Confirmer le vote",
            `Voulez-vous vraiment voter pour ${username} ?`,
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Voter",
                    onPress: async () => {
                        setIsVoting(true);
                        try {
                            const token = await SecureStore.getItemAsync("token");

                            if (!token) {
                                Alert.alert("Erreur", "Veuillez vous reconnecter");
                                return;
                            }

                            console.log("Vote pour:", username);

                            const response = await axios.post(
                                `${BASE_URL}/votes`,
                                { username },
                                {
                                    headers: { 
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );

                            console.log("Réponse vote:", response.data);

                            if (response.status === 201) {
                                Alert.alert(
                                    "Succès",
                                    response.data.message || "Votre vote a été enregistré !",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => {
                                                // Optionnel: rafraîchir les campagnes ou rediriger
                                            }
                                        }
                                    ]
                                );
                            }

                        } catch (error: unknown) {
                            console.error("Erreur vote:", error);
                            
                            if (isAxiosError(error)) {
                                const errorMessage = error.response?.data?.message || "Erreur lors du vote.";
                                Alert.alert('Échec', errorMessage);
                            } else {
                                Alert.alert('Erreur', 'Une erreur inconnue est survenue.');
                            }
                        } finally {
                            setIsVoting(false);
                        }
                    }
                }
            ]
        );
    };

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync("token");

            if (!token) {
                Alert.alert("Erreur", "Veuillez vous reconnecter");
                return;
            }

            console.log("Récupération des campagnes...");

            const response = await axios.get(`${BASE_URL}/campaigns`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log("Réponse campaigns:", response.data);
            
            if (response.data && Array.isArray(response.data.campaigns)) {
                setCampaigns(response.data.campaigns);
            } else {
                console.log("Format de réponse inattendu:", response.data);
                setCampaigns([]);
            }

        } catch (error: unknown) {
            console.error("Erreur fetch campaigns:", error);
            
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Erreur lors du chargement des campagnes.";
                Alert.alert('Erreur API', errorMessage);
            } else {
                Alert.alert('Erreur', 'Impossible de joindre le serveur.');
            }
            setCampaigns([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#4287f5" />
                <Text style={styles.loadingText}>Chargement du fil d'actualité...</Text>
            </SafeAreaView>
        );
    }
    
    if (campaigns.length === 0) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
                <Text style={styles.noDataText}>
                    Aucune campagne de candidat n'est encore disponible.
                </Text>
                <TouchableOpacity onPress={fetchCampaigns} style={styles.refreshButton}>
                    <Text style={styles.refreshButtonText}>Rafraîchir</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {isVoting && (
                <View style={styles.votingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.votingText}>Enregistrement du vote...</Text>
                </View>
            )}
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {campaigns.map((campaign) => (
                    <CandidateCard
                        key={campaign._id}
                        id={campaign._id}
                        initials={getCandidateInitials(campaign.candidate)}
                        name={getCandidateName(campaign.candidate)}
                        username={campaign.candidate.username}
                        time={formatTimeAgo(campaign.createdAt)}
                        title={campaign.title}
                        description={campaign.description}
                        onVote={handleVote}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default FeedScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    noDataText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginBottom: 20,
    },
    refreshButton: {
        backgroundColor: '#4287f5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    scrollViewContent: {
        padding: 10,
    },
    
    cardContainer: {
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
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4287f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    candidateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    timeText: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    campaignTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#004488',
        marginBottom: 5,
    },
    campaignMessage: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 15,
    },

    voteButton: {
        backgroundColor: '#4287f5',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    voteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    
    votingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    votingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
});