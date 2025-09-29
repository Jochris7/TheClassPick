import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
    
    const router = useRouter();

  return (
    
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4287f5" />
      <View style={styles.mainContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Statut de Candidature</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              Postuler comme Délégué
            </Text>
          </TouchableOpacity>
        </View>

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

      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Fond blanc pour le reste de l'écran
  },

  // Styles du contenu principal sous la zone de bienvenue
  mainContent: {
    flex: 1,
    padding: 20,
  },
  
  // Section Statut de Candidature
  sectionContainer: {
    backgroundColor: '#fff', // Fond blanc pour la carte Statut
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    // Ombre comme sur l'image
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

  // Bouton "Postuler comme Délégué"
  primaryButton: {
    backgroundColor: '#4287f5', // Bleu principal
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Ligne des cartes (Fil de Campagne et Résultats)
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Style générique des cartes
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    // La largeur est calculée pour laisser un espace entre les deux cartes
    width: (width - 60) / 2, // 60 = 20 (padding left) + 20 (padding right) + 20 (espace central)
    height: 120, 
    justifyContent: 'space-around',
    // Ombre similaire
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
});