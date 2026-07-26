import { Link, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useGetPerson } from '../../api/people/useGetPerson.ts';
import { useGetPersonEvents, type PersonEvent } from '../../api/people/useGetPersonEvents.ts';
import { useGetPersonBooks, type PersonBook } from '../../api/people/useGetPersonBooks.ts';
import { useGetPersonInterviews, type PersonInterview } from '../../api/people/useGetPersonInterview.ts';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities.ts';
import { usePageTitle } from '../../utils/usePageTitle.ts';
import { AuthorFeatureCard } from '../../components/AuthorFeatureCard/AuthorFeatureCard.tsx';
import { BookLink } from '../../components/BookLink/BookLink.tsx';
import { Container } from '../../components/Container/Container';
import { Eyebrow } from '../../components/Eyebrow/Eyebrow';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import styles from './Person.module.css';

interface AuthorMetaProps {
  name: string;
  firstName: string;
  name_pronunciation?: string | null;
  alternate_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  interviews?: PersonInterview[];
  events?: PersonEvent[];
  firstBook?: PersonBook;
  isKidfest: boolean;
}

function AuthorMeta({ name, firstName, name_pronunciation, alternate_name, bio, website_url, interviews, events, firstBook, isKidfest }: AuthorMetaProps) {
  const intl = useIntl();
  return (
    <>
      <Eyebrow><FormattedMessage id="person.eyebrow" /></Eyebrow>
      <PageTitle>{name}</PageTitle>
      {name_pronunciation && <p className={styles.pronunciation}>{name_pronunciation}</p>}
      {alternate_name && <p className={styles.alternateName}>{alternate_name}</p>}
      {bio && <div className={styles.bio} dangerouslySetInnerHTML={{ __html: bio }} />}
      {website_url && (
        <a href={website_url} className={styles.websiteLink}>
          <FormattedMessage id="person.websiteLink" />
        </a>
      )}
      {interviews && interviews.length > 0 && interviews.map((interview) => (
        <Link key={interview.id} to={`/interviews/${interview.slug}`} className={styles.websiteLink}>
          {interview.book_title ? (
            <FormattedMessage
              id="person.interviewLink.withBook"
              values={{ firstName, bookTitle: <em>{interview.book_title}</em> }}
            />
          ) : interview.festival_year ? (
            intl.formatMessage({ id: 'person.interviewLink.withYear' }, { year: interview.festival_year })
          ) : (
            intl.formatMessage({ id: 'person.interviewLink.generic' })
          )}
        </Link>
      ))}
      {events && events.length > 0 && events.map((event) => (
        <Link key={event.id} to={`/festival-events/${event.slug}`} className={styles.websiteLink}>
          {intl.formatMessage({ id: 'person.eventLink' }, { firstName, eventTitle: event.title })}
        </Link>
      ))}
      {!isKidfest && firstBook && (
        <BookLink slug={firstBook.slug} munrosUrl={firstBook.munros_url} className={styles.websiteLink}>
          {intl.formatMessage({ id: 'person.bookLink' }, { bookTitle: firstBook.title })}
        </BookLink>
      )}
    </>
  );
}

export default function PersonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: person, isLoading, error } = useGetPerson({ slug: slug! });
  const { data: events } = useGetPersonEvents(person?.id);
  const { data: books } = useGetPersonBooks(person?.id);
  const { data: interviews } = useGetPersonInterviews(person?.id);

  const name = decodeHtmlEntities(person?.title?.rendered ?? '');
  usePageTitle(person ? name : null);

  if (isLoading) return <div><FormattedMessage id="person.loading" /></div>;
  if (error || !person) return <div><FormattedMessage id="person.notFound" /></div>;

  const { alternate_name, name_pronunciation, bio, website_url, photo, kidfest_years, kidfest_photo } = person.person_data;

  const isKidfest = kidfest_years?.length > 0;
  const firstBook = books?.[0];
  const kidsBook = books?.find(b => b.categories?.includes('children')) ?? firstBook;
  const photoSrc = photo ? photo[0].replace(/-\d+x\d+(\.[a-z]+)$/i, '$1') : null;
  const kidfestPhotoSrc = kidfest_photo ? kidfest_photo[0].replace(/-\d+x\d+(\.[a-z]+)$/i, '$1') : null;
  const firstName = name.split(' ')[0];

  const adultHasEvents = !isKidfest && !!events?.length;

  const authorMeta = (
    <AuthorMeta
      name={name}
      firstName={firstName}
      name_pronunciation={name_pronunciation}
      alternate_name={alternate_name}
      bio={bio}
      website_url={website_url}
      interviews={interviews}
      events={events}
      firstBook={firstBook}
      isKidfest={isKidfest}
    />
  );

  return (
    <main id="main-content" className={styles.page}>
      <Container narrow>
      {isKidfest && (kidfestPhotoSrc || kidsBook?.cover_image) && (
        <div className={styles.kidsHero}>
          {kidfestPhotoSrc && (
            <img src={kidfestPhotoSrc} alt={name} className={styles.kidsHeroImg} />
          )}
          {kidsBook?.cover_image && (
            <BookLink slug={kidsBook.slug} munrosUrl={kidsBook.munros_url}>
              <img src={kidsBook.cover_image[0]} alt={kidsBook.title} className={styles.kidsHeroImg} />
            </BookLink>
          )}
        </div>
      )}

      {adultHasEvents ? (
        <div className={styles.adultHero}>
          <div className={styles.eventFeatureCards}>
            <AuthorFeatureCard
              photoSrc={photoSrc}
              photoAlt={name}
              bookCoverSrc={firstBook?.cover_image ? firstBook.cover_image[0] : null}
              bookCoverAlt={firstBook?.title}
              events={events!.map((event) => ({
                title: event.title,
                subtitleLines: event.event_date ? [
                  new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-CA', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                  }),
                ] : [],
                to: `/festival-events/${event.slug}`,
              }))}
              className={styles.eventFeatureCard}
            />
          </div>
          <div className={styles.meta}>{authorMeta}</div>
        </div>
      ) : (
        <div className={styles.profile}>
          <div className={styles.meta}>{authorMeta}</div>
        </div>
      )}
      </Container>
    </main>
  );
}
