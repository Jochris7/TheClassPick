import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios, { isAxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const BASE_URL = "http://192.168.1.8:3000";

interface VoteCandidate {
  _id: string;
  username: string;
  class: string;
}

interface VoteData {
  candidate: VoteCandidate;
  count: number;
}

interface VoteBarProps {
  name: string;
  votes: number;
  color: string;
  totalVotes: number;
}

const COLORS = ['#4287f5', '#2ECC71', '#9B59B6', '#E67E22', '#E74C3C', '#3498DB', '#F39C12'];

const VoteBar = ({ name, votes, color, totalVotes }: VoteBarProps) => {
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

  return (
    <View style={styles.voteBarContainer}>
      <View style={styles.voteBarHeader}>
        <Text style={styles.candidateNameBar}>{name}</Text>
        <Text style={styles.voteCount}>{votes} votes</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]}
        />
      </View>
    </View> 
  );
};

const ResultsScreen = () => {
  const [votesData, setVotesData] = useState<VoteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchVotes = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Erreur", "Veuillez vous reconnecter");
        return;
      }

      console.log("Récupération des votes...");

      const response = await axios.get(`${BASE_URL}/votes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log("Réponse votes:", response.data);

      if (response.data && Array.isArray(response.data.votes)) {
        setVotesData(response.data.votes);
        const total = response.data.votes.reduce((sum: number, vote: VoteData) => sum + vote.count, 0);
        setTotalVotes(total);
      } else {
        setVotesData([]);
        setTotalVotes(0);
      }

    } catch (error: unknown) {
      console.error("Erreur fetch votes:", error);
      
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          setVotesData([]);
          setTotalVotes(0);
        } else {
          const errorMessage = error.response?.data?.message || "Erreur lors du chargement des votes.";
          Alert.alert('Erreur API', errorMessage);
        }
      } else {
        Alert.alert('Erreur', 'Impossible de joindre le serveur.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#4287f5" />
        <Text style={styles.loadingText}>Chargement des résultats...</Text>
      </SafeAreaView>
    );
  }

  if (votesData.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContainer]}>
        <Text style={styles.noDataText}>Aucun vote n'a encore été enregistré.</Text>
        <TouchableOpacity onPress={fetchVotes} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Rafraîchir</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const winner = votesData[0]; // Le backend trie déjà par ordre décroissant

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
        <View style={styles.cardContainer}>
          <Text style={styles.mainTitle}>Distribution des Votes</Text>
          <Text style={styles.totalVotesText}>Total: {totalVotes} votes</Text>
          <View style={styles.separator} />

          {votesData.map((voteItem, index) => (
            <VoteBar 
              key={voteItem.candidate._id}
              name={`${voteItem.candidate.username} (${voteItem.candidate.class})`}
              votes={voteItem.count}
              color={COLORS[index % COLORS.length]}
              totalVotes={totalVotes}
            />
          ))}
        </View>

        <View style={styles.winnerCard}>
          <MaterialCommunityIcons name="trophy-award" size={32} color="#333" />
          <Text style={styles.winnerTitle}>Gagnant Actuel</Text>
          <Text style={styles.winnerName}>{winner.candidate.username}</Text>
          <Text style={styles.winnerClass}>{winner.candidate.class}</Text>
          <Text style={styles.winnerVotes}>avec {winner.count} votes</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
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
    padding: 20,
  },
  
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  
  totalVotesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 15,
  },

  voteBarContainer: {
    marginBottom: 15,
  },
  voteBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  candidateNameBar: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  voteCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },

  winnerCard: {
    backgroundColor: '#F7DC6F',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  winnerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  winnerName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  winnerClass: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
  },
  winnerVotes: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    fontWeight: '600',
  },
});