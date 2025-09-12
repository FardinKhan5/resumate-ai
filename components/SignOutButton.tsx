import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Button from './Button';

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace('../(auth)/sign-in');
      // Linking.openURL(Linking.createURL('/'));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return <Button className="w-full" text="Sign out" onPress={handleSignOut} />;
};
