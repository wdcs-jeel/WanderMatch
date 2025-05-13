import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import Realm from 'realm';
import { travelSchema } from '../../utils/realm/AddTripRealmSchema';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, scale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
type RootStackParamList = {
  AddTrip:undefined
};
interface User {
  _id: string;
}
type Place = {
  _id: number,
  placeName: 'string',
  experience: 'string',
  travelWith: 'string',
  travelBy : 'string',
  userId : 'string'
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [realmPlaces, setRealmPlaces] = useState<Place[]>([]);
  const [serverPlaces, setServerPlaces] = useState<Place[]>([]);
  const [source, setSource] = useState<'realm' | 'server'>('realm');
  const [user, setUser] = useState<User | null>(null);
  useEffect(()=>{
    const getUserId = async() => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (jsonValue != null) {
          const parsedUser = JSON.parse(jsonValue);
          console.log("--parsed",parsedUser)
          setUser(parsedUser); // set user object in state
        }
      } catch (e) {
        console.error('Failed to fetch user data', e);
      }
    }
    getUserId();
  },[])
  useFocusEffect(
    React.useCallback(() => {
      if (user && user._id) {
        loadRealmPlaces(user._id);
      }
    }, [user])
  );
  const addTripDetail = () =>{
    navigation.navigate('AddTrip')
  }
  const loadRealmPlaces = async (userId: any) => {
    console.log("iinside ralm",userId)
      Realm.open({ path: 'placeRealm.realm', schema: [travelSchema] }).then(r => {
        const results = r.objects<Place>('Place').filtered('userId == $0', userId);
        console.log('Stored places:', JSON.stringify(results));
        setRealmPlaces([...results]);
        setSource('realm');
      });
  };
  const fetchTripsFromServer = async () => {
    try {
      console.log("sync",user?._id)
      const response = await fetch(`http://192.168.109.128:3000/api/sync/${user?._id}`);
      const data = await response.json();
  
      console.log('Fetched trips from server:', data);
      setServerPlaces(data);
      setSource('server');
      // Optionally, insert into Realm
      const realm = await Realm.open({ path: 'placeRealm.realm', schema: [travelSchema] });
      realm.write(() => {
        data.forEach((trip:any) => {
          realm.create('Place', trip, Realm.UpdateMode.Modified);
        });
      });
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    }
  };
  const displayedPlaces = source === 'server' ? serverPlaces : realmPlaces;
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
  const handleDelete = async(tripId: number) =>{
    console.log("placeId",tripId);
    try {
      // Delete from Realm
      // Open Realm
      console.log('source--',source);
      const realm = await Realm.open({ path: 'placeRealm.realm', schema: [travelSchema] });

    // Step 1: Convert all realm objects to plain JS objects BEFORE deletion
    const safePlaces = realm.objects<Place>('Place').map(item => ({ ...item }));

    // Step 2: Delete the target object from Realm
    realm.write(() => {
      const tripToDelete = realm.objectForPrimaryKey('Place', tripId);
      if (tripToDelete && !tripToDelete.isValid()) return; // avoid double-delete error
      if (tripToDelete) realm.delete(tripToDelete);
    });
    
    const response = await fetch(`http://192.168.109.128:3000/api/sync/delete/${tripId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('MongoDB deletion failed');
    }
  

    // Step 3: Filter and update state using plain JS objects
    const updated = safePlaces.filter(p => p._id !== tripId);
    setRealmPlaces(updated);
    setServerPlaces(updated);
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
        keyExtractor={(item) => item._id.toString()}
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