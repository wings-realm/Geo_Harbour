import React, { useState } from 'react';
import FilePicker from './Components/filePicker';
import RecentlyOpenedDocuments from './Components/recent';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './Components/map'; // Import the YourNextScreen component
import { DocumentPickerResponse } from 'react-native-document-picker';
import StartPage from './StartPage';
import WebLinkButtonsScreen from './WebView';

const profile = require('./sources/profile.png');
const back = require('./sources/back.jpeg')

const HomeScreen: React.FC<{ onDocumentPicked: (document: DocumentPickerResponse | undefined ) => void }> = ({ onDocumentPicked }) => {
  const [recentDocumentsUpdated, setRecentDocumentsUpdated] = useState(false);
  const navigation = useNavigation();

  const handleDocumentPicked = (result: DocumentPickerResponse | undefined) => {
    onDocumentPicked(result);
    // Navigate to Map and pass the selected document as a parameter
    navigation.navigate('Map', { selectedDocument: result });
  };
  return (
    <ImageBackground source={back} resizeMode="cover" style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleWrapper}>
          <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold', margin: 50 }}>GEOHARBOUR</Text>
        </View>
        <View style={styles.inputWrapper}></View>
      </View>

      <View  style={styles.footer}>
      
        <Image style={{ width: 120, height: 120}} source={profile} />
        <View style={styles.inn}>
          <RecentlyOpenedDocuments key={recentDocumentsUpdated ? 'updated' : 'not-updated'} />
          <FilePicker onDocumentPicked={handleDocumentPicked} />
        </View>
        </View>
      
    </ImageBackground>
  );
};

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="StartPage" component={StartPage} />
        <Stack.Screen name="WebViewScreen" component={WebLinkButtonsScreen} />
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} onDocumentPicked={() => {}} />}
        </Stack.Screen>
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    backgroundColor: 'white',
    
  },
  titleWrapper: {
    
  },
  inputWrapper: {
    marginBottom: 0
  },
  contentContainer: {
      flex: 1 // pushes the footer to the end of the screen
  },
  footer: {
      height: 600,
      backgroundColor: 'black',
      
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch'
      
  },
  inn:{
    alignItems: 'center',
    marginBottom: 80
  }
});

export default App;
