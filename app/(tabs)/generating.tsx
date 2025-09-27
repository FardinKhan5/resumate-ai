import InputJobDescription from '@/components/InputJobDescription';
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
  const saveJobFitReport = useMutation(api.tasks.saveJobFitReport);
  const saveInterviewPrepQuestions = useMutation(api.tasks.saveInterviewPrepQuestions);
  const { user, isLoaded } = useUser();
  const { resumeUri, mimeType, fileName, title, jobDescription } = useLocalSearchParams<{
    resumeUri: string;
    mimeType: string;
    fileName: string;
    title: 'none' | 'Resume Review' | 'Job-Fit Analysis' | 'Interview Prep';
    jobDescription?: string;
  }>();
  const router = useRouter();
  const uploadResumeAndGenerateAIResponse = async () => {
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
        const resume = await saveResume({ user: user.id, fileName, resumeUrl, usedFor: title });
        if (resume) {
          const aiUrl = process.env.EXPO_PUBLIC_AI_WEBHOOK_URL || '';
          const res = await fetch(aiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              resumeUrl: resumeUrl,
              jobDescription: jobDescription || '',
              interviewPrep: title == 'Interview Prep' ? true : false,
            }),
          });
          const data = await res.json();
          return { resumeUrl, resume, data };
        }
      }
      return null;
    } catch (error) {
      throw new Error('AI Analysis Failed');
    }
  };
  useEffect(() => {
    const generateReport = async () => {
      try {
        const res = await uploadResumeAndGenerateAIResponse();
        if (res?.resumeUrl && res?.resume && res.data && user) {
          const reportId = await saveReport({
            resume: res.resume,
            user: user.id,
            report: res.data.result,
          });
          router.push({ pathname: './report', params: { id: reportId } });
        }
        throw new Error('AI Analysis Failed');
      } catch (error) {
        console.error(error);
        router.replace('./');
      }
    };

    const generateJobFitReport = async () => {
      try {
        const res = await uploadResumeAndGenerateAIResponse();
        const jobFitReportId = await saveJobFitReport({
          user: user?.id,
          resume: res?.resume,
          ...res?.data.result,
        });
        router.push({ pathname: './JobDescReport', params: { jobFitReportId } });
      } catch (error) {
        console.error(error);
        router.replace('./');
      }
    };

    const generateInterviewPrepQuestions = async () => {
      try {
        const res = await uploadResumeAndGenerateAIResponse();
        const interviewPrepQuestionsId = await saveInterviewPrepQuestions({
          user: user?.id,
          resume: res?.resume,
          ...res?.data.result,
        });
        router.push({ pathname: './interviewPrepQuestions', params: { interviewPrepQuestionsId } });
      } catch (error) {
        console.error(error);
        router.replace('./');
      }
    };

    if (isLoaded && title == 'Resume Review') {
      generateReport();
    } else if (jobDescription) {
      generateJobFitReport();
    } else if (title == 'Interview Prep') {
      generateInterviewPrepQuestions();
    }
  }, [resumeUri, mimeType, fileName, user, title, jobDescription]);
  if (title == 'Job-Fit Analysis' && !jobDescription) {
    return <InputJobDescription />;
  }
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
