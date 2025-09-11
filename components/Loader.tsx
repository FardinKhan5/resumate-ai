import { Image } from 'expo-image';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View } from 'react-native';

export default function Loader() {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1 justify-center items-center dark:bg-black">
      <Image
        source={require('./../assets/gif/load-32_256.gif')}
        contentFit="scale-down"
        style={{ flex: 1, width: '100%', backgroundColor: '#000' }}
      />
      {/* <ActivityIndicator
        size="large"
        color={colorScheme == 'dark' ? 'white' : 'black'}
        className="mt-4"
      /> */}
    </View>
  );
}
