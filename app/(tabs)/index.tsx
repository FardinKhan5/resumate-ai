import Button from '@/components/Button';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <SafeAreaView className="flex-1 justify-center items-center dark:bg-black">
      <Text className="dark:text-white">Home</Text>
      <Button text="Toggle" onPress={toggleColorScheme} />
    </SafeAreaView>
  );
}
