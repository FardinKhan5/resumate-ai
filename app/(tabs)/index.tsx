import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const generateResumeUploadUrl = useMutation(api.tasks.generateResumeUploadUrl);
  const getResumeUrl = useMutation(api.tasks.getResumeUrl);
  const saveResume = useMutation(api.tasks.saveResume);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const router = useRouter();
  const pickDocument = async () => {
    try {
      const resume = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (resume.canceled) {
        setMessage('');
      } else {
        setLoading(true);
        const fileName = resume.assets[0].name;
        setMessage('You have selected ' + fileName);
        const resumeUploadUrl = await generateResumeUploadUrl();
        const fileResponse = await fetch(resume.assets[0].uri);
        const fileBlob = await fileResponse.blob();
        const data = await fetch(resumeUploadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': resume.assets[0].mimeType || 'application/pdf',
          },
          body: fileBlob,
        });
        const { storageId } = await data.json();
        const resumeUrl = await getResumeUrl({ storageId });
        if (resumeUrl && user) {
          const resume = await saveResume({ user: user.id, fileName, resumeUrl });
          if (resume) {
            setMessage('');
            router.push({ pathname: './report', params: { resumeUrl } });
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (!isLoaded) {
    return <Loader />;
  }
  return (
    <SafeAreaView className="flex-1 p-6 dark:bg-black">
      <Text className="text-2xl font-bold dark:text-white">Resumate AI</Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-xl font-bold dark:text-white">
          Ready to optimize your resume?
        </Text>
        <Button
          text={loading ? <ActivityIndicator size={'small'} color="white" /> : 'Upload resume'}
          onPress={pickDocument}
        />
        {message && <Text className="dark:text-white">{message}</Text>}
      </View>
    </SafeAreaView>
  );
}
