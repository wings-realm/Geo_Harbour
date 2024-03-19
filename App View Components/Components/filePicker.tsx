import React from 'react';
import { View, TouchableOpacity, Image,Text } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const addImage = require('../sources/add.png'); // Import the image using require

const FilePicker: React.FC<{ onDocumentPicked: (result: DocumentPickerResponse | undefined) => void }> = ({ onDocumentPicked }) => {
    const pickDocument = async () => {
      try {
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        // const result = "hi"
        // Handle the selected document
        console.log(result);
  
        // Update recently opened documents
        if (result.at(0)) {
          updateRecentDocuments(result.at(0));
        }
        onDocumentPicked(result.at(0));
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('Document picker cancelled');
        } else {
          console.error('Error picking document:', err);
        }
      }
    };

    const updateRecentDocuments = async (document: DocumentPickerResponse | undefined) => {
      try {
        if (document) {
          // Load existing recent documents from AsyncStorage
          const existingRecentDocuments = await AsyncStorage.getItem('recentDocuments');
          let recentDocuments: DocumentPickerResponse[] = existingRecentDocuments ? JSON.parse(existingRecentDocuments) : [];
  
          // Add the new document to the list
          recentDocuments = [document, ...recentDocuments.slice(0, 3)]; // Limit to 5 recent documents
  
          // Save the updated list back to AsyncStorage
          await AsyncStorage.setItem('recentDocuments', JSON.stringify(recentDocuments));
        }
      } catch (error) {
        console.error('Error updating recent documents:', error);
      }
    };


  return (
    <View>
      <TouchableOpacity onPress={pickDocument} style={{padding:20}}>
        <Image
          style={{ width: 70, height: 70, }}
          source={addImage} // Use the imported image
        />
        
      </TouchableOpacity>
      <Text style={{marginBottom:20}}>Add New Layer</Text>
    </View>
  );
};

export default FilePicker;
