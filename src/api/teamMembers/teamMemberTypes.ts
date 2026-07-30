import { BASE_URL } from '../commonTypes.ts';

export const TEAM_MEMBERS_PATH = 'team_members';
export const TEAM_MEMBERS_URL = `${BASE_URL}/${TEAM_MEMBERS_PATH}`;

export type TeamRole = 'staff' | 'board' | 'honorary';

export interface TeamMemberData {
  name: string;
  position: string;
  team_role: TeamRole;
  photo: [string, number, number, boolean] | false | null;
  term_start: string;
  term_end: string;
  display_order: number | null;
  description: string;
  pronouns: string;
  pronouns_other: string;
}

export interface TeamMember {
  id: number;
  slug: string;
  title: { rendered: string };
  team_member_data: TeamMemberData;
}
