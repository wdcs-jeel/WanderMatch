import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import Realm from 'realm';
import { travelSchema } from '../../utils/realm/AddTripRealmSchema';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, scale } from 'react-native-size-matters';
import { Swipeable } from 'react-native-gesture-handler';
import { Place, getUser } from '../../utils/types/types';
import { NavigationProp } from '../../utils/navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deletePlace, setTripAdded, syncPlace } from '../../redux/slice/tripSlice';


export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [realmPlaces, setRealmPlaces] = useState<Place[]>([]);
  const [source, setSource] = useState<'realm' | 'server'>('realm');
  const { user } = useSelector((state: RootState) => state.auth);
  const trips = useSelector((state: RootState) => state.trips.trips);
  const tripAdded = useSelector((state: RootState) => state.trips.tripAdded);
  const dispatch = useDispatch<AppDispatch>();
  const displayedPlaces = source === 'server' ? trips : realmPlaces;
  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        if (user && user._id) {
          // First-time load or always load Realm
          await loadRealmPlaces(user._id);
  
          // If coming back from AddTrip, fetch server data
          if (tripAdded) {
           setSource('server')
           await dispatch(setTripAdded(false));
          }
        }
      };
  
      load();
    }, [user, tripAdded])
  );
  const addTripDetail = () =>{
    navigation.navigate('AddTrip')
  }
  const loadRealmPlaces = async (userId: any) => {
    console.log("iinside ralm",userId)
      Realm.open({ path: 'placeRealm.realm', schema: [travelSchema] }).then(r => {
        const results = r.objects<Place>('Place').filtered('userId == $0', userId);

        console.log('Stored places:', JSON.stringify(results));
        const plainResults = results.map(item => ({ ...item }));
        setRealmPlaces(plainResults);

        setSource('realm');
      });
  };
  const fetchTripsFromServer = async () => {
    try {
      console.log("sync",user?._id)
      const resultAction = await dispatch(syncPlace(user?._id));
      if (syncPlace.fulfilled.match(resultAction)) {
        setSource('server');
      }
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    }
  };

  const renderRightActions = (tripId: number) => (
    <TouchableOpacity
      onPress={() => confirmDelete(tripId)}
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '90%',
        borderTopLeftRadius:15,
        borderBottomLeftRadius:15
      }}
    >
      <Text style={{ color: 'white' }}>Delete</Text>
    </TouchableOpacity>
  );
  const confirmDelete = (tripId: number) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this place?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(tripId), // call actual delete
        },
      ],
      { cancelable: true }
    );
  };
  const handleDelete = async(tripId: number) => {
    try {
      const realm = await Realm.open({ path: 'placeRealm.realm', schema: [travelSchema] });
      const safePlaces = realm.objects<Place>('Place').map(item => ({ ...item }));
      realm.write(() => {
        const tripToDelete = realm.objectForPrimaryKey('Place', tripId);
        if (tripToDelete && tripToDelete.isValid()) {
          realm.delete(tripToDelete);
        }
      });

      await dispatch(deletePlace(tripId));
      const updated = safePlaces.filter((p) => p._id !== tripId);
      setRealmPlaces(updated);
      setSource('realm')
    } catch (err) {
      console.error('Delete error:', err);
    }
  }
  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                {/* <Text style={styles.backButtonText}>Back</Text> */}
              </TouchableOpacity>
              <Text style={styles.title}>Explored places</Text>
      </View>
      {/* <Text testID="hello-text" style={styles.text}>ExploreScreen</Text> */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',width:'100%'}}>
        <TouchableOpacity onPress={addTripDetail}>
        <View style={{ flexDirection: 'row', gap:8,alignItems: 'center',backgroundColor:'#F43F5E', margin:scale(10),padding: scale(8), borderRadius: 8}}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={{color:'white'}}>Add Trip</Text>
        </View>   
        </TouchableOpacity>
       
      <TouchableOpacity onPress={fetchTripsFromServer}>
        <View style={{ flexDirection: 'row',gap:8, alignItems: 'center',backgroundColor:'#F43F5E', margin:scale(10),padding: scale(8), borderRadius: 8}}>
          {/* <Ionicons name size={24} color="white" /> */}
          <Ionicons name="sync-outline" size={24} color="white" />
          <Text style={{color:'white'}}>Sync Trip</Text>
        </View>   
        </TouchableOpacity>
      </View>
      <View style={styles.container1}>
      {displayedPlaces.length === 0 ? (
        <Text>No data found</Text>
      ) : (
      <FlatList
       data={displayedPlaces}
       keyExtractor={(item, index) => (item._id !== undefined ? item._id.toString() : `fallback-${index}`)}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item._id)}>
          <View style={styles.card}>
            <Text style={styles.titlecard} >
              Place I explored {item.placeName}
            </Text>
            <Text >
              My experience {item.experience}
            </Text>
            <Text >
              I explored this place with my {item.travelWith} 
            </Text>
            <Text >
              I travelled by {item.travelBy}
            </Text>        
          </View>
          </Swipeable>
        )}
      />)}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF2F8',
  },
  text: {
    fontSize: 18,
    color: '#111827',
  },
  container1: { flex: 1, width:'100%' },
  // item: { padding: 10, borderBottomWidth: 1 },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: 16,
    marginBottom: 16,
    // width: '100%',
    borderRadius: 12,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#fff',
      width: '100%',
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
    title: {
      fontSize: moderateScale(20),
      fontWeight: 'bold',
      color: '#F43F5E',
    },
    titlecard: {
      fontSize: moderateScale(15),
      // fontWeight: 'bold',
      color: 'black',
    },
}); 