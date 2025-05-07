import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { User } from '../../../context/AuthContext';
import { travelSchema } from '../../../utils/realm/AddTripRealmSchema';
import Realm from 'realm';
type RootStackParamList = {
  Profile: undefined;
  MainApp: undefined;
  Login: undefined;
};
let realm: Realm;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddTripDataPage() {
  const navigation = useNavigation<NavigationProp>();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [placeName, setPlaceName] = useState('');
  const [experience, setExperience] = useState('');
  const [travelWith, setTravelWith] = useState('');
  const [travelBy, setTravelBy] = useState('');
  const [error, setError] = useState("");

  const [errors, setErrors] = useState({
    placeName: "",
    experience: "",
    travelWith:"",
    travelBy:""
  });
  useEffect(() => {
    (async () => {
      Realm.open({ path: 'placeRealm.realm', schema: [travelSchema] }).then(r => {
        realm = r;
      });
      return () => {
        if (realm && !realm.isClosed) {
          realm.close();
        }
      };
    })();
  }, []);
 // Validate form
 const validateForm = () => {
  let isValid = true;
  const newErrors = { ...errors };
  
  // Reset errors
  newErrors.placeName = "";
  newErrors.experience = "";
  newErrors.travelBy = "";
  newErrors.travelWith = "";
  
  // Validate email
  if (!placeName) {
    newErrors.placeName = "placeName is required";
    isValid = false;
  } 
  
  // Validate password
  if (!experience) {
    newErrors.experience = "experience is required";
    isValid = false;
  } 
  if (!travelWith) {
    newErrors.travelWith = "Please enter with whom you travel";
    isValid = false;
  } 
  if (!travelBy) {
    newErrors.travelBy = "Please enter your travel transport detail";
    isValid = false;
  } 

  setErrors(newErrors);
  return isValid;
};
  const handleSave = async () => {
    
      if (!validateForm()) {
        return;
      }
      try {
        setLoading(true);
        setError('');
        realm.write(() => {
          realm.create('Place', {
            _id: Date.now(),
            placeName,
            experience,
            travelWith,
            travelBy
          });
        });
        setPlaceName('');
        setExperience('');
        setTravelBy('');
        setTravelWith('');
      } catch (err: any) {
        setError(err.message || 'Something wrong');
      } finally {
        setLoading(false);
      }
      
      navigation.goBack();
    
  };

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A9FF" />
      </View>
    );
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
        <Text style={styles.title}>Add Trip Detail</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Place you explored*</Text>
          <TextInput
            style={styles.input}
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Enter your full name"
          />
           {errors.placeName ? <Text style={styles.fieldErrorText}>{errors.placeName}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your experience</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={experience}
            onChangeText={setExperience}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
          />
          {errors.experience ? <Text style={styles.fieldErrorText}>{errors.experience}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>With whom you explored this place?</Text>
          <TextInput
            style={styles.input}
            value={travelWith}
            onChangeText={setTravelWith}
            placeholder='ex.-friends/family/solo/officemates'
          />
          {errors.travelWith ? <Text style={styles.fieldErrorText}>{errors.travelWith}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>You reached there by ?</Text>
          <TextInput
            style={styles.input}
            value={travelBy}
            onChangeText={setTravelBy}
            placeholder='car/bus/train/flight'
          />
         {errors.travelBy ? <Text style={styles.fieldErrorText}>{errors.travelBy}</Text> : null}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, (isSaving || loading) && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isSaving || loading}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
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
  fieldErrorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
}); 