import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../../components/Loader';

export default function JobDescReport() {
  const { jobFitReportId } = useLocalSearchParams<{ jobFitReportId: string }>();
  const result = useQuery(api.tasks.getJobFitReport, {
    reportId: jobFitReportId as Id<'jobFitReports'>,
  });

  if (!jobFitReportId || !result) return <Loader />;

  return (
    <SafeAreaView edges={['top']} className="flex-1 px-4 bg-slate-50 dark:bg-black">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white my-6">
        Job-Fit Analysis
      </Text>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        automaticallyAdjustContentInsets={true}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-6">
        {/* Header Scores */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
              Job-Fit Analysis
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-300">
              Resume & Job Description Match Report
            </Text>
          </View>
          <View className="flex-row space-x-3">
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Overall
              </Text>
              <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                {result.overallScore}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-700 dark:text-gray-200">Match</Text>
              <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {result.jobMatchScore}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View className="mb-6 bg-blue-50 dark:bg-blue-900 rounded-xl p-4">
          <Text className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Summary
          </Text>
          <Text className="text-green-700 dark:text-green-300 mb-1">
            👍 {result.summary.positive}
          </Text>
          <Text className="text-yellow-700 dark:text-yellow-300">
            🛠️ {result.summary.improvement}
          </Text>
        </View>

        {/* Detailed Analysis */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Detailed Analysis
          </Text>
          {result.detailedAnalysis.map((item: any, idx: number) => (
            <View
              key={idx}
              className="mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-bold text-blue-700 dark:text-blue-300">
                  {item.title}
                </Text>
                <Text className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  Score: <Text className="text-green-600 dark:text-green-400">{item.score}</Text>
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mb-2">{item.category.replace(/_/g, ' ')}</Text>
              <Text className="mb-2 text-gray-700 dark:text-gray-200">{item.feedback}</Text>
              <View className="ml-2">
                <Text className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Suggestions:
                </Text>
                {item.suggestions.map((s: string, i: number) => (
                  <Text key={i} className="text-gray-600 dark:text-gray-300 mb-1">
                    • {s}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
