import styles from './Home.module.css';
// import { useGetCategories } from '../api/categories/useGetCategories';
import { useGetInterviews } from '../api/interviews/useGetInterviews';
import { useGetAuthors } from '../api/people/useGetAuthors';
import { useGetKidfestAuthors } from '../api/people/useGetKidfestAuthors';
import { useGetFestivalEvents } from '../api/festivalEvents/useGetFestivalEvents';
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
      <ul>
        {interviews.map((interview) => (
          <li key={interview.id}>
            <Link to={`/interviews/${interview.slug}`}>
              {decodeHtmlEntities(interview.title?.rendered ?? '')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuthorsList() {
  const { data: authors, isLoading, isError } = useGetAuthors(2026);

  if (isLoading) return <div>Loading authors...</div>;
  if (isError) return <div>Error loading authors.</div>;
  if (!authors?.length) return null;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Authors</h2>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            <Link to={`/people/${author.slug}`}>{author.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KidsAuthorsList() {
  const { data: authors, isLoading, isError } = useGetKidfestAuthors(2026);

  if (isLoading) return <div>Loading kids authors...</div>;
  if (isError) return <div>Error loading kids authors.</div>;
  if (!authors?.length) return null;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Kids Authors</h2>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            <Link to={`/people/${author.slug}`}>{author.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
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

  if (!upcoming.length) return null;

  return (
    <div className={styles.scheduleSection}>
      <h2 className={styles.scheduleHeading}>Upcoming Events</h2>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Event</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {upcoming.map((event) => {
            const { event_date, time_start, time_end, eventbrite_url } = event.event_data;
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
                <td className={styles.scheduleTickets}>
                  {eventbrite_url && (
                    <a
                      href={eventbrite_url}
                      className={styles.ticketButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buy tickets
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.slug}`}>{decodeHtmlEntities(book.title?.rendered ?? '')}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomePage() {
  return (
    <main id="main-content" className={styles.homeMain}>
      <EventSchedule />
      <InterviewsList />
      <AuthorsList />
      <KidsAuthorsList />
      <BooksList />
    </main>
  );
}

export default HomePage;
