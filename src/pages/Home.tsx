import styles from './Home.module.css';
import { FormattedMessage } from 'react-intl';
import { EventList } from '../components/EventList';
import { fetchEvents } from '../api/events';

export function HomePage() {
  // const { data: events, isLoading, error } = useQuery<Event[]>({
  //   queryKey: ['events'],
  //   queryFn: fetchEvents,
  // });

  const events = fetchEvents();
  // if (isLoading) return <div>Loading events...</div>;
  // if (error) return <div>Failed to load events.</div>;

  const featured = events?.filter(e => e.featured) || [];
  const upcoming = events?.filter(e => !e.featured) || [];

  return (<main id="main-content" className={styles.homeMain}>
    <h1><FormattedMessage id="home.featuredEvents" defaultMessage="Featured Events" /></h1>
    {featured.length === 0 ? (<p><FormattedMessage id="home.noEvents"
                                                   defaultMessage="No upcoming events. Check back soon or sign up for our newsletter!" />
    </p>) : (<EventList events={featured} />)}
    <h2><FormattedMessage id="home.upcomingEvents" defaultMessage="Upcoming Events" /></h2>
    {upcoming.length === 0 ? (<p><FormattedMessage id="home.noEvents"
                                                   defaultMessage="No upcoming events. Check back soon or sign up for our newsletter!" />
    </p>) : (<EventList events={upcoming} />)}
  </main>);
}

export default HomePage;