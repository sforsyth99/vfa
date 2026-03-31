import React from 'react';
import type { Event } from '../api/types';
import styles from './EventCard.module.css';
import { FormattedMessage } from 'react-intl';

interface EventCardProps {
    event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
    <div className={styles.eventCard}>
        <h3>{event.title}</h3>
        <p>{new Date(event.date).toLocaleString()}</p>
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
