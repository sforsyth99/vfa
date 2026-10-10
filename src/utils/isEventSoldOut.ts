import type { EventData } from '../api/festivalEvents/festivalEventTypes';

interface SoldOutParams {
  eventbriteUrl: string | null | undefined;
  hasTickets: boolean;
  ticketsLiveDate?: string | null;
  isKidfest: boolean;
}

/**
 * An event is "sold out" when it has tickets and ticketing is live, but there is
 * no Eventbrite link to buy them. KidsFest events are never marked sold out.
 */
export function isSoldOut({ eventbriteUrl, hasTickets, ticketsLiveDate, isKidfest }: SoldOutParams): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const ticketsLive = !ticketsLiveDate || today >= ticketsLiveDate;
  return hasTickets && ticketsLive && !eventbriteUrl && !isKidfest;
}

/** Convenience wrapper for callers that hold the full event data object. */
export function isEventSoldOut(d: EventData): boolean {
  return isSoldOut({
    eventbriteUrl: d.eventbrite_url,
    hasTickets: (d.tickets?.length ?? 0) > 0,
    ticketsLiveDate: d.tickets_live_date,
    isKidfest: d.is_kidfest,
  });
}
