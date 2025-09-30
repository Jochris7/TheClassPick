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

const BASE_URL = 'http://192.168.252.148:3000';
const CAMPAIGNS_ENDPOINT = `${BASE_URL}/campaigns`;

interface Campaign {
    _id: string;
    title: string;
    description: string;
    candidate: {
        username: string;
        class: string;
        // fullName pourrait être là si votre modèle User l'inclut
    };
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

const CandidateCard = ({ initials, name, time, title, description, id }: CandidateCardProps) => {
    const handleVote = () => {
        Alert.alert("Voter", `Vous allez voter pour ${name}.`);
    };

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

            <TouchableOpacity style={styles.voteButton} onPress={handleVote}>
                <Text style={styles.voteButtonText}>Voter</Text>
            </TouchableOpacity>
        </View>
    );
};

const FeedScreen = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getToken = async () => {
        const tokenString = await SecureStore.getItemAsync("token");
        if (!tokenString) throw new Error("Token non trouvé.");
        return JSON.parse(tokenString).access_token;
    };

    const formatTimeAgo = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diffInSeconds < 60) return "À l'instant";
            if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`;
            if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
            return date.toLocaleDateString();

        } catch {
            return "Récemment";
        }
    };

    const getCandidateInitials = (candidate: Campaign['candidate']): string => {
        const name = candidate.username; // Utiliser le username comme nom par défaut
        return name.split(' ').map(n => n[0]).join('.').toUpperCase() || name[0].toUpperCase();
    };

    const getCandidateName = (candidate: Campaign['candidate']): string => {
        // Idéalement, utilisez fullName si disponible, sinon username + class
        return `${candidate.username} (${candidate.class})`;
    }

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();

            const response = await axios.get(CAMPAIGNS_ENDPOINT, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data && Array.isArray(response.data.campaigns)) {
                setCampaigns(response.data.campaigns);
            } else {
                setCampaigns([]);
            }

        } catch (error: unknown) {
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
                <Text style={styles.noDataText}>Aucune campagne de candidat n'est encore disponible. 😥</Text>
                <TouchableOpacity onPress={fetchCampaigns} style={styles.refreshButton}>
                    <Text style={styles.refreshButtonText}>Rafraîchir</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {campaigns.map((campaign) => (
                    <CandidateCard
                        key={campaign._id}
                        id={campaign._id}
                        initials={getCandidateInitials(campaign.candidate)}
                        name={getCandidateName(campaign.candidate)}
                        time={formatTimeAgo(campaign.createdAt)}
                        title={campaign.title}
                        description={campaign.description}
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
        borderRadius: 5,
    },
    refreshButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    },
    campaignTitle: {
        fontSize: 15,
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
});