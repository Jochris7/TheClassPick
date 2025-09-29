import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Données factices de post pour l'affichage initial
const initialPosts = [
    {
        id: 1,
        author: 'Fatou Kone',
        time: 'Il y a 2 heures',
        content: 'Fini la cantine ennuyeuse ! Je vise à introduire plus d\'options végétariennes et à organiser un événement sportif inter-classes annuel. 🏆',
        votes: 23,
    },
];

const ProfileScreen = () => {
    const [posts, setPosts] = useState(initialPosts);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;

        if (isEditing) {
            setPosts(posts.map(post => 
                post.id === editingPostId ? { ...post, content: newPostContent } : post
            ));
            setIsEditing(false);
            setEditingPostId(null);
        } else {
            const newPost = {
                id: Date.now(),
                author: 'Moi (Délégué)',
                time: 'À l\'instant',
                content: newPostContent.trim(),
                votes: 0,
            };
            setPosts([newPost, ...posts]);
        }

        setNewPostContent('');
        setIsFormVisible(false);
        Keyboard.dismiss();
    };

    const handleDeletePost = (id: number) => {
        setPosts(posts.filter(post => post.id !== id));
    };

    const handleEditPost = (post: any) => {
        setNewPostContent(post.content);
        setEditingPostId(post.id);
        setIsEditing(true);
        setIsFormVisible(true);
    };

    const handleLogout = () => {

        console.log("Déconnexion de l'utilisateur...");
    };

    const renderPostForm = () => (
        <View style={styles.postFormContainer}>
            <Text style={styles.formTitle}>
                {isEditing ? 'Modifier votre post' : 'Écrire un nouveau post'}
            </Text>
            <TextInput
                style={styles.postInput}
                placeholder="Exprimez vos idées pour la campagne ici..."
                multiline
                numberOfLines={4}
                value={newPostContent}
                onChangeText={setNewPostContent}
            />
            <View style={styles.formButtonRow}>
                <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => {
                        setIsFormVisible(false);
                        setIsEditing(false);
                        setEditingPostId(null);
                        setNewPostContent('');
                        Keyboard.dismiss();
                    }}
                >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.formButton, styles.sendButton, !newPostContent.trim() && styles.disabledButton]}
                    onPress={handleCreatePost}
                    disabled={!newPostContent.trim()}
                >
                    <Text style={styles.sendButtonText}>
                        {isEditing ? 'Sauvegarder' : 'Poster'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.profileHeaderContainer}>
                    <Text style={styles.profileTitle}>Hey, Fatou Kone 👋</Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <MaterialIcons name="logout" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.createPostButton}
                    onPress={() => setIsFormVisible(true)}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                    <Text style={styles.createPostButtonText}>
                        Créer un post
                    </Text>
                </TouchableOpacity>

                {isFormVisible && renderPostForm()}
                
                <Text style={styles.postsSectionTitle}>Mes posts</Text>

                {posts.map(post => (
                    <View key={post.id} style={styles.postCard}>
                        <View style={styles.postHeader}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {post.author.split(' ').map(n => n[0]).join('.').toUpperCase()}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.authorName}>{post.author}</Text>
                                <Text style={styles.postTime}>{post.time}</Text>
                            </View>
                        </View>
                        
                        <Text style={styles.postContent}>{post.content}</Text>
                        
                        <View style={styles.postFooter}>
                            <View style={styles.voteContainer}>
                                <MaterialIcons name="laptop" size={16} color="#333" />
                                <Text style={styles.voteCount}>{post.votes} votes</Text>
                            </View>

                            <View style={styles.postActions}>
                                <TouchableOpacity onPress={() => handleEditPost(post)} style={styles.actionButton}>
                                    <MaterialIcons name="edit" size={20} color="#4287f5" />
                                    <Text style={styles.actionButtonText}>Modifier</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeletePost(post.id)} style={styles.actionButton}>
                                    <MaterialIcons name="delete" size={20} color="#e74c3c" />
                                    <Text style={[styles.actionButtonText, { color: '#e74c3c' }]}>Supprimer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {Platform.OS === 'ios' && isFormVisible && (
                <KeyboardAvoidingView behavior="padding" />
            )}
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f7fa',
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

    logoutButton: {
        padding: 5,
    },
    scrollContent: {
        padding: 20,
    },
    createPostButton: {
        flexDirection: 'row',
        backgroundColor: '#004488',
        paddingVertical: 12,
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
    createPostButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    postsSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    postCard: {
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
    postHeader: {
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
        fontSize: 14,
    },
    authorName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    postTime: {
        fontSize: 12,
        color: '#777',
    },
    postContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 15,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voteCount: {
        fontSize: 14,
        color: '#333',
        marginLeft: 5,
    },
    postActions: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        color: '#4287f5',
        marginLeft: 5,
    },
    postFormContainer: {
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
        marginBottom: 10,
    },
    postInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
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
        paddingHorizontal: 15,
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
