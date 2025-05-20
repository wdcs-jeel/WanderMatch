import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import * as ImagePicker from 'react-native-image-picker';

import { NavigationProp } from '../../../utils/navigation/RootStackParamList';
import { LOOKING_FOR_OPTIONS, LookingForOption, TRAVEL_STYLE_OPTIONS, TRAVEL_TYPES, TravelStyle, TravelType } from '../../../utils/types/types';
// import { User } from '../../../context/ContextType';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { updateProfile } from '../../../redux/slice/authSlice';
import { User } from '../../../redux/type';
import CommonTextInput from '../../../components/TextInput';
import { pickImage } from '../../../services/ImagePickerService';

interface ProfileFormData {
  fullName: string;
  bio: string;
  travelType: string;
  lookingFor: string;
  travelStyle: string;
  languages: string;
}

export default function EditProfilePage() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {user,isLoading} = useSelector((state: RootState) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    bio: '',
    travelType: '',
    lookingFor: '',
    travelStyle: '',
    languages: '',
  });

  // Load user data when component mounts
  useEffect(() => {
    if (!user && !isLoading) {
      // Only show alert if we're not loading and there's no user
      Alert.alert(
        'Authentication Required',
        'Please log in to edit your profile',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login')
          }
        ]
      );
    } else if (user) {
      // Set form data when user data is available
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        travelType: user.travelType || '',
        lookingFor: user.lookingFor?.join(', ') || '',
        travelStyle: user.travelStyle?.join(', ') || '',
        languages: user.languages?.join(', ') || '',
      });
      // Set initial profile image
      if (user.identityDocument?.data) {
        setProfileImage(`data:${user.identityDocument.contentType};base64,${user.identityDocument.data}`);
      }
    }
  }, [user, isLoading, navigation]);

  const handleImagePick = async () => {
    // const options: ImagePicker.ImageLibraryOptions = {
    //   mediaType: 'photo',
    //   includeBase64: true,
    //   maxHeight: 800,
    //   maxWidth: 800,
    //   quality: 0.8 as ImagePicker.PhotoQuality,
    // };

    // try {
    //   const result = await ImagePicker.launchImageLibrary(options);
      
    //   if (result.didCancel) {
    //     return;
    //   }

    //   if (result.errorCode) {
    //     Alert.alert('Error', result.errorMessage);
    //     return;
    //   }

    //   if (result.assets && result.assets[0]?.uri) {
    //     setProfileImage(result.assets[0].uri);
    //   }
    // } catch (error) {
    //   console.error('Image picker error:', error);
    //   Alert.alert('Error', 'Failed to select image. Please try again.');
    // }

    const image = await pickImage(false); // no base64 needed for profile pic
    if (image) {
      setProfileImage(image.uri);
    }
  };

  const handleSave = async () => {
    try {
      if (!user) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please log in again.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login')
            }
          ]
        );
        return;
      }

      // Validate fullName
      const fullName = formData.fullName.trim();
      if (!fullName) {
        Alert.alert('Error', 'Name is required');
        return;
      }
     

      // Validate travel type
      const travelType = formData.travelType.trim();
      if (travelType && !TRAVEL_TYPES.includes(travelType as TravelType)) {
        Alert.alert('Error', `Travel type must be one of: ${TRAVEL_TYPES.join(', ')}`);
        return;
      }

      // Convert comma-separated strings to arrays and validate
      const lookingForArray = formData.lookingFor
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0) as LookingForOption[];

      const travelStyleArray = formData.travelStyle
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0) as TravelStyle[];

      const languagesArray = formData.languages
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Validate looking for options
      const invalidLookingFor = lookingForArray.find(item => !LOOKING_FOR_OPTIONS.includes(item as LookingForOption));
      if (invalidLookingFor) {
        Alert.alert('Error', `Invalid looking for option: ${invalidLookingFor}\nValid options are: ${LOOKING_FOR_OPTIONS.join(', ')}`);
        return;
      }

      // Validate travel style options
      const invalidTravelStyle = travelStyleArray.find(item => !TRAVEL_STYLE_OPTIONS.includes(item as TravelStyle));
      if (invalidTravelStyle) {
        Alert.alert('Error', `Invalid travel style: ${invalidTravelStyle}\nValid options are: ${TRAVEL_STYLE_OPTIONS.join(', ')}`);
        return;
      }

      // Create update data object
      const updatedData: Partial<User> = {
        fullName: fullName,
        bio: formData.bio.trim(),
        travelType: (travelType as TravelType) || undefined,
        lookingFor: lookingForArray.length > 0 ? lookingForArray : undefined,
        travelStyle: travelStyleArray.length > 0 ? travelStyleArray : undefined,
        languages: languagesArray.length > 0 ? languagesArray : undefined,
      };

      // Add profile image if changed
      if (profileImage && profileImage !== `data:${user?.identityDocument?.contentType};base64,${user?.identityDocument?.data}`) {
        // Create file object for the image
        const filename = profileImage.split('/').pop() || 'profile-image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Create a file object that matches the expected type
        const file = {
          uri: profileImage,
          type,
          name: filename
        };

        // Add the file to FormData
        const formData = new FormData();
        formData.append('identityDocument', file as any);
        
        // Add all other fields to FormData
        Object.entries(updatedData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });

        // Update the data with FormData
        Object.assign(updatedData, { identityDocument: formData });
      }

      console.log('Sending profile update with data:', {
        ...updatedData,
        identityDocument: updatedData.identityDocument ? 'Image included' : 'No image update'
      });

      setIsSaving(true);
      const resultAction = await dispatch(updateProfile(updatedData));
      
      if (updateProfile.fulfilled.match(resultAction)) {
        console.log('Profile updated successfully');
        navigation.goBack();
      } else {
        console.error('Profile update failed:', resultAction.error);
        Alert.alert('Error', resultAction.error?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A9FF" />
      </View>
    );
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
          {/* <Text style={styles.backButtonText}>Back</Text> */}
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : { uri: 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740' }
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.changeImageButton}
            onPress={handleImagePick}
          >
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <CommonTextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <CommonTextInput
            style={[styles.input, styles.textArea]}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Travel Type</Text>
          <CommonTextInput
            style={styles.input}
            value={formData.travelType}
            onChangeText={(text) => setFormData({ ...formData, travelType: text })}
            placeholder={`e.g., ${TRAVEL_TYPES.join(', ')}`}
          />
          <Text style={styles.helperText}>Valid options: {TRAVEL_TYPES.join(', ')}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Looking For (comma-separated)</Text>
          <CommonTextInput
            style={styles.input}
            value={formData.lookingFor}
            onChangeText={(text) => setFormData({ ...formData, lookingFor: text })}
            placeholder={`e.g., ${LOOKING_FOR_OPTIONS.slice(0, 2).join(', ')}`}
          />
          <Text style={styles.helperText}>Valid options: {LOOKING_FOR_OPTIONS.join(', ')}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Travel Style (comma-separated)</Text>
          <CommonTextInput
            style={styles.input}
            value={formData.travelStyle}
            onChangeText={(text) => setFormData({ ...formData, travelStyle: text })}
            placeholder={`e.g., ${TRAVEL_STYLE_OPTIONS.slice(0, 2).join(', ')}`}
          />
          <Text style={styles.helperText}>Valid options: {TRAVEL_STYLE_OPTIONS.join(', ')}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Languages (comma-separated)</Text>
          <CommonTextInput
            style={styles.input}
            value={formData.languages}
            onChangeText={(text) => setFormData({ ...formData, languages: text })}
            placeholder="e.g., English, Spanish, French"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, (isSaving || isLoading) && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(16),
  },
  backButtonText: {
    fontSize: moderateScale(16),
    color: 'black',
    marginLeft: scale(4),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#F43F5E',
  },
  form: {
    padding: scale(16),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: scale(8),
    padding: scale(12),
    fontSize: moderateScale(16),
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    height: verticalScale(120),
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginTop: verticalScale(4),
  },
  saveButton: {
    backgroundColor: '#F43F5E',
    borderRadius: scale(8),
    padding: scale(16),
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
    position: 'relative',
  },
  profileImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 3,
    borderColor: '#F43F5E',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#F43F5E',
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
}); 