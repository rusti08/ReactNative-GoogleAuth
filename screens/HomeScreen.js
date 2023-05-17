import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const restoreToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setLoggedIn(true);
      }
    } catch (error) {
      // Add your own error handler here
      console.error('Error restoring token:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const user = await response.json();
          setUserInfo(user);
        } else {
            // Handle error response
            console.error('Error fetching user info');
          }
        }
      } catch (error) {
        // Handle network error
        console.error('Network error:', error);
      }
    };
  
    // Handle logout with confirmation alert
    const handleLogout = async () => {
        Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
            {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "Yes", onPress: handleLogoutConfirmed }
        ]
        );
    };

    // Proceed to logout when confirmation is yes
    const handleLogoutConfirmed = async () => {
        try {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login');
        } catch (error) {
        // Add your own error handler here
        }
    };
  
    return (
      <View style={styles.container}>
        {userInfo ? (
          <View>
            <Image style={styles.profileImage} source={{ uri: userInfo.picture }} />
            <Text style={styles.text}>Welcome, {userInfo.name}</Text>
            <Text style={styles.text}>{userInfo.email}</Text>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });
  