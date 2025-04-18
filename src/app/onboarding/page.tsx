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
} from 'react-native';
import  LinearGradient  from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft, LucideProps } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined
  Dashboard: undefined
  Onboarding: undefined
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList>
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('email');
  const navigation = useNavigation<NavigationProp>()
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
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
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Create password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a secure password"
                    secureTextEntry
                  />
                </View>
              </View>
            )}

            {activeTab === 'phone' && (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+1 (555) 000-0000"
                    keyboardType="phone-pad"
                  />
                </View>
                <Text style={styles.helperText}>
                  We'll send you a verification code
                </Text>
              </View>
            )}

            {activeTab === 'social' && (
              <View style={styles.tabContent}>
                <TouchableOpacity style={styles.socialButton}>
                  {/* <Ionicons name="logo-facebook" size={20} color="#1877F2" /> */}
                  <Text style={styles.socialButtonText}>
                    Continue with Facebook
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  {/* <Ionicons name="logo-instagram" size={20} color="#E4405F" /> */}
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
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
                {/* <Ionicons name="arrow-forward" size={20} color="#fff" /> */}
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
              <View style={styles.uploadIconContainer}>
                {/* <Ionicons name="add-circle-outline" size={40} color="#9CA3AF" /> */}
              </View>
              <Text style={styles.uploadText}>
                Upload a selfie or photo ID
              </Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Choose file</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full legal name</Text>
              <TextInput
                style={styles.input}
                placeholder="As it appears on your ID"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of birth</Text>
              <TextInput
                style={styles.input}
                placeholder="Select date"
                // Add date picker here
              />
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkbox}>
                {/* <Ionicons name="square-outline" size={24} color="#374151" /> */}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I confirm this is my real identity and information
              </Text>
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
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
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
                      style={styles.preferenceButton}
                    >
                      <Text style={styles.preferenceButtonText}>{type}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
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
                    style={styles.preferenceButton}
                  >
                    <Text style={styles.preferenceButtonText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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
                    style={styles.preferenceButton}
                  >
                    <Text style={styles.preferenceButtonText}>{style}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.card}>
            <View style={styles.uploadContainer}>
              <View style={styles.uploadIconContainer}>
                {/* <Ionicons name="person-outline" size={40} color="#9CA3AF" /> */}
              </View>
              <Text style={styles.uploadText}>Upload profile photos</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Add photos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell potential matches about yourself and your travel dreams..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Top destinations I want to visit:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Add destinations"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Languages I speak:</Text>
              <TextInput
                style={styles.input}
                placeholder="Add languages"
              />
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
                  onPress={() => navigation.navigate('Dashboard')}
                >
                  <Text style={styles.primaryButtonText}>Complete Profile</Text>
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
               <ArrowLeft {...({ size: 24, color: "#4B5563" } as LucideProps)} />
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
  preferenceButtonText: {
    color: '#374151',
    fontSize: 14,
  },
});
