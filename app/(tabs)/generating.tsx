import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function generating() {
  const generateResumeUploadUrl = useMutation(api.tasks.generateResumeUploadUrl);
  const getResumeUrl = useMutation(api.tasks.getResumeUrl);
  const saveResume = useMutation(api.tasks.saveResume);
  const saveReport = useMutation(api.tasks.saveReport);
  const { user, isLoaded } = useUser();
  const { resumeUri, mimeType, fileName } = useLocalSearchParams<{
    resumeUri: string;
    mimeType: string;
    fileName: string;
  }>();
  const router = useRouter();
  useEffect(() => {
    const generateReport = async () => {
      try {
        const resumeUploadUrl = await generateResumeUploadUrl();
        const fileResponse = await fetch(resumeUri);
        const fileBlob = await fileResponse.blob();
        const data = await fetch(resumeUploadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': mimeType || 'application/pdf',
          },
          body: fileBlob,
        });
        const { storageId } = await data.json();
        const resumeUrl = await getResumeUrl({ storageId });
        if (resumeUrl && user) {
          const resume = await saveResume({ user: user.id, fileName, resumeUrl });
          if (resume) {
            const aiUrl = process.env.EXPO_PUBLIC_AI_WEBHOOK_URL || '';
            const res = await fetch(aiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                resumeUrl: resumeUrl,
              }),
            });
            const data = await res.json();
            const reportId = await saveReport({ resume, user: user.id, report: data.result });

            router.push({ pathname: './report', params: { id: reportId } });
          }
        }
      } catch (error) {
        console.error(error);
        router.replace('./');
      }
    };
    if (isLoaded) {
      generateReport();
    }
  }, [resumeUri, mimeType, fileName, user]);

  return (
    <SafeAreaView className="flex-1 p-6 dark:bg-black">
      <Text className="text-2xl font-bold dark:text-white">Resumate AI</Text>
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('./../../assets/gif/analyzing.gif')}
          contentFit="cover"
          style={{ width: 250, height: 250 }}
        />
        <Text className="text-black text-2xl font-bold mt-8 text-center dark:text-white">
          Analyzing Your Resume...
        </Text>
        <Text className="text-gray-400 text-base mt-2 text-center">
          This may take a moment while our AI reviews your document.
        </Text>
      </View>
    </SafeAreaView>
  );
}
