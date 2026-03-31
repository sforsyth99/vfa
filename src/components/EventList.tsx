import React from 'react';
import type { Event } from '../api/types';
import { EventCard } from './EventCard';

interface EventListProps {
    events: Event[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => (
    <div>
        {events.map(event => (
            <EventCard key={event.id} event={event} />
        ))}
    </div>
);
