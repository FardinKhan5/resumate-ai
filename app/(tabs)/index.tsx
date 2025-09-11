import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Home() {
  const generateResumeUploadUrl = useMutation(api.tasks.generateResumeUploadUrl);
  const getResumeUrl = useMutation(api.tasks.getResumeUrl);
  const saveResume = useMutation(api.tasks.saveResume);
  const { user, isLoaded } = useUser();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const router = useRouter();
  const pickDocument = async () => {
    try {
      const resume = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (!resume.canceled) {
        const resumeUri = resume.assets[0].uri;
        const mimeType = resume.assets[0].mimeType;
        const fileName = resume.assets[0].name;
        router.push({ pathname: './generating', params: { resumeUri, mimeType, fileName } });
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (!isLoaded) {
    return <Loader />;
  }
  return (
    <SafeAreaView className="flex-1 p-6 dark:bg-black">
      <Text className="text-2xl font-bold dark:text-white">Resumate AI</Text>
      <View className="flex-1 items-center justify-center">
        <Image
          source={require('./../../assets/gif/homePage.gif')}
          contentFit="contain"
          style={{ height: 300, width: '100%', backgroundColor: '#000' }}
        />

        <Text className="text-center text-xl font-bold dark:text-white">
          Ready to optimize your resume?
        </Text>
        <Button text={'Upload resume'} onPress={pickDocument} />
      </View>
    </SafeAreaView>
  );
}
