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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { NavigationProp } from '../../../utils/navigation/RootStackParamList';
import { FormData, LOOKING_FOR_OPTIONS, LookingForOption, TRAVEL_STYLE_OPTIONS, TRAVEL_TYPES, TravelStyle, TravelType } from '../../../utils/types/types';
// import { User } from '../../../context/ContextType';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { updateProfile } from '../../../redux/slice/authSlice';
import { User } from '../../../redux/type';
import CommonTextInput from '../../../components/TextInput';

export default function EditProfilePage() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {user,isLoading} = useSelector((state: RootState) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
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
    }
  }, [user, isLoading, navigation]);

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
      if (fullName.length < 2 || fullName.length > 50) {
        Alert.alert('Error', 'Name must be between 2 and 50 characters');
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
        fullName: fullName, // Ensure fullName is included
        bio: formData.bio.trim(),
        travelType: (travelType as TravelType) || undefined,
        lookingFor: lookingForArray.length > 0 ? lookingForArray : undefined,
        travelStyle: travelStyleArray.length > 0 ? travelStyleArray : undefined,
        languages: languagesArray.length > 0 ? languagesArray : undefined,
      };

      console.log('Current user:', user);
      setIsSaving(true);
      dispatch(updateProfile(updatedData));
      navigation.goBack();
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.message.includes('No authentication token or user found')) {
        Alert.alert(
          'Authentication Error',
          'Please log in again to update your profile',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login')
            }
          ]
        );
      } else if (error.message.includes('Unable to connect to the server')) {
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to update profile');
      }
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
}); 