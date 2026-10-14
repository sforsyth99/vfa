import type { EventData } from '../api/festivalEvents/festivalEventTypes';
import { getPacificToday } from './eventDates';

interface SoldOutParams {
  eventbriteUrl: string | null | undefined;
  hasTickets: boolean;
  ticketsLiveDate?: string | null;
  eventType?: string;
}

/**
 * An event is "sold out" when it has tickets and ticketing is live, but there is
 * no Eventbrite link to buy them. The KidsFest "meet the authors" fair
 * (`author_fair`) is a free, drop-in event with no tickets, so it is never
 * marked sold out — but KidsFest workshops, which do have tickets, can be.
 */
export function isSoldOut({ eventbriteUrl, hasTickets, ticketsLiveDate, eventType }: SoldOutParams): boolean {
  if (eventType === 'author_fair') return false;
  const today = getPacificToday();
  const ticketsLive = !ticketsLiveDate || today >= ticketsLiveDate;
  return hasTickets && ticketsLive && !eventbriteUrl;
}

/** Convenience wrapper for callers that hold the full event data object. */
export function isEventSoldOut(d: EventData): boolean {
  return isSoldOut({
    eventbriteUrl: d.eventbrite_url,
    hasTickets: (d.tickets?.length ?? 0) > 0,
    ticketsLiveDate: d.tickets_live_date,
    eventType: d.event_type,
  });
}
