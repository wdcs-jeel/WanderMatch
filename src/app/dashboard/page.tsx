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
  FlatList,
} from 'react-native';
import  LinearGradient  from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('discover');
  const navigation = useNavigation();

  const mockProfiles = [
    {
      id: 1,
      name: 'Emma',
      age: 28,
      location: 'Paris, France',
      distance: 'Currently there',
      bio: 'Adventure seeker looking for someone to explore the city of lights with me!',
      compatibility: 92,
      travelStyle: 'Explorer',
      images: ['/placeholder.svg?height=400&width=300'],
      verified: true,
    },
    {
      id: 2,
      name: 'James',
      age: 31,
      location: 'Bali, Indonesia',
      distance: 'Planning trip in 2 weeks',
      bio: 'Digital nomad seeking travel companions for island hopping and surfing.',
      compatibility: 85,
      travelStyle: 'Nomad',
      images: ['/placeholder.svg?height=400&width=300'],
      verified: true,
    },
    {
      id: 3,
      name: 'Sophia',
      age: 26,
      location: 'Tokyo, Japan',
      distance: 'Currently there',
      bio: 'Foodie and culture enthusiast looking for someone to share amazing experiences.',
      compatibility: 78,
      travelStyle: 'Cultural',
      images: ['/placeholder.svg?height=400&width=300'],
      verified: false,
    },
  ];

  const renderProfileCard = ({ item }:any) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {/* <Image
          source={{ uri: item.images[0] }}
          style={styles.profileImage}
          resizeMode="cover"
        /> */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        >
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.travelStyleBadge]}>
              <Text style={styles.badgeText}>{item.travelStyle}</Text>
            </View>
            {item.verified && (
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Ionicons name="shield-checkmark" size={12} color="#fff" />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <View>
              <Text style={styles.profileName}>
                {item.name}, {item.age}
              </Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
              <Text style={styles.distanceText}>{item.distance}</Text>
            </View>
            <View style={styles.compatibilityBadge}>
              <Text style={styles.compatibilityText}>{item.compatibility}% Match</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.bioText}>{item.bio}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.messageButton]}>
            <Ionicons name="chatbubble-outline" size={16} color="#374151" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.connectButton]}>
            <Ionicons name="heart" size={16} color="#fff" />
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = (icon:any, title:any, description:any, buttonText:any) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name={icon} size={24} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDescription}>{description}</Text>
      <TouchableOpacity style={styles.emptyStateButton}>
        <Text style={styles.emptyStateButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WanderMatch</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations or travelers"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {['all', 'nearby', 'popular', 'new', 'verified'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.activeFilterChipText,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.tabs}>
          {['discover', 'matches', 'trips'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'discover' && (
          <FlatList
            data={mockProfiles}
            renderItem={renderProfileCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.profileList}
          />
        )}

        {activeTab === 'matches' &&
          renderEmptyState(
            'heart',
            'No matches yet',
            'Start connecting with travelers to see your matches here',
            'Discover Travelers'
          )}

        {activeTab === 'trips' &&
          renderEmptyState(
            'compass',
            'No trips planned',
            'Create or join a trip to start your adventure',
            'Plan a Trip'
          )}
      </View>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home" size={24} color="#F43F5E" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="search" size={24} color="#6B7280" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="chatbubbles" size={24} color="#6B7280" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person" size={24} color="#6B7280" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F43F5E',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#374151',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    marginBottom: 15,
  },
  activeFilterChip: {
    backgroundColor: '#F43F5E',
    borderColor: '#F43F5E',
  },
  filterChipText: {
    fontSize: 12,
    color: '#374151',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#F43F5E',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#F43F5E',
    fontWeight: '600',
  },
  profileList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
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
  imageContainer: {
    height: 384,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  travelStyleBadge: {
    backgroundColor: '#F43F5E',
  },
  verifiedBadge: {
    backgroundColor: '#3B82F6',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  distanceText: {
    color: '#E5E7EB',
    fontSize: 12,
    marginTop: 4,
  },
  compatibilityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  compatibilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    padding: 16,
  },
  bioText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  messageButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  connectButton: {
    backgroundColor: '#F43F5E',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    height: '78%',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#F43F5E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNavigation: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  activeNavText: {
    color: '#F43F5E',
  },
});
