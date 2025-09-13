import Loader from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function report() {
  const { id } = useLocalSearchParams();
  const reportId = Array.isArray(id) ? id[0] : id;
  const report = useQuery(api.tasks.getReport, { reportId: reportId as Id<'reports'> });
  const saveReport = useMutation(api.tasks.saveReport);
  const { user, isLoaded } = useUser();
  const { colorScheme } = useColorScheme();
  if (!isLoaded || !report) {
    return <Loader />;
  }

  const {
    overall_score,
    quick_verdict,
    strengths,
    improvements,
    section_breakdown,
    recommendations,
    motivational_message,
  } = report;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-50 dark:bg-black">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        automaticallyAdjustContentInsets={true}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-6">
        {/* Header and Score Section */}
        <View className="items-center mb-8 mt-4">
          <View className="w-40 h-40 rounded-full bg-blue-600 justify-center items-center shadow-lg">
            <Text className="text-white text-5xl font-extrabold">{overall_score}</Text>
            <Text className="text-indigo-200 text-lg">/100</Text>
          </View>
          <Text className="text-xl font-bold mt-4 text-center dark:text-white">
            {quick_verdict}
          </Text>
          <Text className=" text-base italic mt-2 text-center text-gray-400">
            {motivational_message}
          </Text>
        </View>

        {/* Strengths Card */}
        <View className="bg-green-700 rounded-3xl p-6 mb-4 shadow-md">
          <Text className="text-white text-2xl font-bold mb-3">✅ Strengths</Text>
          {strengths?.map((item: string, idx: number) => (
            <Text key={idx} className="text-gray-200 text-lg mb-1">
              • {item}
            </Text>
          ))}
        </View>

        {/* Improvements Card */}
        <View className="bg-red-700 rounded-3xl p-6 mb-4 shadow-md">
          <Text className="text-white text-2xl font-bold mb-3">⚠️ Improvements</Text>
          {improvements?.map((item: string, idx: number) => (
            <Text key={idx} className="text-gray-200 text-lg mb-1">
              • {item}
            </Text>
          ))}
        </View>

        {/* Section Breakdown Card */}
        <View className="bg-gray-800 rounded-3xl p-6 mb-4 shadow-md">
          <Text className="text-white text-2xl font-bold mb-4">📚 Section Breakdown</Text>
          {Object.entries(section_breakdown || {}).map(([section, detail]: any, idx) => (
            <View key={idx} className="mb-4">
              <Text className="text-gray-300 font-bold text-lg">{section}</Text>
              <Text className="text-gray-400 leading-6">{detail}</Text>
            </View>
          ))}
        </View>

        {/* Recommendations Card */}
        <View className="bg-blue-700 rounded-3xl p-6 mb-8 shadow-md">
          <Text className="text-white text-2xl font-bold mb-3">💡 Recommendations</Text>
          {recommendations?.map((item: string, idx: number) => (
            <Text key={idx} className="text-gray-200 text-lg mb-1">
              • {item}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
