import { useMemo } from 'react';
import { useGetTribeEvents } from '../api/events/useGetTribeEvents';
import { useGetOsomAuthors } from '../api/authors/useGetOsomAuthors';
import { useGetCategories } from '../api/categories/useGetCategories';
import { useGetPostsByCategory } from '../api/posts/useGetPostsByCategory';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import type { TribeEvent } from '../api/events/eventTypes';
import type { OsomAuthor } from '../api/authors/authorTypes';
import type { Post } from '../api/posts/postTypes';
import styles from './Home.module.css';

function parseDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    time: d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
}

const MARQUEE_ITEMS = [
  '"The most necessary literary weekend on the coast." — The Malahat Review',
  'Victoria Festival of Authors',
  'Readings · Panels · Workshops · In Conversation',
  'Victoria, BC · Lekwungen & W̱SÁNEĆ Territory',
];

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className={styles.marqueeTrack}>
      <div className={styles.marquee}>
        {doubled.map((item, i) => (
          <span className={styles.marqueeItem} key={i}>
            {item}
            <svg width="20" height="20" viewBox="0 0 28 24" fill="none" aria-hidden="true">
              <path d="M2 14c2-3 5-5 9-5 3 0 6 1 9 3l4-3-1 4 3 2-4 1c-2 3-6 5-10 5-5 0-9-3-10-7z M22 9l3-7-1 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="13" r="0.8" fill="currentColor"/>
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

function EditorialEventCard({ event }: { event: TribeEvent }) {
  const { day, month, time } = parseDate(event.date);
  return (
    <article className={styles.eventCard}>
      <div className={styles.eventCardImg} role="presentation" />
      <div className={styles.eventCardBody}>
        <div className={styles.eventCardMeta}>
          <div className={styles.dateBlock}>
            <span className={styles.dateDay}>{day}</span>
            <span className={styles.dateMonth}>{month}</span>
          </div>
          <div>
            <div className={styles.kicker}>Event</div>
            <div className={styles.eventCardTime}>{time}</div>
          </div>
        </div>
        <h3 className={styles.eventCardTitle}>{decodeHtmlEntities(event.title.rendered)}</h3>
        {event.excerpt.rendered && (
          <div
            className={styles.eventCardExcerpt}
            dangerouslySetInnerHTML={{ __html: event.excerpt.rendered }}
          />
        )}
        <div className={styles.eventCardFooter}>
          <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.btnLink}>
            Details →
          </a>
        </div>
      </div>
    </article>
  );
}

function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroInner}>
        <div className={styles.heroKickers}>
          <span className={styles.kicker}>Victoria Festival of Authors</span>
          <span className={styles.kicker}>Lekwungen &amp; W̱SÁNEĆ Territory</span>
        </div>
        <h1 className={styles.heroTitle}>
          Five days.<br />
          Forty-two{' '}
          <em className={styles.heroItalic}>authors</em>.<br />
          One{' '}
          <span className={styles.heroHighlight}>city</span>
          {' '}reading<br />
          out <span className={styles.heroAccent}>loud</span>.
        </h1>
        <div className={styles.heroBottom}>
          <p className={styles.heroDesc}>
            The Victoria Festival of Authors brings the country's most necessary
            writers to the Salish coast for readings, panels, craft talks, and
            one very late-night literary cabaret.
          </p>
          <div className={styles.heroCTAs}>
            <a
              href="https://victoriafestivalofauthors.ca/tickets"
              className={styles.btnPrimary}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy a festival pass
            </a>
            <a
              href="https://victoriafestivalofauthors.ca/program"
              className={styles.btnGhost}
              target="_blank"
              rel="noopener noreferrer"
            >
              See the program
            </a>
          </div>
        </div>
      </div>
      <Marquee />
    </section>
  );
}

function FeaturedEvents() {
  const { data: events, isLoading, isError } = useGetTribeEvents();
  const featured = (events ?? []).slice(0, 4);

  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.kicker}>Upcoming · top picks</div>
            <h2 className={styles.sectionTitle}>Featured events.</h2>
          </div>
          <a href="/events" className={styles.btnLink}>All events →</a>
        </div>
        {isLoading && <p style={{ color: 'var(--vfa-muted)' }}>Loading events…</p>}
        {isError && <p style={{ color: 'var(--vfa-muted)' }}>Events coming soon.</p>}
        {!isLoading && !isError && featured.length > 0 && (
          <div className={styles.eventsGrid}>
            {featured.map((ev: TribeEvent) => (
              <EditorialEventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
        {!isLoading && !isError && featured.length === 0 && (
          <p style={{ color: 'var(--vfa-muted)', marginTop: 12 }}>
            Events coming soon — check back for the full lineup.
          </p>
        )}
      </div>
    </section>
  );
}

function AuthorsStrip() {
  const { data: authors, isLoading } = useGetOsomAuthors();
  if (isLoading || !authors?.length) return null;

  return (
    <section className={styles.sectionDeep}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.kicker}>2025 lineup · featured</div>
            <h2 className={styles.sectionTitle}>Featured authors.</h2>
          </div>
          <a href="#authors" className={styles.btnLink}>Full lineup →</a>
        </div>
        <div className={styles.authorsGrid}>
          {authors.slice(0, 14).map((author: OsomAuthor) => (
            <article key={author.id} className={styles.authorCard}>
              <div className={styles.authorImg} role="presentation" />
              <div>
                <div className={styles.authorName}>{author.name}</div>
                {author.description && (
                  <div className={styles.authorTag}>{author.description.replace(/<[^>]+>/g, '').slice(0, 60)}</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QAStrip() {
  const { data: categories } = useGetCategories();
  const qnaCategory = useMemo(
    () => categories?.find(cat => cat.slug === 'qa-2024'),
    [categories],
  );
  const { data, isLoading } = useGetPostsByCategory(qnaCategory?.id ?? -1, 6);
  const posts = useMemo(() => (data ? data.pages.flat().slice(0, 3) : []), [data]);

  if (isLoading || posts.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.kicker}>Field notes</div>
            <h2 className={styles.sectionTitle}>The Q&amp;A.</h2>
          </div>
          <a href="#qa" className={styles.btnLink}>All interviews →</a>
        </div>
        <div className={styles.qaGrid}>
          {posts.map((post: Post) => (
            <article key={post.id} className={styles.qaCard}>
              <div className={styles.qaImg} role="presentation" />
              <div className={styles.qaCardBody}>
                <div className={styles.kicker}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <h3 className={styles.qaCardTitle}>
                  {decodeHtmlEntities(post.title.rendered)}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <FeaturedEvents />
      <AuthorsStrip />
      <QAStrip />
    </main>
  );
}

export default HomePage;
