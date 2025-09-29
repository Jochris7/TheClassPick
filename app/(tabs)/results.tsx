import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');


interface VoteBarProps {
  name: string;
  votes: number;
  color: string;
}


const VOTES_DATA = [
  { id: '1', name: 'Mariam Ouattara', votes: 45, color: '#4287f5' },
  { id: '2', name: 'Aminata Kouassi', votes: 32, color: '#2ECC71' },
  { id: '3', name: 'Fatoumata Kone', votes: 28, color: '#9B59B6' },
  { id: '4', name: 'Kofi Diarra', votes: 18, color: '#E67E22' },
  { id: '5', name: 'Édouard Bamba', votes: 12, color: '#E74C3C' },
];

const totalVotes = VOTES_DATA.reduce((sum, item) => sum + item.votes, 0);

const winner = VOTES_DATA.reduce((prev, current) =>
  (prev.votes > current.votes) ? prev : current
);

const VoteBar = ({ name, votes, color }: VoteBarProps) => {
  const percentage = (votes / totalVotes) * 100;

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
        <View style={styles.cardContainer}>
          <Text style={styles.mainTitle}>Distribution des Votes</Text>
          <View style={styles.separator} />

          {VOTES_DATA.map((candidate) => (
            <VoteBar 
              key={candidate.name}
              name={candidate.name}
              votes={candidate.votes}
              color={candidate.color}
            />
          ))}
        </View>

        <View style={styles.winnerCard}>
          <MaterialCommunityIcons name="trophy-award" size={24} color="#333" />
          <Text style={styles.winnerTitle}>Gagnant</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerVotes}>avec {winner.votes} votes</Text>
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
  },
  voteCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
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
    marginTop: 5,
  },
  winnerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  winnerVotes: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
});