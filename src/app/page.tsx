import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function HomePage() {
const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#fff1f2', '#e0f2fe']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.blurEffect1} />
            <View style={styles.blurEffect2} />
            <Text style={styles.title}>
              Wander<Text style={styles.highlight}>Match</Text>
            </Text>
            <Text style={styles.subtitle}>
              Connect with travelers who share your wanderlust
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/placeholder.png')} // Replace with your image URL
              style={{ width: 384, height: 256 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.imageOverlay}
            >
              <View style={styles.imageTextContainer}>
                <Text style={styles.imageSubtext}>Find your perfect</Text>
                <Text style={styles.imageTitle}>Travel Companion</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>
                I already have an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 WanderMatch. All rights reserved.</Text>
        </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  blurEffect1: {
    position: 'absolute',
    top: -64,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  blurEffect2: {
    position: 'absolute',
    top: 32,
    left: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  highlight: {
    color: '#f43f5e',
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 256,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  imageTextContainer: {
    alignItems: 'flex-start',
  },
  imageSubtext: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  imageTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#f43f5e',
    padding: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
