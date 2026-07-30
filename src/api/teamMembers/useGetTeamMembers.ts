import { useQuery } from '@tanstack/react-query';
import wretch from '../wretch.ts';
import { type TeamMember, TEAM_MEMBERS_URL } from './teamMemberTypes.ts';

export function useGetTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: ['team_members'],
    queryFn: () => wretch(`${TEAM_MEMBERS_URL}?per_page=100`).get().json(),
    refetchOnWindowFocus: false,
  });
}
