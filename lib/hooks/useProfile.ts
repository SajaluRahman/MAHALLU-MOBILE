import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api';

export function useProfile() {
  return useQuery({
    queryKey: ['mobile', 'profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/mobile/me/profile');
      return data.data;
    },
  });
}
