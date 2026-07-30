export function eventPath(slug: string, isKidfest: boolean): string {
  return isKidfest ? '/kidsfest2026' : `/festival-events/${slug}`;
}
