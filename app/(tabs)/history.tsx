import Loader from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function History() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Fetch all resumes for the current user
  const resumes = useQuery(api.tasks.getResumes, user?.id ? { user: user.id } : 'skip');

  // Show a loader while data is being fetched or user info is not ready
  if (!isLoaded || resumes === undefined) {
    return <Loader />;
  }

  // Handle case where no resumes are found
  if (resumes.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100 dark:bg-black p-4">
        <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          No History Found
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          Upload a resume to see your analysis history here.
        </Text>
      </SafeAreaView>
    );
  }

  // Handle the press event to navigate to the report page
  const handlePress = (id: Id<'resumes'>) => {
    router.push({ pathname: './prevAnalysis', params: { resumeId: id } });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 px-4 pt-6 bg-gray-100 dark:bg-black">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Analysis History
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={resumes}
        renderItem={(resume) => {
          return (
            <View className="flex-1 flex-row justify-between my-2 p-4 gap-2 rounded-lg bg-slate-50 border-2 border-black dark:bg-gray-900 dark:border-white">
              <TouchableOpacity className="flex-1" onPress={() => handlePress(resume.item._id)}>
                <View className="flex-1 flex-col gap-4">
                  <Text className="text-black font-medium dark:text-white">
                    {resume.item.fileName}
                  </Text>
                  <Text className="text-black font-medium dark:text-white">
                    {new Date(resume.item._creationTime).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 h-12 px-4 py-2 text-center"
                onPress={(e) =>
                  router.push({
                    pathname: './../(viewPdf)/',
                    params: { uri: resume.item.resumeUrl, fileName: resume.item.fileName },
                  })
                }>
                <Text className="text-white">View</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(resume) => resume._id}
      />
      {/* <ScrollView showsVerticalScrollIndicator={false}>
        {resumes.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handlePress(item._id)}
            className="flex-row items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                {item.fileName}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date(item._creationTime).toLocaleDateString()}
              </Text>
            </View>
            <View>
              <Text>File</Text>
            </View>
          </TouchableOpacity> */}
      {/* ))}
      </ScrollView> */}
    </SafeAreaView>
  );
}
