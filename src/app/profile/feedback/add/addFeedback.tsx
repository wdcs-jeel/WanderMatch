import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useMutation } from '@apollo/client';
import { ADD_FEEDBACK, EDIT_FEEDBACK } from '../../../../utils/GraphQl/queryService';
import { NavigationProp } from '../../../../utils/navigation/RootStackParamList';
import { AddFeedbackData, AddFeedbackVars, UpdateFeedbackData, UpdateFeedbackVars } from '../../../../utils/GraphQl/querytypes';
import CommonTextInput from '../../../../components/TextInput';

export default function AddFeedback({route}:any) {
  const navigation = useNavigation<NavigationProp>();
  const {editId,editFeedback} = route.params?route.params:{};
  const [feedback, setFeedback] = useState(editFeedback || '');
  const [isSaving, setIsSaving] = useState(false);
  const [addFeedback, { loading, error }] = useMutation<AddFeedbackData, AddFeedbackVars>(ADD_FEEDBACK);
  const [updateFeedback] = useMutation<UpdateFeedbackData,UpdateFeedbackVars>(EDIT_FEEDBACK);
  const [errors, setErrors] = useState({
    feedback: "",
  });

 // Validate form
 const validateForm = () => {
  let isValid = true;
  const newErrors = { ...errors };
  
  newErrors.feedback = "";

  if (!feedback) {
    newErrors.feedback = "Feedback is required";
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
        if(editId){
          await updateFeedback({ variables: { id: editId,feedback } });
          Alert.alert('Feedback updated successfully!');
        }else{
          await addFeedback({ variables: { feedback } });
          Alert.alert('Feedback added!');
        }
        setFeedback('');
      } catch (err: any) {
        console.error('Error : Something went wrong!', err);
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
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{editId ? "Edit Feedback":"Add Feedback"}</Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Your Feedback</Text>
          <CommonTextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about your feedback"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
          />
          {errors.feedback ? <Text style={styles.fieldErrorText}>{errors.feedback}</Text> : null}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, (isSaving || loading) && styles.saveButtonDisabled]} 
          onPress={()=>handleSave() }
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