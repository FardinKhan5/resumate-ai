import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { colorScheme } = useColorScheme();
  if (isSignedIn) {
    return <Redirect href={'../(tabs)'} />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: `${colorScheme == 'dark' ? 'black' : 'white'}` },
        headerTintColor: `${colorScheme == 'dark' ? 'white' : 'black'}`,
      }}
    />
  );
}
