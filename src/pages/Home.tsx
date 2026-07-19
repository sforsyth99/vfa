import styles from './Home.module.css';
// import { useGetCategories } from '../api/categories/useGetCategories';
import { useGetInterviews } from '../api/interviews/useGetInterviews';
import { useGetAuthors } from '../api/people/useGetAuthors';
import { useGetKidfestAuthors } from '../api/people/useGetKidfestAuthors';
import { useGetFestivalEvents } from '../api/festivalEvents/useGetFestivalEvents';
import type { FestivalEvent } from '../api/festivalEvents/festivalEventTypes';
import { useGetBooks } from '../api/books/useGetBooks';
// import { useMemo } from 'react';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import { Link } from 'react-router-dom';
//
// function QandA2024Posts() {
//   // Get all categories and find the Q&A 2024 category id by slug
//   const { data: categories, isLoading: catLoading, isError: catError } = useGetCategories();
//   const QNA_2024_SLUG = 'qa-2024';
//   const qnaCategory = useMemo(
//     () => categories?.find((cat) => cat.slug === QNA_2024_SLUG),
//     [categories],
//   );

// const categoryId = qnaCategory?.id;

// Only call the hook if categoryId is defined
// const { data,, isError, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
//   useGetPostsByCategory(categoryId ?? -1, 10); // Use -1 as a dummy value if undefined

// if (catLoading || (categoryId && isLoading)) return <div>Loading Q&amp;A 2024 posts...</div>;
// if (catError) return <div>Error loading categories.</div>;
// if (!categoryId) return <div>Q&amp;A 2024 category not found.</div>;
// if (isError)
//   return (
//     <div>Error loading posts: {error instanceof Error ? error.message : 'Unknown error'}</div>
//   );
//
// const allPosts = data ? data.pages.flat() : [];
// if (!allPosts.length) return <div>No Q&amp;A 2024 posts found.</div>;
//
//   return (
//     <div style={{ margin: '2rem 0' }}>
//       <h2>Q&amp;A 2024</h2>
//       <ul>
//         {allPosts.map((post) => (
//           <li key={post.id}>
//             <Link to={`/interviews/${post.slug}`}>{decodeHtmlEntities(post.title.rendered)}</Link>
//           </li>
//         ))}
//       </ul>
//       {hasNextPage && (
//         <button
//           onClick={() => fetchNextPage()}
//           disabled={isFetchingNextPage}
//           style={{ marginTop: 16 }}
//         >
//           {isFetchingNextPage ? 'Loading...' : 'Load more'}
//         </button>
//       )}
//       {!hasNextPage && <div style={{ marginTop: 16 }}>No more posts.</div>}
//     </div>
//   );
// }

