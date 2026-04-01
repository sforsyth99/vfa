import { useGetTribeEvent } from '../api/events/useGetTribeEvent.ts';
import { useGetTribeVenue } from '../api/events/useGetTribeVenue.ts';
import { sanitizeHtml } from '../utils/sanitizeHtml';

export interface TribeEventCardProps {
  eventSlug: string;
  venueSlug: string;
}

// TODO rename slug to id
export function TribeEventCard({ eventSlug, venueSlug }: TribeEventCardProps) {
  const { data: event } = useGetTribeEvent({ eventSlug });
  const { data: venue } = useGetTribeVenue({ venueSlug });
  if (!event) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.title.rendered) }} />
      <p className="text-gray-600 mb-4">{event.date}</p>
      <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.content.rendered) }} />
      <p className="text-gray-800">{venue?.title.rendered}</p>

    </div>
  );
}