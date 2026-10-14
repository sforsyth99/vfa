import { describe, it, expect } from 'vitest';
import { isSoldOut } from './isEventSoldOut';

describe('isSoldOut', () => {
  it('marks a KidsFest workshop sold out when it has tickets but no Eventbrite link', () => {
    expect(
      isSoldOut({ eventbriteUrl: null, hasTickets: true, eventType: 'workshop' }),
    ).toBe(true);
  });

  it('never marks the KidsFest "meet the authors" fair sold out', () => {
    expect(
      isSoldOut({ eventbriteUrl: null, hasTickets: true, eventType: 'author_fair' }),
    ).toBe(false);
  });

  it('is not sold out when an Eventbrite link exists', () => {
    expect(
      isSoldOut({ eventbriteUrl: 'https://eventbrite.com/e/123456', hasTickets: true, eventType: 'workshop' }),
    ).toBe(false);
  });

  it('is not sold out when there are no tickets', () => {
    expect(
      isSoldOut({ eventbriteUrl: null, hasTickets: false, eventType: 'reading' }),
    ).toBe(false);
  });

  it('is not sold out before the tickets-live date', () => {
    expect(
      isSoldOut({ eventbriteUrl: null, hasTickets: true, ticketsLiveDate: '2999-01-01', eventType: 'workshop' }),
    ).toBe(false);
  });
});
