import { useColorScheme } from 'nativewind';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Loader() {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1 justify-center items-center dark:bg-black">
      <ActivityIndicator
        size="large"
        color={colorScheme == 'dark' ? 'white' : 'black'}
        className="mt-4"
      />
    </View>
  );
}
