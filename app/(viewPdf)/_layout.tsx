import { Stack, useGlobalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function _layout() {
  const { fileName } = useGlobalSearchParams<{ fileName: string }>();
  const { colorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        title: fileName,
        headerStyle: { backgroundColor: `${colorScheme == 'dark' ? 'black' : 'white'}` },
        headerTintColor: `${colorScheme == 'dark' ? 'white' : 'black'}`,
      }}></Stack>
  );
}
