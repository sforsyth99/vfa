declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Add new event types here as tracking grows.
// Each union member's properties map directly to GA4 event parameters.
type TrackableEvent =
  | { name: 'add_to_calendar'; event_label: string; event_location: 'hero' | 'event_card' | 'home_promo' }
  | { name: 'eventbrite_click'; event_label: string }
  | { name: 'munros_click'; event_label: string }
  | { name: 'social_click'; event_label: string }
  | { name: 'donate_click'; event_location: 'header_desktop' | 'header_mobile' | 'footer' }
  | { name: 'newsletter_signup'; event_location: 'footer' | 'homepage' };

export function track({ name, ...params }: TrackableEvent): void {
  window.gtag?.('event', name, params);
}
