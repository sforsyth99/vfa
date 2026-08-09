import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { eventPath } from '../../utils/eventPath';
import { EventLink } from '../EventLink/EventLink';
import { EventbriteLink } from '../EventbriteLink/EventbriteLink';
import type { PersonEvent } from '../../api/people/useGetPersonEvents';
import styles from './EventInfoCard.module.css';

interface Props {
  event: PersonEvent;
  name: string;
}

export function EventInfoCard({ event, name }: Props) {
  const intl = useIntl();
  const dateStr = event.event_date
    ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-CA', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className={styles.card}>
      <p className={styles.eyebrow}>
        {intl.formatMessage({ id: 'interview.seeLive' }, { firstName: name })}
      </p>
      <p className={styles.title}>
        {event.is_kidfest ? (
          <Link to="/kidsfest2026">{event.title}</Link>
        ) : (
          <EventLink slug={event.slug} eventbriteUrl={event.eventbrite_url} eventTitle={event.title}>
            {event.title}
          </EventLink>
        )}
      </p>
      {dateStr && (
        <p className={styles.date}>
          {dateStr}
          {event.time_start && ` · ${event.time_start} PT`}
        </p>
      )}
      {event.venue_name && <p className={styles.venue}>{event.venue_name}</p>}
      {event.is_kidfest ? (
        <Link to="/kidsfest2026" className={styles.button}>
          <FormattedMessage id="interview.learnMore" />
        </Link>
      ) : event.eventbrite_url ? (
        <EventbriteLink href={event.eventbrite_url} eventTitle={event.title} className={styles.button}>
          <FormattedMessage id="interview.getTickets" />
        </EventbriteLink>
      ) : (
        <Link to={eventPath(event.slug)} className={styles.button}>
          <FormattedMessage id="interview.learnMore" />
        </Link>
      )}
    </div>
  );
}
