import Loader from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function report() {
  const { resumeUrl } = useLocalSearchParams();
  const saveReport = useMutation(api.tasks.saveReport);
  const [report, setReport] = useState<any>(null);
  const { user, isLoaded } = useUser();
  useEffect(() => {
    const fetchReport = async (userId: string) => {
      const aiUrl = process.env.EXPO_AI_WEBHOOK_URL || '';
      try {
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
        await saveReport({ user: userId, report: data.result });
        setReport(data.result);
      } catch (error) {
        console.error(error);
      }
    };
    if (user && resumeUrl) {
      fetchReport(user.id);
    }
  }, [user, resumeUrl]);
  if (!resumeUrl)
    return (
      <View className="flex-1 justify-center items-center dark:bg-black">
        <Text className="text-red-600 font-bold text-2xl">Error: Resume URL not provided.</Text>
      </View>
    );
  if (!isLoaded || !report) return <Loader />;
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
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-6 bg-slate-50 dark:bg-gray-900">
        {/* Header and Score Section */}
        <View className="items-center mb-8 mt-4">
          <View className="w-40 h-40 rounded-full bg-indigo-700 justify-center items-center shadow-lg">
            <Text className="text-white text-5xl font-extrabold">{overall_score}</Text>
            <Text className="text-indigo-200 text-lg">/100</Text>
          </View>
          <Text className="text-2xl font-bold mt-4 text-center dark:text-white">
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
  // return (
  //   <SafeAreaView>
  //     <ScrollView className="flex-1 bg-white p-4">
  //       {/* Overall Score */}
  //       <View className="bg-indigo-600 rounded-2xl p-5 mb-4 shadow">
  //         <Text className="text-white text-2xl font-bold">Score: {report.overall_score}/100</Text>
  //         <Text className="text-white mt-2">{report.quick_verdict}</Text>
  //         <Text className="text-indigo-100 mt-1 italic">{report.motivational_message}</Text>
  //       </View>

  //       {/* Strengths */}
  //       <View className="bg-green-50 rounded-2xl p-4 mb-4 shadow">
  //         <Text className="text-green-700 text-lg font-semibold mb-2">Strengths</Text>
  //         {report.strengths?.map((item: string, idx: number) => (
  //           <Text key={idx} className="text-green-900 mb-1">
  //             • {item}
  //           </Text>
  //         ))}
  //       </View>

  //       {/* Improvements */}
  //       <View className="bg-red-50 rounded-2xl p-4 mb-4 shadow">
  //         <Text className="text-red-700 text-lg font-semibold mb-2">Areas to Improve</Text>
  //         {report.improvements?.map((item: string, idx: number) => (
  //           <Text key={idx} className="text-red-900 mb-1">
  //             • {item}
  //           </Text>
  //         ))}
  //       </View>

  //       {/* Section Breakdown */}
  //       <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow">
  //         <Text className="text-gray-800 text-lg font-semibold mb-3">Section-wise Breakdown</Text>
  //         {Object.entries(report.section_breakdown || {}).map(([section, detail]: any, idx) => (
  //           <View key={idx} className="mb-2">
  //             <Text className="text-gray-900 font-medium">{section}</Text>
  //             <Text className="text-gray-600">{detail}</Text>
  //           </View>
  //         ))}
  //       </View>

  //       {/* Recommendations */}
  //       <View className="bg-blue-50 rounded-2xl p-4 mb-6 shadow">
  //         <Text className="text-blue-700 text-lg font-semibold mb-2">Recommendations</Text>
  //         {report.recommendations?.map((item: string, idx: number) => (
  //           <Text key={idx} className="text-blue-900 mb-1">
  //             • {item}
  //           </Text>
  //         ))}
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
}
