import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

interface RecentlyOpenedDocumentsProps {}

const RecentlyOpenedDocuments: React.FC<RecentlyOpenedDocumentsProps> = () => {
  const [recentDocuments, setRecentDocuments] = useState<DocumentPickerResponse[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Load recently opened documents from AsyncStorage
    loadRecentDocuments();
  }, []);

  const loadRecentDocuments = async () => {
    try {
      const storedDocuments = await AsyncStorage.getItem('recentDocuments');
      if (storedDocuments) {
        setRecentDocuments(JSON.parse(storedDocuments));
      }
    } catch (error) {
      console.error('Error loading recent documents:', error);
    }
  };

  const handleDocumentPress = async (document: DocumentPickerResponse) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // const result = "hi"
      // Handle the selected document
      console.log(result);

      // Update recently opened documents
      if (result.at(0)) {
        navigation.navigate('Map', { selectedDocument: result.at(0) });
      }
      // onDocumentPicked(result.at(0));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
    // Navigate to the Map screen and pass the selected document as a parameter
    
  };

  const renderItem = ({ item }: { item: DocumentPickerResponse }) => (
    <TouchableOpacity onPress={() => handleDocumentPress(item)}>
      <View style={styles.documentItem}>
        <Text style={{ color: 'black', fontFamily: 'Inter' }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recently Opened Layers</Text>
      <FlatList
        data={recentDocuments}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri} // Use a unique identifier here, like uri
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  documentItem: {
    paddingTop: 23,
    paddingRight: 25,
    paddingBottom: 23,
    paddingLeft: 21,
    backgroundColor: '#aded63',
    borderRadius: 9,
    margin: 5,
    width: 320,
    height: 64,
    textAlignVertical: 'auto',
  },
});

export default RecentlyOpenedDocuments;
