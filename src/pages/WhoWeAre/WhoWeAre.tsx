import { useIntl, FormattedMessage } from 'react-intl';
import { useGetTeamMembers } from '../../api/teamMembers/useGetTeamMembers.ts';
import type { TeamMember, TeamRole } from '../../api/teamMembers/teamMemberTypes.ts';
import { sanitizeHtml } from '../../utils/sanitizeHtml.ts';
import { formatPronouns } from '../../utils/formatPronouns.ts';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { Container } from '../../components/Container/Container';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import styles from './WhoWeAre.module.css';

function sortMembers(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => {
    const aOrder = a.team_member_data.display_order;
    const bOrder = b.team_member_data.display_order;
    if (aOrder !== null && bOrder !== null) return aOrder - bOrder;
    if (aOrder !== null) return -1;
    if (bOrder !== null) return 1;
    const surname = (name: string) => name.trim().split(/\s+/).pop()!.toLowerCase();
    return surname(a.team_member_data.name).localeCompare(surname(b.team_member_data.name));
  });
}

function StaffCard({ member }: { member: TeamMember }) {
  const { name, position, photo, description, pronouns, pronouns_other } = member.team_member_data;
  const photoSrc = photo ? photo[0] : null;
  const pronounsLabel = formatPronouns(pronouns, pronouns_other);
  return (
    <div className={styles.staffCard}>
      {photoSrc && (
        <div className={styles.staffPhotoWrap}>
          <img src={photoSrc} alt={name} className={styles.staffPhoto} />
        </div>
      )}
      <div className={styles.staffBody}>
        <p className={styles.memberName}>
          {name}
          {pronounsLabel && <span className={styles.memberPronouns}>({pronounsLabel})</span>}
        </p>
        {position && <p className={styles.memberPosition}>{position}</p>}
        {description && (
          <div className={styles.memberBio} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
        )}
      </div>
    </div>
  );
}

function BoardCard({ member }: { member: TeamMember }) {
  const { name, position, description } = member.team_member_data;
  return (
    <div className={styles.boardCard}>
      <p className={styles.memberName}>{name}</p>
      {position && <p className={styles.memberPosition}>{position}</p>}
      {description && (
        <div className={styles.memberBio} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
      )}
    </div>
  );
}

function HonoraryItem({ member }: { member: TeamMember }) {
  const { name, position } = member.team_member_data;
  return (
    <li className={styles.honoraryItem}>
      <span className={styles.memberName}>{name}</span>
      {position && <span className={styles.honoraryPosition}>{position}</span>}
    </li>
  );
}

function Section({
  role,
  headingId,
  members,
}: {
  role: TeamRole;
  headingId: string;
  members: TeamMember[];
}) {
  if (!members.length) return null;
  const sorted = sortMembers(members);

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.sectionHeading}>
        <FormattedMessage id={`whoWeAre.${role}.heading`} />
      </h2>
      {role === 'staff' && (
        <div className={styles.staffGrid}>
          {sorted.map((m) => <StaffCard key={m.id} member={m} />)}
        </div>
      )}
      {role === 'board' && (
        <div className={styles.boardGrid}>
          {sorted.map((m) => <BoardCard key={m.id} member={m} />)}
        </div>
      )}
      {role === 'honorary' && (
        <ul className={styles.honoraryList}>
          {sorted.map((m) => <HonoraryItem key={m.id} member={m} />)}
        </ul>
      )}
    </section>
  );
}

export default function WhoWeArePage() {
  const intl = useIntl();
  usePageTitle(intl.formatMessage({ id: 'whoWeAre.pageTitle' }));
  const { data: members, isLoading, isError } = useGetTeamMembers();

  const staff    = (members ?? []).filter((m) => m.team_member_data.team_role === 'staff');
  const board    = (members ?? []).filter((m) => m.team_member_data.team_role === 'board');
  const honorary = (members ?? []).filter((m) => m.team_member_data.team_role === 'honorary');

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
        <PageTitle><FormattedMessage id="whoWeAre.pageTitle" /></PageTitle>

        <p className={styles.intro}>
          {intl.formatMessage({ id: 'whoWeAre.intro' }, { year: new Date().getFullYear() })}
        </p>

        {isLoading && (
          <p className={styles.state} role="status">
            <FormattedMessage id="whoWeAre.loading" />
          </p>
        )}
        {isError && (
          <p className={styles.state} role="status">
            <FormattedMessage id="whoWeAre.error" />
          </p>
        )}

        {members && (
          <>
            <Section role="staff"    headingId="section-staff"    members={staff} />
            <Section role="board"    headingId="section-board"    members={board} />
            <Section role="honorary" headingId="section-honorary" members={honorary} />
          </>
        )}
      </Container>
    </main>
  );
}
