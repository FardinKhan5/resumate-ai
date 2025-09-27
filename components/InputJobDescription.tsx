import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InputJobDescription() {
  const router = useRouter();
  const { resumeUri, mimeType, fileName } = useLocalSearchParams<{
    resumeUri: string;
    mimeType: string;
    fileName: string;
  }>();
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = () => {
    if (jobDescription.trim().length === 0) return;
    router.push({
      pathname: './generating',
      params: { resumeUri, mimeType, fileName, title: 'Job-Fit Analysis', jobDescription },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-black p-6"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1 justify-center">
        <Text className="text-2xl font-bold mb-2 text-gray-900 dark:text-slate-50">
          Paste Job Description
        </Text>
        <Text className="text-gray-600 mb-4 dark:text-slate-200">
          Enter or paste the job description for the position you want to analyze.
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 h-40 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 mb-6"
          multiline
          placeholder="Paste job description here..."
          placeholderTextColor="#888"
          value={jobDescription}
          onChangeText={setJobDescription}
          textAlignVertical="top"
        />
        <TouchableOpacity
          className={`bg-blue-600 rounded-xl py-4 ${jobDescription.trim() ? '' : 'opacity-50'}`}
          disabled={!jobDescription.trim()}
          onPress={handleSubmit}>
          <Text className="text-white text-center text-lg font-semibold">Start Analysis</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
