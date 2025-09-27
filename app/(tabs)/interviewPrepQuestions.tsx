import { AccordionSection } from '@/components/AccordionSection';
import Loader from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function interviewPrepQuestions() {
  const { interviewPrepQuestionsId } = useLocalSearchParams<{ interviewPrepQuestionsId: string }>();

  const result = useQuery(api.tasks.getInterviewPrepQuestions, {
    interviewPrepId: interviewPrepQuestionsId as Id<'interviewPrep'>,
  });

  if (!result) return <Loader />;

  return (
    <SafeAreaView edges={['top']} className="flex-1 px-4 bg-slate-50 dark:bg-black">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white my-6">
        Interview Preparation
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        className="px-4 pt-6">
        {result.general_questions && result.general_questions.length > 0 && (
          <AccordionSection
            title="General Questions"
            questions={result.general_questions}
            iconName="user" // Feather icon name
          />
        )}
        {result.technical_questions && result.technical_questions.length > 0 && (
          <AccordionSection
            title="Technical Questions"
            questions={result.technical_questions}
            iconName="code" // Feather icon name
          />
        )}
        {result.behavioral_questions && result.behavioral_questions.length > 0 && (
          <AccordionSection
            title="Behavioral Questions"
            questions={result.behavioral_questions}
            iconName="message-square" // Feather icon name
          />
        )}
        {result.tips && result.tips.length > 0 && (
          <AccordionSection
            title="Helpful Tips"
            questions={result.tips}
            iconName="star" // Feather icon name
            isTips
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
