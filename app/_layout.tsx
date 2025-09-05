import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <ClerkProvider tokenCache={tokenCache}>
          <Stack screenOptions={{ headerShown: false }} />
        </ClerkProvider>
      </SafeAreaProvider>
    </>
  );
}
