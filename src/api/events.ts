// src/api/events.ts
// Dummy API client for events
import type { Event } from './types';

const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Opening Night Gala',
    date: '2026-09-15T19:00:00Z',
    description: 'Kick off the festival with a special gala event.',
    eventbriteUrl: 'https://eventbrite.com/e/1',
    featured: true,
    format: 'in-person',
    location: {
      indigenous: 'lək̓ʷəŋən',
      english: 'Victoria Conference Centre',
    },
  },
  {
    id: '2',
    title: 'Author Panel: Writing the Future',
    date: '2026-09-16T14:00:00Z',
    description: 'A panel of authors discuss the future of literature.',
    eventbriteUrl: 'https://eventbrite.com/e/2',
    featured: false,
    format: 'online',
    location: {
      indigenous: '',
      english: 'Online',
    },
  },
];

export async function fetchEvents(): Promise<Event[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return dummyEvents;
}
