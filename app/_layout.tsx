import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <>
      <ConvexProvider client={convex}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <ClerkProvider tokenCache={tokenCache}>
            <Stack screenOptions={{ headerShown: false }} />
          </ClerkProvider>
        </SafeAreaProvider>
      </ConvexProvider>
    </>
  );
}
