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
        onOrderComplete?: () => void;
      }) => void;
    };
  }
}

function extractEventbriteId(url: string): string | null {
  const match = url.match(/(\d+)(?:[?#]|$)/);
  return match ? match[1] : null;
}

interface Props {
  eventbriteUrl: string | null | undefined;
  eventTitle: string;
  hasTickets: boolean;
}

export function EventbriteWidget({ eventbriteUrl, eventTitle, hasTickets }: Props) {
  const [loadError, setLoadError] = useState(false);
  const eventId = eventbriteUrl ? extractEventbriteId(eventbriteUrl) : null;
  const containerId = eventId ? `eb-widget-${eventId}` : '';

  useEffect(() => {
    if (!eventId || !containerId) return;

    const initWidget = () => {
      window.EBWidgets?.createWidget({
        widgetType: 'checkout',
        eventId,
        iFrameContainerId: containerId,
        onOrderComplete: () => {
          track({ name: 'eventbrite_order_complete', event_label: eventTitle });
        },
      });
    };

    if (window.EBWidgets) {
      initWidget();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src*="eb_widgets"]');
    if (existing) {
      existing.addEventListener('load', initWidget);
      return () => existing.removeEventListener('load', initWidget);
    }

    const script = document.createElement('script');
    script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
    script.async = true;
    script.onload = initWidget;
    script.onerror = () => setLoadError(true);
    document.body.appendChild(script);
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
