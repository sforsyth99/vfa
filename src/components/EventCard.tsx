import React from 'react';
import styles from './EventCard.module.css';
import { FormattedMessage } from 'react-intl';
import type { TbdEvents } from '../api/events/tbdEvents.ts';

interface EventCardProps {
  event: TbdEvents;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <div className={styles.eventCard}>
    <h3>{event.title}</h3>
    <p>{
      event.date && !isNaN(new Date(event.date).getTime())
        ? new Date(event.date).toLocaleString()
        : <FormattedMessage id="event.dateTBA" defaultMessage="Date TBA" />
    }</p>
    <p>{event.description}</p>
    <a href={event.eventbriteUrl} target="_blank" rel="noopener noreferrer">
      <FormattedMessage id="event.buyTickets" defaultMessage="Buy Tickets" />
    </a>
    <div>
            <span>
                <FormattedMessage
                  id={event.format === 'online' ? 'event.online' : 'event.inPerson'}
                  defaultMessage={event.format === 'online' ? 'Online Event' : 'In-Person Event'}
                />
            </span>
      {event.location && (
        <span>
                    <FormattedMessage id="event.location" defaultMessage="Location" />: {event.location.english}
                </span>
      )}
    </div>
  </div>
);
