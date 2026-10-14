/**
 * Date helpers for event filtering.
 *
 * Event dates (`event_date`) are plain YYYY-MM-DD strings representing the day
 * the event happens in Pacific Time. To decide whether an event is still
 * current we must compare against "today" in Pacific Time — not UTC. Using
 * `new Date().toISOString()` would roll over to the next day at 4–5pm Pacific,
 * making evening events look "past" hours before they start.
 */

/** The first day of the current festival season. Events before this are hidden. */
export const FESTIVAL_SEASON_START = '2026-10-01';

/**
 * Today's date as a YYYY-MM-DD string in Pacific Time (America/Los_Angeles),
 * so string comparisons against `event_date` roll over at midnight Pacific.
 */
export function getPacificToday(): string {
  // 'en-CA' formats as YYYY-MM-DD; timeZone handles PST/PDT automatically.
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
}
