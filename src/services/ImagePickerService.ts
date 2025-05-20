import { Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

type PickedImage = {
  uri: string;
  base64?: string;
  fileName?: string;
  type?: string;
} | null;

export const pickImage = async (
  includeBase64 = false
): Promise<PickedImage> => {
  const options: ImagePicker.ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64,
    maxHeight: 800,
    maxWidth: 800,
    quality: 0.8,
    selectionLimit: 1,
  };

  try {
    const result = await ImagePicker.launchImageLibrary(options);

    if (result.didCancel) return null;

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Image picker error');
      return null;
    }

    const asset = result.assets?.[0];
    if (asset?.uri) {
      return {
        uri: asset.uri,
        base64: asset.base64,
        fileName: asset.fileName,
        type: asset.type,
      };
    }

    return null;
  } catch (error) {
    console.error('Image picker error:', error);
    Alert.alert('Error', 'Failed to select image. Please try again.');
    return null;
  }
};
