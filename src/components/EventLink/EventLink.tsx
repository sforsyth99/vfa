import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { eventPath } from '../../utils/eventPath';

interface Props {
  slug: string;
  isKidfest?: boolean;
  eventType?: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export function EventLink({ slug, isKidfest, eventType, className, onClick, children }: Props) {
  if (isKidfest && eventType === 'author_fair') {
    return <Link to="/kidsfest2026" className={className} onClick={onClick}>{children}</Link>;
  }
  return (
    <Link to={eventPath(slug)} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
