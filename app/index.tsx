import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@mahallu/shared-types';

export default function Index() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/landing" />;
  }

  // Role-based redirect
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.SECRETARY:
    case UserRole.TREASURER:
    case UserRole.IMAM:
      return <Redirect href="/(admin)/home" />;
    case UserRole.MADRASA_PRINCIPAL:
      return <Redirect href="/(teacher)/home" />;
    case UserRole.USTADH:
    case UserRole.PARENT:
      return <Redirect href="/(member)/home" />;
    case UserRole.STUDENT:
      return <Redirect href="/(student)/home" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}
