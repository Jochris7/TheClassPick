import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const Layout = () => {
    return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: "#335599",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#4287f5",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },

        
    }}
    >
        <Tabs.Screen
        name="home"
        options={{
            title: "Acceuil",
            tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
            ),
        }}
        />

        <Tabs.Screen
        name="feed"
        options={{
            title: "Actualités",
            tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
            ),
        }}
        />

        <Tabs.Screen
        name="results"
        options={{
            title: "Résultats",
            tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart-outline" size={24} color={color} />
            ),
        }}
        />

        <Tabs.Screen
        name="profile"
        options={{
            title: "Profil",
            tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
            ),
        }}
        />
    </Tabs>
    );
};

export default Layout;