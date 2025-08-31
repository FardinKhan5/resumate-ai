import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function Button({
  className = '',
  text,
  onPress = () => {},
}: {
  className?: string;
  text: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      className={`px-6 py-3 m-2 bg-blue-500 rounded-md ${className ? className : ''}`}
      onPress={onPress}>
      <Text className="text-white text-center">{text}</Text>
    </TouchableOpacity>
  );
}
