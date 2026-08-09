import type { ReactNode } from 'react';
import { track } from '../../utils/analytics';

interface Props {
  href: string;
  eventTitle: string;
  className?: string;
  children: ReactNode;
}

export function EventbriteLink({ href, eventTitle, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track({ name: 'eventbrite_click', event_label: eventTitle })}
    >
      {children}
    </a>
  );
}
