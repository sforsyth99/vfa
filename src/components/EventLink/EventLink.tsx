import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { track } from '../../utils/analytics';
import { eventPath } from '../../utils/eventPath';

interface Props {
  slug: string;
  isKidfest?: boolean;
  eventType?: string;
  eventbriteUrl?: string | null;
  eventTitle?: string;
  className?: string;
  children: ReactNode;
}

export function EventLink({ slug, isKidfest, eventType, eventbriteUrl, eventTitle, className, children }: Props) {
  if (isKidfest && eventType === 'author_fair') {
    return <Link to="/kidsfest2026" className={className}>{children}</Link>;
  }
  if (eventbriteUrl) {
    return (
      <a
        href={eventbriteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => track({ name: 'eventbrite_click', event_label: eventTitle ?? slug })}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={eventPath(slug)} className={className}>
      {children}
    </Link>
  );
}
