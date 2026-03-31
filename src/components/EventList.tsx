import React from 'react';
import { EventCard } from './EventCard';
import type { TbdEvents } from '../api/events/tbdEvents.ts';

interface EventListProps {
  events: TbdEvents[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => (
  <div>
    {events.map(event => (
      <EventCard key={event.id} event={event} />
    ))}
  </div>
);
