import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, scale } from 'react-native-size-matters';
import { Swipeable } from 'react-native-gesture-handler';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_FEEDBACK, GET_Feedback } from '../../../utils/GraphQl/queryService';
import { FeedbackData } from '../../../utils/GraphQl/querytypes';
import { NavigationProp } from '../../../utils/navigation/RootStackParamList';

export default function FeedbackScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { loading, error, data, refetch } = useQuery<FeedbackData>(GET_Feedback,{
    fetchPolicy: 'network-only',
    pollInterval: 5000, // fetch every 5 seconds
  });
  const [deleteFeedback] = useMutation(DELETE_FEEDBACK);

  useFocusEffect(
    useCallback(() => {
      refetch(); // ✅ Trigger GraphQL refetch
    }, [refetch])
  );

  if (loading) return <ActivityIndicator style={styles.centered} />;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const renderRightActions = (feedbackId: any) => (
    <TouchableOpacity
      onPress={() => confirmDelete(feedbackId)}
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

  const confirmDelete = (feedbackId: any) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this place?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(feedbackId), // call actual delete
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async(feedbackId: number) =>{
    console.log("feedbackId",feedbackId);
    try {
        await deleteFeedback({
        variables: { id: feedbackId },
      });
      refetch(); // Refresh the list
      Alert.alert('Feedback deleted');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const editFeedback = (feedbackId:any,feedback:any) =>{
    navigation.navigate('AddFeedback',{editId:feedbackId,editFeedback:feedback})
  };

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
              <Text style={styles.title}>Feedback</Text>
      </View>
      {/* <Text testID="hello-text" style={styles.text}>ExploreScreen</Text> */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end',width:'100%'}}>
        <TouchableOpacity onPress={()=>navigation.navigate('AddFeedback')}>
          <View style={{ flexDirection: 'row',gap:8, alignItems: 'center',backgroundColor:'#F43F5E', margin:scale(10),padding: scale(8), borderRadius: 8}}>
            {/* <Ionicons name size={24} color="white" /> */}
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={{color:'white'}}>Add Feedback</Text>
          </View>   
        </TouchableOpacity>
      </View>
      <View style={styles.containerArea}>
      {data?.feedbacks.length === 0 ? (
        <Text>No Feedback Available</Text>
      ) : (
      <FlatList
       data={data?.feedbacks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
          <View style={styles.card}>
            <Text style={styles.titlecard} >
            {item.feedback}
            </Text>
            <TouchableOpacity onPress={()=>editFeedback(item.id,item.feedback)}>
              <Ionicons name="create-outline" size={24} color="black" />
            </TouchableOpacity>
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
  containerArea: { flex: 1, width:'100%' },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    justifyContent :'space-between',
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
    centered: {
        marginTop: 40,
      },
    errorText: {
      color: 'red',
      padding: 16,
      textAlign: 'center',
    },
}); 