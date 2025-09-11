import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
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
            const reportId = await saveReport({ user: user.id, report: data.result });
            router.push({ pathname: './report', params: { id: reportId } });
          }
        }
      } catch (error) {
        console.error(error);
        router.replace('./index');
      }
    };
    if (isLoaded) {
      generateReport();
    }
  }, [resumeUri, mimeType, fileName, user]);

  return (
    <View className="flex-1 justify-center items-center dark:bg-black">
      <Image
        source={require('./../../assets/gif/analyzing.gif')}
        contentFit="contain"
        style={{ flex: 1, width: '100%', backgroundColor: '#000' }}
      />
    </View>
  );
}
