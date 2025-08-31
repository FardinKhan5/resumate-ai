import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  let isDark = colorScheme == 'dark' ? true : false;
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? 'black' : 'white',
        },
        headerStyle: {
          backgroundColor: isDark ? 'black' : 'white',
          shadowColor: 'gray',
          borderBottomWidth: isDark ? 1 : 0,
          borderBottomColor: 'gray',
        },
        headerTintColor: isDark ? 'white' : 'black',
        headerShown: false,
        tabBarActiveTintColor: isDark ? 'white' : 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => {
            return <Feather name="home" size={24} color={props.color} />;
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: (props) => {
            return <Octicons name="history" size={24} color={props.color} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: (props) => {
            return <Feather name="user" size={24} color={props.color} />;
          },
        }}
      />
    </Tabs>
  );
}
