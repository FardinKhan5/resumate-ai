import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function FeatureSelection() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { resumeUri, mimeType, fileName } = useLocalSearchParams<{
    resumeUri: string;
    mimeType: string;
    fileName: string;
  }>();
  const features = [
    {
      title: 'Resume Review',
      subtitle: 'Get a complete AI-powered analysis and improvement tips.',
      icon: <MaterialCommunityIcons name="file-search-outline" size={24} color="white" />,
      bg: 'bg-blue-500',
    },
    {
      title: 'Job-Fit Analysis',
      subtitle: 'Upload a JD to check how well your resume matches it.',
      icon: <Feather name="briefcase" size={24} color="white" />,
      bg: 'bg-blue-500',
    },
    {
      title: 'Interview Prep',
      subtitle: 'Receive likely questions based on your resume content.',
      icon: <Feather name="message-square" size={24} color="white" />,
      bg: 'bg-blue-500',
    },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white p-6 dark:bg-black">
      <ScrollView className="">
        <Text className="text-2xl font-bold mb-2 text-gray-900 dark:text-slate-50 ">
          Choose an Analysis
        </Text>
        <Text className="text-gray-600 mb-6 dark:text-slate-200">
          Select what you’d like Resumate-AI to do with your uploaded resume.
        </Text>

        {features.map(({ title, subtitle, icon: Icon, bg }, idx) => (
          <TouchableOpacity
            key={idx}
            className={`mb-4 rounded-2xl p-5 flex-row items-center shadow ${bg}`}
            onPress={async () => {
              /* navigate to respective feature */
              router.push({
                pathname: './generating',
                params: { resumeUri, mimeType, fileName, title },
              });
            }}>
            {Icon}
            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-semibold">{title}</Text>
              <Text className="text-indigo-100 mt-1">{subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
