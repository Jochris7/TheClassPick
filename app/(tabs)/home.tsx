import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

    const [isDelegate, setIsDelegate] = useState(false);

    const handleApply = () => {
        setIsDelegate(true);
        
    };

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
              
              <TouchableOpacity style={styles.primaryButton} onPress={handleApply}>
                <Text style={styles.primaryButtonText}>
                  Postuler comme Délégué
                </Text>
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