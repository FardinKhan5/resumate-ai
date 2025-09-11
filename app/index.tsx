import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Index() {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loader />;
  }

  if (isSignedIn) {
    return <Redirect href={'./(tabs)'} />;
  }
  return (
    <SafeAreaView className="flex-1 mx-auto bg-white dark:bg-black">
      <View className="p-8">
        <Text className="text-black font-bold text-xl dark:text-white">Resumate Ai</Text>
      </View>
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('./../assets/images/logo.png')}
          style={{ width: 400, height: 400, resizeMode: 'cover', position: 'absolute' }}
        />
      </View>
      <View className="flex-1 px-8 pt-12 rounded-t-2xl bg-gray-200 justify-between dark:bg-gray-900">
        <Text className="text-center font-bold text-md leading-relaxed dark:text-white">
          Our AI-powered resume analyzer helps you stand out from the crowd. Get instant feedback
          and personalized suggestions to optimize your resume for applicant tracking systems (ATS)
          and recruiters. Stop guessing and start applying with confidence.
        </Text>
        <Button
          className="mb-8 rounded-full"
          text="Get Started"
          onPress={() => router.push('/(auth)/sign-up')}
        />
      </View>
    </SafeAreaView>
  );
}
