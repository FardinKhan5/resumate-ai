import Button from '@/components/Button';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
const userSchema = z.object({
  emailAdress: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be over 8 characters long.' }),
});

type UserFormType = z.infer<typeof userSchema>;

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [error, setError] = React.useState('');
  const [verificationError, setVerificationError] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const { colorScheme } = useColorScheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
  });
  // Handle submission of sign-up form
  const onSignUpPress = async (data: UserFormType) => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: data.emailAdress,
        password: data.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (isClerkAPIResponseError(err)) setError(err.errors[0].longMessage || '');
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (isClerkAPIResponseError(err)) setVerificationError(err.errors[0].longMessage || '');
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 container p-8 gap-8 justify-center mx-auto dark:bg-black">
        <Text className="text-2xl font-bold text-center dark:text-white">Verify your email</Text>
        <TextInput
          className="border border-gray-500 rounded-md dark:text-white dark:bg-gray-900"
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
          placeholderTextColor={colorScheme == 'dark' ? '#ffffff' : '#000000'}
        />
        <Button text="Verify" onPress={onVerifyPress} />
        {verificationError && <Text className="text-red-600">{verificationError}</Text>}
      </SafeAreaView>
    );
  }

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
            placeholder="Enter password"
            secureTextEntry={true}
            placeholderTextColor={colorScheme == 'dark' ? '#ffffff' : '#000000'}
          />
        )}
      />
      {errors.password && <Text className="text-red-600">{errors.password.message}</Text>}
      <Button text="Sign up" onPress={handleSubmit(onSignUpPress)} />
      {error && <Text className="text-red-600">{error}</Text>}
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Text className="dark:text-slate-400">Already have an account? </Text>
        <Link href="./sign-in">
          <Text className="dark:text-white">Sign in</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
