// // WebLinkButtonsScreen.tsx
// import React from 'react';
// import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

// const WebLinkButtonsScreen: React.FC = () => {
//   const handleLinkPress = (url: string) => {
//     // Open the web link when a button is clicked
//     Linking.openURL(url).catch((err) => console.error('Error opening link:', err));
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.column}>
//         <TouchableOpacity onPress={() => handleLinkPress('https://isrohack1.onrender.com/')} style={styles.linkButton}>
//           <Text style={styles.linkButtonText}>Explore Data Files</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleLinkPress('https://wms-hack2.onrender.com/index1.html')} style={styles.linkButton}>
//           <Text style={styles.linkButtonText}>WMS Thematics</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleLinkPress('https://singleops-hack4.onrender.com/index4.html')} style={styles.linkButton}>
//           <Text style={styles.linkButtonText}>Uni Operations</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.column}>
//         <TouchableOpacity onPress={() => handleLinkPress('https://annodations-hack5.onrender.com/index6.html')} style={styles.linkButton}>
//           <Text style={styles.linkButtonText}>Annodations</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleLinkPress('https://binop-hack6.onrender.com/index3.html')} style={styles.linkButton}>
//           <Text style={styles.linkButtonText}>Bin-operations</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleLinkPress('https://district7-y0ej.onrender.com/index2.html')} style={styles.linkButton}>
//           <Text style={styles.linkButtonText}>District Boundaries</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//   },
//   column: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   linkButton: {
//     backgroundColor: 'lightblue',
//     padding: 20,
//     margin: 10,
//     borderRadius: 8,
//     height: 200
//   },
//   linkButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default WebLinkButtonsScreen;


// WebLinkButtonsScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import WebView from 'react-native-webview';

const WebLinkButtonsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleLinkPress = (url: string) => {
    setCurrentUrl(url);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <LinkButton title="Explore Data Files" url="https://isrohack1.onrender.com/" onPress={handleLinkPress} />
        <LinkButton title="WMS Thematics" url="https://wms-hack2.onrender.com/index1.html" onPress={handleLinkPress} />
        <LinkButton title="Uni Operations" url="https://singleops-hack4.onrender.com/index4.html" onPress={handleLinkPress} />
      </View>
      <View style={styles.column}>
        <LinkButton title="Annodations" url="https://annodations-hack5.onrender.com/index6.html" onPress={handleLinkPress} />
        <LinkButton title="Bin-operations" url="https://binop-hack6.onrender.com/index3.html" onPress={handleLinkPress} />
        <LinkButton title="District Boundaries" url="https://district7-y0ej.onrender.com/index2.html" onPress={handleLinkPress} />
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <WebView source={{ uri: currentUrl }} />
        
      </Modal>
    </View>
  );
};

const LinkButton = ({ title, url, onPress }) => (
  <TouchableOpacity onPress={() => onPress(url)} style={styles.linkButton}>
    <Text style={styles.linkButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  linkButton: {
    backgroundColor: 'lightblue',
    padding: 20,
    margin: 10,
    borderRadius: 8,
    height: 200
  },
  linkButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 20,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  closeButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WebLinkButtonsScreen;

