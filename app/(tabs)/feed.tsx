import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CandidateCardProps {
  initials: string;
  name: string;
  time: string;
  message: string;
}

const CANDIDATES_DATA = [
  {
    id: '1',
    initials: 'M.O',
    name: 'Mariam Ouattara',
    time: 'Il y a 1 heure',
    message: "Je m'engage à rénover l'espace de détente et à améliorer l'accès aux ressources numériques pour tous ! 🚀",
  },
  {
    id: '2',
    initials: 'A.K',
    name: 'Aminata Kouassi',
    time: 'Il y a 2 heures',
    message: "Mon objectif : des sessions de soutien scolaire régulières et un meilleur dialogue avec l'administration. Votez pour un changement concret ! 💡",
  },
  {
    id: '3',
    initials: 'F.K',
    name: 'Fatoumata Kone',
    time: 'Il y a 3 heures',
    message: "Fini la cantine ennuyeuse ! Je vise à introduire plus d'options végétariennes et à organiser un événement sportif inter-classes annuel. 🏆",
  },
  {
    id: '4',
    initials: 'K.D',
    name: 'Kofi Diarra',
    time: 'Il y a 4 heures',
    message: "Je veux plus d’ateliers culturels et des espaces pour exprimer nos talents artistiques. Ensemble, faisons vibrer la classe ! 🎨",
  },
  {
    id: '5',
    initials: 'E.B',
    name: 'Édouard Bamba',
    time: 'Il y a 5 heures',
    message: "Je propose des sorties éducatives et un coin bibliothèque pour booster notre apprentissage. Votez pour l’avenir ! 📚",
  },
];


const CandidateCard = ({ initials, name, time, message }: CandidateCardProps) => {
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

      <Text style={styles.campaignMessage}>{message}</Text>

      <TouchableOpacity style={styles.voteButton}>
        <Text style={styles.voteButtonText}>Voter</Text>
      </TouchableOpacity>
    </View>
  );
};

const FeedScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {CANDIDATES_DATA.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            initials={candidate.initials}
            name={candidate.name}
            time={candidate.time}
            message={candidate.message}
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