function InterviewsList() {
  const { data: interviews, isLoading, isError } = useGetInterviews();

  if (isLoading) return <div>Loading interviews...</div>;
  if (isError) return <div>Error loading interviews.</div>;
  if (!interviews?.length) return null;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Interviews</h2>
      <ul className={styles.interviewList}>
        {interviews.map((interview) => {
          const cover = interview.interview_data?.book_cover;
          return (
            <li key={interview.id} className={styles.interviewItem}>
              {cover && (
                <img src={cover[0]} alt="" className={styles.interviewCover} />
              )}
              <Link to={`/interviews/${interview.slug}`}>
                {decodeHtmlEntities(interview.title?.rendered ?? '')}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AuthorPhotoGrid({ heading, authors, kids = false }: { heading: string; authors: { id: number; slug?: string; name: string; photo: [string, number, number, boolean] | false | null }[]; kids?: boolean }) {
  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>{heading}</h2>
      <div className={styles.authorGrid}>
        {authors.map((author) => {
          if (!author.photo) return null;
          return (
            <Link key={author.id} to={`/people/${author.slug}`} className={kids ? styles.kidsAuthorPhoto : styles.authorPhoto}>
              <img src={author.photo[0]} alt={author.name} title={author.name} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AuthorsList() {
  const { data: authors, isLoading, isError } = useGetAuthors(2026);

  if (isLoading) return <div>Loading authors...</div>;
  if (isError) return <div>Error loading authors.</div>;
  if (!authors?.length) return null;

  return <AuthorPhotoGrid heading="Authors" authors={authors} />;
}

function KidsAuthorsList() {
  const { data: authors, isLoading, isError } = useGetKidfestAuthors(2026);

  if (isLoading) return <div>Loading kids authors...</div>;
  if (isError) return <div>Error loading kids authors.</div>;
  if (!authors?.length) return null;

  return <AuthorPhotoGrid heading="Kids Authors" authors={authors} kids />;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

function ScheduleTable({ events }: { events: FestivalEvent[] }) {
  return (
    <table className={styles.scheduleTable}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Event</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => {
          const { event_date, time_start, time_end, venue, tickets } = event.event_data;
          const timeStr = time_start
            ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
            : '';
          const hasOnline = tickets.some((t) => t.type === 'online');
          const location = venue?.name
            ? hasOnline ? `${venue.name} and online` : venue.name
            : hasOnline ? 'Online' : '—';
          return (
            <tr key={event.id}>
              <td className={styles.scheduleDate}>{event_date ? formatDate(event_date) : '—'}</td>
              <td className={styles.scheduleTime}>{timeStr || '—'}</td>
              <td className={styles.scheduleName}>
                <Link to={`/festival-events/${event.slug}`}>
                  {decodeHtmlEntities(event.title?.rendered ?? '')}
                </Link>
              </td>
              <td className={styles.scheduleLocation}>{location}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function EventSchedule() {
  const { data: events, isLoading, isError } = useGetFestivalEvents();

  if (isLoading) return <div>Loading events...</div>;
  if (isError) return <div>Error loading events.</div>;
  if (!events?.length) return null;

  const today = new Date().toISOString().slice(0, 10);

  const upcoming = events
    .filter((e) => e.event_data.event_date >= today)
    .sort((a, b) => {
      const dateCmp = a.event_data.event_date.localeCompare(b.event_data.event_date);
      if (dateCmp !== 0) return dateCmp;
      return a.event_data.time_start.localeCompare(b.event_data.time_start);
    });

  const past = events
    .filter((e) => e.event_data.event_date < today)
    .sort((a, b) => b.event_data.event_date.localeCompare(a.event_data.event_date));

  const regular = upcoming.filter((e) => !e.event_data.is_kidfest);
  const kidfest = upcoming.filter((e) => e.event_data.is_kidfest);
  const online = upcoming.filter((e) => e.event_data.tickets.some((t) => t.type === 'online'));

  if (!upcoming.length && !past.length) return null;

  return (
    <>
      {regular.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>Upcoming Events</h2>
          <ScheduleTable events={regular} />
        </div>
      )}
      {kidfest.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>KidsFest Events</h2>
          <ScheduleTable events={kidfest} />
        </div>
      )}
      {online.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>Online Events</h2>
          <p className={styles.scheduleIntro}>Can't make it in person? Join us online for select events.</p>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {online.map((event) => {
                const { event_date, time_start, time_end } = event.event_data;
                const timeStr = time_start
                  ? `${formatTime(time_start)}${time_end ? ` – ${formatTime(time_end)}` : ''}`
                  : '';
                return (
                  <tr key={event.id}>
                    <td className={styles.scheduleDate}>{event_date ? formatDate(event_date) : '—'}</td>
                    <td className={styles.scheduleTime}>{timeStr || '—'}</td>
                    <td className={styles.scheduleName}>
                      <Link to={`/festival-events/${event.slug}`}>
                        {decodeHtmlEntities(event.title?.rendered ?? '')}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {past.length > 0 && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleHeading}>Past Events</h2>
          <ScheduleTable events={past} />
        </div>
      )}
    </>
  );
}

function BooksList() {
  const { data: books, isLoading, isError } = useGetBooks();

  if (isLoading) return <div>Loading books...</div>;
  if (isError) return <div>Error loading books.</div>;
  if (!books?.length) return null;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>What we're reading</h2>
      <div className={styles.bookGrid}>
        {books.map((book) => {
          const cover = book.book_data?.cover_image;
          if (!cover) return null;
          return (
            <Link key={book.id} to={`/books/${book.slug}`} className={styles.bookCover}>
              <img
                src={cover[0]}
                alt={decodeHtmlEntities(book.title?.rendered ?? '')}
                title={decodeHtmlEntities(book.title?.rendered ?? '')}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className={styles.hero}>
      <p className={styles.heroEyebrow}>Victoria, BC · October 12–18, 2026</p>
      <h1 className={styles.heroTitle}>Victoria Festival of Authors</h1>
      <p className={styles.heroSubtitle}>
        A week-long celebration of storytelling, ideas, and the writers who shape our world.
        Join us for readings, conversations, and events across Victoria.
      </p>
      <p className={styles.heroKidfest}>
        ✦ KidsFest on October 17th — a special day of stories and imagination for young readers.
      </p>
    </div>
  );
}

export function HomePage() {
  return (
    <main id="main-content" className={styles.homeMain}>
      <Hero />
      <EventSchedule />
      <InterviewsList />
      <AuthorsList />
      <KidsAuthorsList />
      <BooksList />
    </main>
  );
}

export default HomePage;
