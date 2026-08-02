import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { eventPath } from '../../utils/eventPath';

interface Props {
  slug: string;
  isKidfest: boolean;
  eventbriteUrl?: string | null;
  className?: string;
  children: ReactNode;
}

export function EventLink({ slug, isKidfest, eventbriteUrl, className, children }: Props) {
  if (eventbriteUrl) {
    return (
      <a href={eventbriteUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={eventPath(slug, isKidfest)} className={className}>
      {children}
    </Link>
  );
}
