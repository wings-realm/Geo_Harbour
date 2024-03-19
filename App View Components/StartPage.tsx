// StartPage.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const app = require('./sources/app.jpg');
const web = require('./sources/web.jpg');

const StartPage: React.FC = () => {
  const navigation = useNavigation();

  const handleWebviewClick = () => {
    // Navigate to the webview page (you can implement this based on your navigation structure)
    navigation.navigate('WebViewScreen');
  };

  const handleAppviewClick = () => {
    // Navigate to the App component
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.buttonContainer, styles.webviewButton]}
        onPress={handleWebviewClick}
      >
        <ImageBackground source={web} style={styles.backgroundImage}>
          <Text style={styles.buttonText}>Web View</Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonContainer, styles.appviewButton]}
        onPress={handleAppviewClick}
      >
        <ImageBackground source={app} style={styles.backgroundImage}>
          <Text style={styles.buttonText}>App View</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // for Android
  },
  webviewButton: {
    backgroundColor: '#3498db',
  },
  appviewButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'black',
    fontSize: 28, // Increased font size
    textAlign: 'center',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
});

export default StartPage;
