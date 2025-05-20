"use client"

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

import { NavigationProp } from '../../utils/navigation/RootStackParamList';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { register } from '../../redux/slice/authSlice';
import CommonTextInput from '../../components/TextInput';
import { pickImage } from '../../services/ImagePickerService';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('email');
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const totalSteps = 4;

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    fullName: '',
    dateOfBirth: '',
    travelType: '',
    lookingFor: [] as string[],
    travelStyle: [] as string[],
    bio: '',
    topDestinations: [] as string[],
    languages: [] as string[],
    identityDocument: '',
    profilePhotos: [] as string[],
    identityConfirmed: false,
  });

  // Validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    fullName: '',
    dateOfBirth: '',
    travelType: '',
    lookingFor: '',
    travelStyle: '',
    bio: '',
    topDestinations: '',
    languages: '',
    identityDocument: '',
    identityConfirmed: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    // Handle array fields (destinations and languages)
    if (field === 'topDestinations' || field === 'languages') {
      const values = typeof value === 'string' ? value.split(',').map(item => item.trim()) : value;
      setFormData(prev => ({ ...prev, [field]: values }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTravelTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, travelType: type }));
    if (errors.travelType) {
      setErrors(prev => ({ ...prev, travelType: '' }));
    }
  };

  const handleLookingForSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(type)
        ? prev.lookingFor.filter(t => t !== type)
        : [...prev.lookingFor, type],
    }));
    if (errors.lookingFor) {
      setErrors(prev => ({ ...prev, lookingFor: '' }));
    }
  };

  const handleTravelStyleSelect = (style: string) => {
    setFormData(prev => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter(s => s !== style)
        : [...prev.travelStyle, style],
    }));
    if (errors.travelStyle) {
      setErrors(prev => ({ ...prev, travelStyle: '' }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validatePhoneNumber = (phone: string) => {
    // Simple validation - can be enhanced based on requirements
    return phone.length >= 10;
  };

  const validateDateOfBirth = (dob: string) => {
    // Simple validation - can be enhanced based on requirements
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dobRegex.test(dob);
  };

  const validateStep = (stepNumber: number) => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (stepNumber) {
      case 1:
        if (activeTab === 'email') {
          if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
          } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
          }

          if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
          } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
          }
        } else if (activeTab === 'phone') {
          if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
            isValid = false;
          } else if (!validatePhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
            isValid = false;
          }
        }
        break;

      case 2:
        if (!formData.fullName) {
          newErrors.fullName = 'Full name is required';
          isValid = false;
        }

        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required';
          isValid = false;
        } else if (!validateDateOfBirth(formData.dateOfBirth)) {
          newErrors.dateOfBirth = 'Please enter a valid date (YYYY-MM-DD)';
          isValid = false;
        }

        if (!formData.identityDocument) {
          newErrors.identityDocument = 'Identity document is required';
          isValid = false;
        }

        if (!formData.identityConfirmed) {
          newErrors.identityConfirmed = 'You must confirm your identity';
          isValid = false;
        }
        break;

      case 3:
        if (!formData.travelType) {
          newErrors.travelType = 'Please select your travel type';
          isValid = false;
        }

        if (formData.lookingFor.length === 0) {
          newErrors.lookingFor = 'Please select at least one option';
          isValid = false;
        }

        if (formData.travelStyle.length === 0) {
          newErrors.travelStyle = 'Please select at least one travel style';
          isValid = false;
        }
        break;

      case 4:
        if (!formData.bio) {
          newErrors.bio = 'Bio is required';
          isValid = false;
        }

        if (formData.topDestinations.length === 0) {
          newErrors.topDestinations = 'Please add at least one destination';
          isValid = false;
        }

        if (formData.languages.length === 0) {
          newErrors.languages = 'Please add at least one language';
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    try {
      setLoading(true);
      
      // Create form data for registration
      const registrationData = new FormData();
      
      // Add basic user data
      registrationData.append('email', formData.email.trim());
      registrationData.append('password', formData.password);
      registrationData.append('fullName', formData.fullName.trim());
      registrationData.append('dateOfBirth', formData.dateOfBirth);
      registrationData.append('travelType', formData.travelType);
      registrationData.append('lookingFor', JSON.stringify(formData.lookingFor));
      registrationData.append('travelStyle', JSON.stringify(formData.travelStyle));
      registrationData.append('bio', formData.bio || '');
      registrationData.append('languages', JSON.stringify(formData.languages));
      
      // Add identity document
      if (formData.identityDocument) {
        // Create the file object for React Native
        const uri = formData.identityDocument;
        const filename = uri.split('/').pop() || 'identity-document.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        registrationData.append('identityDocument', {
          uri,
          name: filename,
          type
        } as any);

        console.log('Sending registration request...');
        // Register user with all required data
        const resultAction = await dispatch(register(registrationData));
        
        console.log('Registration result:', resultAction);
        
        if (register.fulfilled.match(resultAction)) {
          console.log('Registration successful, navigating to Home');
          navigation.navigate('MainApp');
        } else {
          console.error('Registration failed:', resultAction.error);
          Alert.alert('Registration Failed', resultAction.error?.message || 'Please try again.');
        }
      } else {
        Alert.alert('Error', 'Identity document is required');
      }
    } catch (error:any) {
      console.error('Registration error details:', {
        message: error.message,
        error: error,
        stack: error.stack
      });
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // const handleImagePick = async () => {
  //   const options = {
  //     mediaType: 'photo' as const,
  //     includeBase64: true,
  //     maxHeight: 800,
  //     maxWidth: 800,
  //     selectionLimit: 5,
  //   };

  //   try {
  //     const result = await ImagePicker.launchImageLibrary(options);
      
  //     if (result.didCancel) {
  //       return;
  //     }

  //     if (result.errorCode) {
  //       Alert.alert('Error', result.errorMessage);
  //       return;
  //     }

  //     if (result.assets && result.assets.length > 0) {
  //       // Create form data for upload
  //       const formData = new FormData();
  //       result.assets.forEach((asset, index) => {
  //         if (asset.uri) {
  //           formData.append('photos', {
  //             uri: asset.uri,
  //             type: 'image/jpeg',
  //             name: `photo-${index}.jpg`,
  //           });
  //         }
  //       });

  //       // Update the form data with the selected photo URIs, filtering out any undefined URIs
  //       const photoUris = result.assets
  //         .map(asset => asset.uri)
  //         .filter((uri): uri is string => uri !== undefined);
        
  //       handleInputChange('profilePhotos', photoUris);
  //     }
  //   } catch (error) {
  //     console.error('Image picker error:', error);
  //     Alert.alert('Error', 'Failed to select images. Please try again.');
  //   }
  // };

  const handleIdentityDocumentPick = async () => {
    // const options = {
    //   mediaType: 'photo' as const,
    //   includeBase64: true,
    //   maxHeight: 800,
    //   maxWidth: 800,
    //   selectionLimit: 1,
    // };

    // try {
    //   const result = await ImagePicker.launchImageLibrary(options);
    //   console.log("result",result)
    //   if (result.didCancel) {
    //     return;
    //   }

    //   if (result.errorCode) {
    //     Alert.alert('Error', result.errorMessage);
    //     return;
    //   }

    //   if (result.assets && result.assets[0]?.uri) {
    //     // Update the form data with the selected document URI and base64 data
    //     handleInputChange('identityDocument', result.assets[0].uri);
    //   }
    // } catch (error) {
    //   console.error('Identity document picker error:', error);
    //   Alert.alert('Error', 'Failed to select identity document. Please try again.');
    // }
    const document = await pickImage(true); // include base64 to send to backend
    if (document) {
      // setIdentityDocUri(document.uri);
      handleInputChange('identityDocument', document.uri);
      // send `document.base64` to backend if needed
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.card}>
            <View style={styles.tabsContainer}>
              {['email', 'phone', 'social'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    activeTab === tab && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === 'email' && (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email address</Text>
                  <CommonTextInput
                    testID="email-input"
                    style={[styles.input, errors.email ? styles.inputError : null]}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                  />
                  {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Create password</Text>
                  <CommonTextInput
                    testID="password-input"
                    style={[styles.input, errors.password ? styles.inputError : null]}
                    placeholder="Create a secure password"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                  />
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                </View>
              </View>
            )}

            {activeTab === 'phone' && (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone number</Text>
                   <CommonTextInput
                    testID="phone-input"
                    style={[styles.input, errors.phoneNumber ? styles.inputError : null]}
                    placeholder="+1 (555) 000-0000"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                  />
                  {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
                </View>
                <Text style={styles.helperText}>
                  We'll send you a verification code
                </Text>
              </View>
            )}

            {activeTab === 'social' && (
              <View style={styles.tabContent}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.socialButtonText}>
                    Continue with Facebook
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                  <Text style={styles.socialButtonText}>
                    Continue with Instagram
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={nextStep}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.card}>
            <View style={styles.uploadContainer}>
              {/* <View style={styles.uploadIconContainer}>
                <Ionicons name="add-circle-outline" size={40} color="#9CA3AF" />
              </View> */}
              <Text style={styles.uploadText}>
                Upload a selfie or photo ID
              </Text>
              <TouchableOpacity 
                style={[styles.uploadButton, errors.identityDocument ? styles.inputError : null]}
                onPress={handleIdentityDocumentPick}
              >
                <Text style={styles.uploadButtonText}>Choose file</Text>
              </TouchableOpacity>
              {formData.identityDocument && (
                <View style={styles.selectedDocumentContainer}>
                  <Image 
                    source={{ uri: formData.identityDocument }} 
                    style={styles.selectedDocumentPreview}
                    resizeMode="cover"
                  />
                  {/* <Text style={styles.selectedDocumentText}>Document selected</Text> */}
                </View>
              )}
              {errors.identityDocument ? <Text style={styles.errorText}>{errors.identityDocument}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full legal name</Text>
              <CommonTextInput
                testID="full-name-input"
                style={[styles.input, errors.fullName ? styles.inputError : null]}
                placeholder="As it appears on your ID"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of birth</Text>
              <CommonTextInput
                testID="date-of-birth-input"
                style={[styles.input, errors.dateOfBirth ? styles.inputError : null]}
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              />
              {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => handleInputChange('identityConfirmed', !formData.identityConfirmed)}
                testID='identity-confirm-checkbox'
              >
                {formData.identityConfirmed ? (
                  <Ionicons name="checkbox" size={24} color="#F43F5E" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="#374151" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I confirm this is my real identity and information
              </Text>
            </View>
            {errors.identityConfirmed ? <Text style={styles.errorText}>{errors.identityConfirmed}</Text> : null}

            <View style={styles.cardFooter}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={nextStep}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.card}>
            <View style={styles.preferenceSection}>
              <Text style={styles.label}>I travel as a:</Text>
              <View style={styles.gridContainer}>
                {['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad'].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.preferenceButton,
                        formData.travelType === type && styles.preferenceButtonActive,
                      ]}
                      onPress={() => handleTravelTypeSelect(type)}
                      testID={`travel-type-${type.toLowerCase().replace(/ /g, '-')}`}
                    >
                      <Text 
                        style={[
                          styles.preferenceButtonText,
                          formData.travelType === type && styles.preferenceButtonTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
              {errors.travelType ? <Text style={styles.errorText}>{errors.travelType}</Text> : null}
            </View>

            <View style={styles.preferenceSection}>
              <Text style={styles.label}>I'm looking for:</Text>
              <View style={styles.gridContainer}>
                {[
                  'Romance',
                  'Friendship',
                  'Adventure Partners',
                  'Local Guides',
                ].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.preferenceButton,
                      formData.lookingFor.includes(type) && styles.preferenceButtonActive,
                    ]}
                    onPress={() => handleLookingForSelect(type)}
                    testID={`looking-for-${type.toLowerCase().replace(' ', '-')}`}
                  >
                    <Text 
                      style={[
                        styles.preferenceButtonText,
                        formData.lookingFor.includes(type) && styles.preferenceButtonTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.lookingFor ? <Text style={styles.errorText}>{errors.lookingFor}</Text> : null}
            </View>

            <View style={styles.preferenceSection}>
              <Text style={styles.label}>My travel style:</Text>
              <View style={styles.gridContainer}>
                {[
                  'Luxury',
                  'Budget',
                  'Adventure',
                  'Cultural',
                  'Relaxation',
                  'Foodie',
                ].map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.preferenceButton,
                      formData.travelStyle.includes(style) && styles.preferenceButtonActive,
                    ]}
                    onPress={() => handleTravelStyleSelect(style)}
                  >
                    <Text 
                      style={[
                        styles.preferenceButtonText,
                        formData.travelStyle.includes(style) && styles.preferenceButtonTextActive,
                      ]}
                    >
                      {style}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.travelStyle ? <Text style={styles.errorText}>{errors.travelStyle}</Text> : null}
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={nextStep}
                  disabled={loading}
                  // testID="continue-button"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.card}>
            {/* <View style={styles.uploadContainer}>
              <View style={styles.uploadIconContainer}>
                <Ionicons name="person-outline" size={40} color="#9CA3AF" />
              </View>
              <Text style={styles.uploadText}>Upload profile photos</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleImagePick}
              >
                <Text style={styles.uploadButtonText}>Add photos</Text>
              </TouchableOpacity>
              {formData.profilePhotos.length > 0 && (
                <View style={styles.selectedPhotosContainer}>
                  <Text style={styles.selectedPhotosText}>
                    {formData.profilePhotos.length} photos selected
                  </Text>
                </View>
              )}
            </View> */}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <CommonTextInput
                testID="bio-input"
                style={[styles.input, styles.textArea, errors.bio ? styles.inputError : null]}
                placeholder="Tell potential matches about yourself and your travel dreams..."
                multiline
                numberOfLines={4}
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
              />
              {errors.bio ? <Text style={styles.errorText}>{errors.bio}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Top destinations I want to visit:
              </Text>
              <CommonTextInput
                testID="destinations-input"
                style={[styles.input, errors.topDestinations ? styles.inputError : null]}
                placeholder="Add destinations (comma separated)"
                value={formData.topDestinations.join(', ')}
                onChangeText={(value) => handleInputChange('topDestinations', value.split(',').map(d => d.trim()))}
              />
              {errors.topDestinations ? <Text style={styles.errorText}>{errors.topDestinations}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Languages I speak:</Text>
              <CommonTextInput
               testID="languages-input"
               style={[styles.input, errors.languages ? styles.inputError : null]}
               placeholder="Add languages (comma separated)"
               value={formData.languages.join(', ')}
               onChangeText={(value) => handleInputChange('languages', value.split(',').map(l => l.trim()))}
              />
              {errors.languages ? <Text style={styles.errorText}>{errors.languages}</Text> : null}
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleSubmit}
                  disabled={loading}
                  testID="complete-profile-button"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Complete Profile</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#fff1f2', '#e0f2fe']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back-outline" size={20} color="#4B5563" />
              <Text style={styles.backButtonText}>Back to home</Text>
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              {[...Array(totalSteps)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index + 1 <= step && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.title}>
              {step === 1 && 'Create your account'}
              {step === 2 && 'Verify your identity'}
              {step === 3 && 'Travel preferences'}
              {step === 4 && 'Almost there!'}
            </Text>

            <Text style={styles.subtitle}>
              {step === 1 && 'Choose how youd like to register'}
              {step === 2 && 'Help us keep the community safe'}
              {step === 3 && 'Tell us about your travel style'}
              {step === 4 && 'Set up your profile details'}
            </Text>

            {/* {authError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{authError}</Text>
              </View>
            )} */}

            {renderStepContent()}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#4B5563',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#F43F5E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#F43F5E',
  },
  tabText: {
    color: '#6B7280',
    fontSize: 14,
  },
  activeTabText: {
    color: '#F43F5E',
    fontWeight: '600',
  },
  tabContent: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 12,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  cardFooter: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#F43F5E',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  uploadButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  preferenceSection: {
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  preferenceButton: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
  },
  preferenceButtonActive: {
    borderColor: '#F43F5E',
    backgroundColor: '#FEF2F2',
  },
  preferenceButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  preferenceButtonTextActive: {
    color: '#F43F5E',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  selectedPhotosContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  selectedPhotosText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  selectedDocumentContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  selectedDocumentPreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedDocumentText: {
    fontSize: 14,
    color: '#4B5563',
  },
});
