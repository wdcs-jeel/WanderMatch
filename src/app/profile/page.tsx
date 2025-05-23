"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp } from '../../utils/navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/slice/authSlice';

interface PhotoItem {
  uri: string;
}

interface TripItem {
  title: string;
  date: string;
  companions: string;
  status: 'Completed' | 'Upcoming';
}

interface ReviewItem {
  name: string;
  date: string;
  rating: number;
  text: string;
}

type TabData = PhotoItem[] | TripItem[] | ReviewItem[];

export default function ProfilePage() {
 const navigation = useNavigation<NavigationProp>();
const user = useSelector((state: RootState) => state.auth.user);
const dispatch = useDispatch<AppDispatch>();
 const [activeTab, setActiveTab] = useState('Trips');
 const [numColumns, setNumColumns] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedPhotos, setDisplayedPhotos] = useState<PhotoItem[]>([]);
  const [page, setPage] = useState(1);
  const PHOTOS_PER_PAGE = 9;
  const photoUrls: PhotoItem[] = [
    { uri: 'https://vaya.in/wp-content/uploads/2021/01/Top-10-Ideas-to-Make-the-Road-Trips-More-Fun.jpg' },
    { uri: 'https://www.mistay.in/travel-blog/content/images/2020/05/cover-9.jpg' },
    { uri: 'https://vaya.in/wp-content/uploads/2021/01/Top-10-Ideas-to-Make-the-Road-Trips-More-Fun.jpg' },
    { uri: 'https://www.mistay.in/travel-blog/content/images/2020/05/cover-9.jpg' },
    { uri: 'https://www.mistay.in/travel-blog/content/images/2020/05/cover-9.jpg' },
    { uri: 'https://vaya.in/wp-content/uploads/2021/01/Top-10-Ideas-to-Make-the-Road-Trips-More-Fun.jpg' },
    { uri: 'https://www.mistay.in/travel-blog/content/images/2020/05/cover-9.jpg' },
    { uri: 'https://vaya.in/wp-content/uploads/2021/01/Top-10-Ideas-to-Make-the-Road-Trips-More-Fun.jpg' },
    { uri: 'https://vaya.in/wp-content/uploads/2021/01/Top-10-Ideas-to-Make-the-Road-Trips-More-Fun.jpg' },
   
  ];

  // Initialize displayed photos when component mounts or tab changes to Photos
  React.useEffect(() => {
    if (activeTab === 'Photos') {
      setDisplayedPhotos(photoUrls.slice(0, PHOTOS_PER_PAGE));
      setPage(2);
    }
  }, [activeTab]);


  const loadMorePhotos = useCallback(() => {
    if (activeTab !== 'Photos' || isLoading) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PHOTOS_PER_PAGE;
    const endIndex = startIndex + PHOTOS_PER_PAGE;
    const newPhotos = photoUrls.slice(startIndex, endIndex);

    if (newPhotos.length > 0) {
      setDisplayedPhotos(prev => [...prev, ...newPhotos]);
      setPage(nextPage);
    }
    setIsLoading(false);
  }, [page, isLoading, activeTab]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#F43F5E" />
      </View>
    );
  };

 const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              dispatch(logout());
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

 const handleEditProfile = () => {
  navigation.navigate('EditProfile');
};

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setNumColumns(tab === 'Photos' ? 3 : 1);
  };

  // const listKey = useMemo(() => `list-${activeTab}-${numColumns}`, [activeTab, numColumns]);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#FB7185', '#38BDF8']}
            style={styles.headerGradient}
          />
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.identityDocument?.data
                  ? { uri: `data:${user.identityDocument.contentType};base64,${user.identityDocument.data}` }
                  : { uri: `https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740` }
              }
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user?.fullName || 'Traveler'}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark-outline" size={20} color="black" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="black" />
            <Text style={styles.locationText}>San Francisco, California</Text>
          </View>

          <View style={styles.actionButtons}>
          <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={handleEditProfile}
            >
              <Ionicons name="create-outline" size={24} color="black" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.messageButton]} 
            onPress={() => navigation.navigate('Feedback')}
          >
              <Ionicons name="chatbubbles" size={24} color="white" />
              <Text style={styles.messageButtonText}>Feedback</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About Me</Text>
          <Text style={styles.aboutText}>
            {user?.bio || 'Digital nomad and adventure enthusiast. I love exploring new cultures, trying local cuisines, and meeting fellow travelers.'}
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="earth-outline" size={20} color="black" />
              <Text style={styles.infoText}>{user?.travelType || 'Traveler'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="black" />
              <Text style={styles.infoText}>Member since 2023</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="star-half-outline" size={20} color="black" />
              <Text style={styles.infoText}>4.9 Rating</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="heart-outline" size={20} color="black" />
              <Text style={styles.infoText}>
                {user?.lookingFor?.join(', ') || 'Looking for connections'}
              </Text>
            </View>
          </View>

          <View style={styles.connectedAccounts}>
            <Text style={styles.connectedAccountsTitle}>Connected Accounts</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                <Text style={styles.socialButtonText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="musical-notes-outline" size={20} color="blue" />
                <Text style={styles.socialButtonText}>Spotify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Photos' && styles.activeTab]}
            onPress={() => handleTabChange('Photos')}
            >
              <Text style={[styles.tabText, activeTab === 'Photos' && styles.activeTabText]}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Trips' && styles.activeTab]}
            onPress={() => handleTabChange('Trips')}
            >
              <Text style={[styles.tabText, activeTab === 'Trips' && styles.activeTabText]}>Trips</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Reviews' && styles.activeTab]}
            onPress={() => handleTabChange('Reviews')}
            >
              <Text style={[styles.tabText, activeTab === 'Reviews' && styles.activeTabText]}>Reviews</Text>
            </TouchableOpacity>
          </View>
      </View>
    </>
  );
  const PhotoItemRenderer = ({ uri }: { uri: string }) => {
    const getColorFromImage = (url: string) => {
      if (url.includes('red') || url.includes('F43F5E')) return '#F43F5E';
      if (url.includes('blue') || url.includes('38BDF8')) return '#38BDF8';
      if (url.includes('green') || url.includes('10B981')) return '#10B981';
      if (url.includes('yellow') || url.includes('FCD34D')) return '#FCD34D';
      if (url.includes('purple') || url.includes('8B5CF6')) return '#8B5CF6';
      if (url.includes('pink') || url.includes('EC4899')) return '#EC4899';
      if (url.includes('orange') || url.includes('F97316')) return '#F97316';
      return '#1F2937';
    };

    const shadowColor = getColorFromImage(uri);

    const shadowStyle = useMemo(() => ({
      ...Platform.select({
        ios: {
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.8,
          shadowRadius: 20,
        },
        android: {
          elevation: 24,
          backgroundColor: '#fff',
        },
      }),
    }), [shadowColor]);

    return (
      <View style={styles.photoItemContainer}>
        {Platform.OS === 'android' && (
          <View style={[styles.androidShadow, { backgroundColor: shadowColor + '40' }]} />
        )}
        <View style={[styles.photoItem, shadowStyle]}>
          <View style={styles.photoInnerContainer}>
            <Image 
              source={{ uri }} 
              style={styles.photoImage} 
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)']}
              style={styles.gradientOverlay}
            />
          </View>
        </View>
      </View>
    );
  };
  
  const renderItem = ({ item, index }: { item: PhotoItem | TripItem | ReviewItem; index: number }) => {
    if (activeTab === 'Photos') {
      const photoItem = item as PhotoItem;
      return <PhotoItemRenderer uri={photoItem.uri} />;
    } else if (activeTab === 'Trips') {
      const tripItem = item as TripItem;
      return (
        <View style={styles.tripCard}>
          <View style={styles.tripCardContent}>
            <View style={styles.tripImageContainer}>
              <Image
                source={{ uri: `https://vaya.in/wp-content/uploads/2021/01/Top-10-Ideas-to-Make-the-Road-Trips-More-Fun.jpg` }}
                style={styles.tripImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>{tripItem.title}</Text>
              <View style={styles.tripDateContainer}>
                <Text style={styles.tripDateText}>{tripItem.date}</Text>
              </View>
              <View style={styles.tripCompanionsContainer}>
                <Text style={styles.tripCompanionsText}>{tripItem.companions}</Text>
              </View>
            </View>
            <View style={[styles.tripBadge, { backgroundColor: tripItem.status === 'Upcoming' ? '#10B981' : '#6B7280' }]}>
              <Text style={styles.tripBadgeText}>{tripItem.status}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      const reviewItem = item as ReviewItem;
      return (
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewerAvatar}>
              <Image
                source={{ uri: `https://vaya.in/wp-content/uploads/2021/01/Top-10-Ideas-to-Make-the-Road-Trips-More-Fun.jpg` }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>{reviewItem.name}</Text>
              <View style={styles.reviewDateContainer}>
                <Text style={styles.reviewDateText}>{reviewItem.date}</Text>
              </View>
            </View>
            <View style={styles.reviewStars}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={styles.starContainer}>
                  <View style={[styles.star, { backgroundColor: i < reviewItem.rating ? '#FCD34D' : '#D1D5DB' }]} />
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.reviewText}>{reviewItem.text}</Text>
        </View>
      );
    }
  };

  const getData = (): TabData => {
    if (activeTab === 'Photos') {
      return displayedPhotos;
    } else if (activeTab === 'Trips') {
      return [
        { title: 'Bali Adventure', date: 'June 15-22, 2023', companions: '3 companions', status: 'Completed' },
        { title: 'European Backpacking', date: 'August 5-20, 2023', companions: '2 companions', status: 'Upcoming' },
        { title: 'Japan Explorer', date: 'October 10-25, 2023', companions: 'Solo', status: 'Upcoming' },
      ];
    } else {
      return [
        { name: 'Sarah Johnson', date: 'May 12, 2023', rating: 5, text: 'Amazing travel companion! We had such a great time exploring Tokyo together.' },
        { name: 'Michael Chen', date: 'April 5, 2023', rating: 4, text: 'Great experience traveling with this person. Very organized and friendly.' },
        { name: 'Emma Wilson', date: 'March 18, 2023', rating: 5, text: 'One of the best travel experiences I\'ve had. Highly recommend!' },
      ];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        key={activeTab}
        data={getData()}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${activeTab}-${index}`}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        numColumns={activeTab === 'Photos' ? 3 : 1}
        columnWrapperStyle={activeTab === 'Photos' ? styles.photoRow : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        extraData={[activeTab, displayedPhotos]}
        onEndReached={activeTab === 'Photos' ? loadMorePhotos : undefined}
        onEndReachedThreshold={0.5}
      />
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
    padding: scale(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: moderateScale(14),
    color: '#4B5563',
    marginLeft: scale(8),
  },
  headerButtons: {
    flexDirection: 'row',
    gap: scale(12),
  },
  iconButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    position: 'relative',
    height: verticalScale(160),
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -verticalScale(64),
    left: '50%',
    marginLeft: -scale(64),
    width: scale(128),
    height: scale(128),
    borderRadius: scale(64),
    borderWidth: 4,
    borderColor: '#fff',
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
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginTop: verticalScale(80),
    paddingHorizontal: scale(16),
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  name: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#111827',
    marginRight: scale(8),
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(4),
  },
  verifiedText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginLeft: scale(4),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  locationText: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    marginLeft: scale(4),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: scale(16),
    marginBottom: verticalScale(24),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    gap: scale(8),
  },
  messageButton: {
    backgroundColor: '#F43F5E',
  },
  messageButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: verticalScale(24),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(16),
    marginHorizontal: scale(16),
    marginBottom: verticalScale(24),
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
  aboutTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#111827',
    marginBottom: verticalScale(8),
  },
  aboutText: {
    fontSize: moderateScale(14),
    color: '#4B5563',
    marginBottom: verticalScale(16),
    lineHeight: verticalScale(20),
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(16),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: verticalScale(12),
  },
  infoText: {
    fontSize: moderateScale(14),
    color: '#4B5563',
    marginLeft: scale(8),
  },
  connectedAccounts: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: verticalScale(16),
  },
  connectedAccountsTitle: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  socialButtons: {
    flexDirection: 'row',
    gap: scale(12),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(20),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
  },
  socialButtonText: {
    fontSize: moderateScale(12),
    color: '#374151',
    marginLeft: scale(8),
  },
  tabsContainer: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(4),
    marginBottom: verticalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    borderRadius: scale(8),
  },
  activeTab: {
    backgroundColor: '#F43F5E',
  },
  tabText: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(16),
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
  photoRow: {
    justifyContent: 'space-between',
    marginBottom: scale(8),
    paddingHorizontal: scale(8),
  },
  photoItemContainer: {
    width: scale(100),
    height: scale(100),
    marginBottom: scale(8),
    padding: scale(4),
    position: 'relative',
  },
  androidShadow: {
    position: 'absolute',
    top: scale(4),
    left: scale(4),
    right: scale(4),
    bottom: scale(4),
    borderRadius: scale(12),
    zIndex: 1,
  },
  photoItem: {
    width: '100%',
    height: '100%',
    borderRadius: scale(12),
    backgroundColor: '#ffffff',
    zIndex: 2,
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
      },
    }),
  },
  photoInnerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: scale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tripCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tripImageContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(8),
    overflow: 'hidden',
    marginRight: scale(12),
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#111827',
    marginBottom: verticalScale(4),
  },
  tripDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  tripDateText: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginLeft: scale(4),
  },
  tripCompanionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripCompanionsText: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginLeft: scale(4),
  },
  tripBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(4),
  },
  tripBadgeText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  reviewerAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    overflow: 'hidden',
    marginRight: scale(12),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#111827',
    marginBottom: verticalScale(2),
  },
  reviewDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDateText: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginLeft: scale(4),
  },
  reviewStars: {
    flexDirection: 'row',
  },
  starContainer: {
    marginLeft: scale(2),
  },
  star: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
  },
  reviewText: {
    fontSize: moderateScale(14),
    color: '#4B5563',
    lineHeight: verticalScale(20),
  },
  bottomNavigation: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(8),
  },
  navText: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginTop: verticalScale(4),
    fontWeight: '500',
  },
  activeNavText: {
    color: '#F43F5E',
    fontWeight: '600',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  editButtonText: {
    color: '#374151',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: verticalScale(24),
  },
  loaderContainer: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
});
