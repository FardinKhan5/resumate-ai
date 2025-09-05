import Button from '@/components/Button';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
const userSchema = z.object({
  emailAdress: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be over 8 characters long.' }),
});

type UserFormType = z.infer<typeof userSchema>;
export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [error, setError] = React.useState('');
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
  });
  // Handle the submission of the sign-in form
  const onSignInPress = async (data: UserFormType) => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: data.emailAdress,
        password: data.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('../(tabs)');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (isClerkAPIResponseError(err)) setError(err.errors[0].longMessage || '');
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView className="flex-1 container p-8 gap-8 justify-center mx-auto dark:bg-black">
      <Text className="text-2xl font-bold text-center dark:text-white">Resumate AI</Text>
      <Controller
        name="emailAdress"
        control={control}
        render={({ field }) => (
          <TextInput
            className="border border-gray-500 rounded-md dark:text-white dark:bg-gray-900"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder="Enter email"
            placeholderTextColor={colorScheme == 'dark' ? '#ffffff' : '#000000'}
          />
        )}
      />
      {errors.emailAdress && <Text className="text-red-600">{errors.emailAdress.message}</Text>}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextInput
            className="border border-gray-500 rounded-md dark:text-white dark:bg-gray-900"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder="Enter password"
            secureTextEntry={true}
            placeholderTextColor={colorScheme == 'dark' ? '#ffffff' : '#000000'}
          />
        )}
      />
      {errors.password && <Text className="text-red-600">{errors.password.message}</Text>}
      <Button text="Continue" onPress={handleSubmit(onSignInPress)} />
      {error && <Text className="text-red-600">{error}</Text>}
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Text className="dark:text-slate-400">Don't have an account? </Text>
        <Link href="./sign-up">
          <Text className="dark:text-white">Sign up</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
