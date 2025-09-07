import Loader from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function report({ resumeUrl }: { resumeUrl: string }) {
  const saveReport = useMutation(api.tasks.saveReport);
  const [report, setReport] = useState<any>(null);
  const { user, isLoaded } = useUser();
  useEffect(() => {
    const fetchReport = async (userId: string) => {
      try {
        const res = await fetch(
          'https://n8n-stl5.onrender.com/webhook/7e01d53c-282e-48f1-8b3c-d155dcf1e39f',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              resumeUrl: resumeUrl,
            }),
          }
        );
        const data = await res.json();
        await saveReport({ user: userId, report: data.result });
        setReport(data.result);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) {
      fetchReport(user.id);
    }
  }, []);
  if (!isLoaded || !report) return <Loader />;
  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Overall Score */}
      <View className="bg-indigo-600 rounded-2xl p-5 mb-4 shadow">
        <Text className="text-white text-2xl font-bold">Score: {report.overall_score}/100</Text>
        <Text className="text-white mt-2">{report.quick_verdict}</Text>
        <Text className="text-indigo-100 mt-1 italic">{report.motivational_message}</Text>
      </View>

      {/* Strengths */}
      <View className="bg-green-50 rounded-2xl p-4 mb-4 shadow">
        <Text className="text-green-700 text-lg font-semibold mb-2">Strengths</Text>
        {report.strengths?.map((item: string, idx: number) => (
          <Text key={idx} className="text-green-900 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      {/* Improvements */}
      <View className="bg-red-50 rounded-2xl p-4 mb-4 shadow">
        <Text className="text-red-700 text-lg font-semibold mb-2">Areas to Improve</Text>
        {report.improvements?.map((item: string, idx: number) => (
          <Text key={idx} className="text-red-900 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      {/* Section Breakdown */}
      <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow">
        <Text className="text-gray-800 text-lg font-semibold mb-3">Section-wise Breakdown</Text>
        {Object.entries(report.section_breakdown || {}).map(([section, detail]: any, idx) => (
          <View key={idx} className="mb-2">
            <Text className="text-gray-900 font-medium">{section}</Text>
            <Text className="text-gray-600">{detail}</Text>
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View className="bg-blue-50 rounded-2xl p-4 mb-6 shadow">
        <Text className="text-blue-700 text-lg font-semibold mb-2">Recommendations</Text>
        {report.recommendations?.map((item: string, idx: number) => (
          <Text key={idx} className="text-blue-900 mb-1">
            • {item}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
