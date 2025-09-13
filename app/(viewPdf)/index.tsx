import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
export default function Index() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const source = { uri, cache: true };
  if (!uri) {
    return null; // Or show an error message
  }
  return (
    <View style={styles.container}>
      <Pdf
        renderActivityIndicator={(progress) => {
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>{Math.round(progress * 100)}% Loaded</Text>
            </View>
          );
        }}
        trustAllCerts={false}
        source={source}
        style={styles.pdf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
