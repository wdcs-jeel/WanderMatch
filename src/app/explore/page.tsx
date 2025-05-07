import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Platform } from 'react-native';
import Realm from 'realm';
import { travelSchema } from '../../utils/realm/AddTripRealmSchema';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, scale } from 'react-native-size-matters';
type RootStackParamList = {
  AddTrip:undefined
};
type Place = {
  _id: number,
  placeName: 'string',
  experience: 'string',
  travelWith: 'string',
  travelBy : 'string'
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [place, setPlace] = useState<Place[]>([]);

 
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Realm.open({ path: 'placeRealm.realm', schema: [travelSchema] }).then(r => {
        const results = r.objects<Place>('Place');
        console.log('Stored places:', JSON.stringify(results));
        setPlace([...results]);
      });
    });
    return unsubscribe;
  }, [navigation]);
  
  useEffect(()=>{
    console.log("place"+JSON.stringify(place));
  },[place])
  const addTripDetail = () =>{
    navigation.navigate('AddTrip')
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
      {/* <View style={{ flexDirection: 'row', padding: scale(16) ,backgroundColor:'#F43F5E'}}> */}
        <TouchableOpacity onPress={addTripDetail}>
        <View style={{ flexDirection: 'row', gap:8,alignItems: 'center',backgroundColor:'#F43F5E', margin:scale(10),padding: scale(8), borderRadius: 8}}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={{color:'white'}}>Add Trip</Text>
        </View>   
        </TouchableOpacity>
       
      {/* </View> */}
      <TouchableOpacity onPress={addTripDetail}>
        <View style={{ flexDirection: 'row',gap:8, alignItems: 'center',backgroundColor:'#F43F5E', margin:scale(10),padding: scale(8), borderRadius: 8}}>
          {/* <Ionicons name size={24} color="white" /> */}
          <Ionicons name="sync-outline" size={24} color="white" />
          <Text style={{color:'white'}}>Sync Trip</Text>
        </View>   
        </TouchableOpacity>
      </View>
      <View style={styles.container1}>
      {place.length === 0 ? (
        <Text>No data found</Text>
      ) : (
      <FlatList
       data={place}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
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