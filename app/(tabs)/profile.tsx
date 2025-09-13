import { SignOutButton } from '@/components/SignOutButton';
import { isClerkAPIResponseError, useUser } from '@clerk/clerk-expo';
import Feather from '@expo/vector-icons/Feather';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailAddressId, setEmailAddressId] = useState(''); // Stores the ID of the new email

  // Function to handle email update
  const handleEmailUpdate = async () => {
    if (!newEmail || newEmail === user?.primaryEmailAddress?.emailAddress) {
      Alert.alert('Invalid Email', 'Please enter a new, valid email address.');
      return;
    }

    setLoading(true);
    try {
      const isExist = user?.emailAddresses.find((email) => email.emailAddress === newEmail);
      if (isExist) {
        await user?.update({ primaryEmailAddressId: isExist.id });
        Alert.alert('Success', 'Your email has been updated and verified!');
        return;
      }
      const newEmailAddress = await user?.createEmailAddress({ email: newEmail });
      if (!newEmailAddress) {
        return;
      }
      setEmailAddressId(newEmailAddress.id);
      await newEmailAddress.prepareVerification({ strategy: 'email_code' });

      // Alert.alert('Verification Code Sent', 'Please check your new email for a verification code.');
      setModalVisible(true);
    } catch (error) {
      console.error('Error updating email:', error);
      if (isClerkAPIResponseError(error)) {
        Alert.alert(error.message);
      } else {
        Alert.alert('Update Failed', 'An error occurred while updating your email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      Alert.alert('Invalid Code', 'Please enter the verification code.');
      return;
    }

    setLoading(true);
    try {
      const emailAddress = user?.emailAddresses.find((e) => e.id === emailAddressId);
      if (emailAddress) {
        await emailAddress.attemptVerification({ code: verificationCode });
        await user?.update({ primaryEmailAddressId: emailAddress.id });
        Alert.alert('Success', 'Your email has been updated and verified!');
        setNewEmail('');
        setVerificationCode('');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Could not find the new email address.');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      Alert.alert('Verification Failed', 'The code you entered is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle password update
  const handlePasswordUpdate = async () => {
    if (!currentPassword) {
      Alert.alert('Current Password is required');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await user?.updatePassword({ currentPassword, newPassword });
      Alert.alert('Success', 'Your password has been updated!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Update Failed', 'An error occurred while updating your password.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? 'white' : 'black'} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 px-4 bg-gray-100 dark:bg-black">
      <View className="flex-row justify-between items-center py-6">
        <Text className="text-2xl font-bold text-black dark:text-white">Profile Settings</Text>
        <TouchableOpacity onPress={toggleColorScheme}>
          <Text className="text-black dark:text-white">
            {colorScheme == 'light' ? (
              <Feather name="sun" size={24} color="black" />
            ) : (
              <Feather name="moon" size={24} color="white" />
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        automaticallyAdjustContentInsets={true}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-6">
        {/* Profile Header */}
        <View className="flex-col items-center justify-center mb-8">
          <View className="w-24 h-24 rounded-full overflow-hidden border-4 bg-blue-500 justify-center items-center">
            <Text className="text-white text-5xl font-bold dark:text-white">
              {user.primaryEmailAddress?.emailAddress[0].toUpperCase()}
            </Text>
          </View>
          <View className="ml-4 items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.primaryEmailAddress?.emailAddress}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">Account</Text>
          </View>
        </View>

        {/* Update Email Card */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Update Email Address
          </Text>
          <TextInput
            className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            placeholder="New email address"
            placeholderTextColor={isDark ? '#a0a0a0' : '#888'}
            onChangeText={setNewEmail}
            value={newEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={handleEmailUpdate}
            disabled={loading}
            className="w-full h-12 bg-blue-500 rounded-md justify-center items-center">
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Update Email</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Update Password Card */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Change Password
          </Text>
          <TextInput
            className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            placeholder="Current password"
            placeholderTextColor={isDark ? '#a0a0a0' : '#888'}
            onChangeText={setCurrentPassword}
            value={currentPassword}
            secureTextEntry
          />
          <TextInput
            className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            placeholder="New password"
            placeholderTextColor={isDark ? '#a0a0a0' : '#888'}
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handlePasswordUpdate}
            disabled={loading}
            className="w-full h-12 bg-blue-500 rounded-md justify-center items-center">
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Change Password</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign Out Section */}
        <View className="items-center mt-4 mb-10">
          <SignOutButton />
        </View>
      </ScrollView>

      {/* Verification Code Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: isDark ? '#333' : '#fff' }]}>
            <Text style={[styles.modalText, { color: isDark ? '#fff' : '#000' }]}>
              Enter Verification Code
            </Text>
            <TextInput
              style={[
                styles.modalTextInput,
                {
                  borderColor: isDark ? '#555' : '#ccc',
                  backgroundColor: isDark ? '#222' : '#f0f0f0',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              placeholder="123456"
              placeholderTextColor={isDark ? '#a0a0a0' : '#888'}
              keyboardType="numeric"
              onChangeText={setVerificationCode}
              value={verificationCode}
            />
            <TouchableOpacity
              onPress={handleVerifyEmail}
              disabled={loading}
              style={[styles.modalButton, { backgroundColor: '#4F46E5' }]}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextInput: {
    width: 200,
    height: 50,
    padding: 10,
    textAlign: 'center',
    fontSize: 24,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    width: 200,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
