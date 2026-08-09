import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { track } from '../../utils/analytics';
import styles from './EventbriteWidget.module.css';

declare global {
  interface Window {
    EBWidgets?: {
      createWidget: (options: {
        widgetType: 'checkout';
        eventId: string;
        iFrameContainerId: string;
        iFrameContainerHeight?: number;
        onOrderComplete?: () => void;
      }) => void;
    };
  }
}

function extractEventbriteId(url: string): string | null {
  // Grab all runs of 6+ digits; the last one is the event ID.
  // Handles trailing slashes, query strings, and .ca/.com domains.
  const matches = [...url.matchAll(/\d{6,}/g)];
  return matches.length > 0 ? matches[matches.length - 1][0] : null;
}

interface Props {
  eventbriteUrl: string | null | undefined;
  eventTitle: string;
  hasTickets: boolean;
}

export function EventbriteWidget({ eventbriteUrl, eventTitle, hasTickets }: Props) {
  const [loadError, setLoadError] = useState(false);
  const eventId = eventbriteUrl ? extractEventbriteId(eventbriteUrl.trim()) : null;
  const containerId = eventId ? `eb-widget-${eventId}` : '';

  useEffect(() => {
    if (!eventId || !containerId) return;

    let cancelled = false;

    const initWidget = () => {
      if (cancelled) return;
      if (!document.getElementById(containerId)) return;
      window.EBWidgets?.createWidget({
        widgetType: 'checkout',
        eventId,
        iFrameContainerId: containerId,
        iFrameContainerHeight: 425,
        onOrderComplete: () => {
          track({ name: 'eventbrite_order_complete', event_label: eventTitle });
        },
      });
    };

    if (window.EBWidgets) {
      initWidget();
      return () => { cancelled = true; };
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src*="eb_widgets"]');
    if (existing) {
      existing.addEventListener('load', initWidget);
      return () => {
        cancelled = true;
        existing.removeEventListener('load', initWidget);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
    script.async = true;
    script.onload = initWidget;
    script.onerror = () => { if (!cancelled) setLoadError(true); };
    document.body.appendChild(script);

    return () => { cancelled = true; };
  }, [eventId, containerId, eventTitle]);

  if (!eventbriteUrl) {
    if (!hasTickets) return null;
    return (
      <p className={styles.comingSoon}>
        <FormattedMessage id="festivalEvent.tickets.comingSoon" />
      </p>
    );
  }

  if (!eventId || loadError) {
    return (
      <a
        href={eventbriteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fallbackLink}
        onClick={() => track({ name: 'eventbrite_click', event_label: eventTitle })}
      >
        <FormattedMessage id="festivalEvent.buyTickets" />
      </a>
    );
  }

  return <div id={containerId} className={styles.widget} />;
}
