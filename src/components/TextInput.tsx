import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';

interface CommonTextInputProps extends TextInputProps {
  error?: string;
}

const CommonTextInput: React.FC<CommonTextInputProps> = ({
  error,
  ...props
}) => {
  return (
    <>
      <TextInput
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </>
  );
};



export default CommonTextInput;
