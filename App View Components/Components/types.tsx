import { DocumentPickerResponse } from "react-native-document-picker";

export type RootStackParamList = {
    Home: undefined;
    Map: { selectedDocument: DocumentPickerResponse };
  };
  