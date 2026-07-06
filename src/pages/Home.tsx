import styles from './Home.module.css';
// import { useGetCategories } from '../api/categories/useGetCategories';
import { useGetInterviews } from '../api/interviews/useGetInterviews';
import { useGetPeople } from '../api/people/useGetPeople';
import { useGetFestivalEvents } from '../api/festivalEvents/useGetFestivalEvents';
import { useGetVenues } from '../api/venues/useGetVenues';
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
              {decodeHtmlEntities(interview.title.rendered)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PeopleList() {
  const { data: people, isLoading, isError } = useGetPeople();

  if (isLoading) return <div>Loading people...</div>;
  if (isError) return <div>Error loading people.</div>;
  if (!people?.length) return null;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>People</h2>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <Link to={`/people/${person.slug}`}>{decodeHtmlEntities(person.title.rendered)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FestivalEventsList() {
  const { data: events, isLoading, isError } = useGetFestivalEvents();

  if (isLoading) return <div>Loading events...</div>;
  if (isError) return <div>Error loading events.</div>;
  if (!events?.length) return null;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/festival-events/${event.slug}`}>
              {decodeHtmlEntities(event.title.rendered)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VenuesList() {
  const { data: venues, isLoading, isError } = useGetVenues();

  if (isLoading) return <div>Loading venues...</div>;
  if (isError) return <div>Error loading venues.</div>;
  if (!venues?.length) return null;

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Venues</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue.id}>
            <Link to={`/venues/${venue.slug}`}>{decodeHtmlEntities(venue.title.rendered)}</Link>
          </li>
        ))}
      </ul>
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
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.slug}`}>{decodeHtmlEntities(book.title.rendered)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomePage() {
  return (
    <main id="main-content" className={styles.homeMain}>
      <FestivalEventsList />
      <InterviewsList />
      <PeopleList />
      <VenuesList />
      <BooksList />
    </main>
  );
}

export default HomePage;
