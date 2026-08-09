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
        modal?: boolean;
        modalTriggerElementId?: string;
        iframeContainerId?: string;
        iframeContainerHeight?: number;
        onOrderComplete?: () => void;
      }) => void;
    };
  }
}

function extractEventbriteId(url: string): string | null {
  const matches = [...url.matchAll(/\d{6,}/g)];
  return matches.length > 0 ? matches[matches.length - 1][0] : null;
}

function extractEventbriteDomain(url: string): string {
  const match = url.match(/https?:\/\/(www\.[^/]+)/);
  return match ? match[1] : 'www.eventbrite.com';
}

interface Props {
  eventbriteUrl: string | null | undefined;
  eventTitle: string;
  hasTickets: boolean;
}

export function EventbriteWidget({ eventbriteUrl, eventTitle, hasTickets }: Props) {
  const [loadError, setLoadError] = useState(false);
  const eventId = eventbriteUrl ? extractEventbriteId(eventbriteUrl.trim()) : null;
  const triggerId = eventId ? `eb-modal-trigger-${eventId}` : '';
  const scriptDomain = eventbriteUrl ? extractEventbriteDomain(eventbriteUrl) : 'www.eventbrite.com';

  useEffect(() => {
    if (!eventId || !triggerId) return;

    let cancelled = false;

    const initWidget = () => {
      if (cancelled) return;
      if (!document.getElementById(triggerId)) return;
      window.EBWidgets?.createWidget({
        widgetType: 'checkout',
        eventId,
        modal: true,
        modalTriggerElementId: triggerId,
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
    script.src = `https://${scriptDomain}/static/widgets/eb_widgets.js`;
    script.async = true;
    script.onload = initWidget;
    script.onerror = () => { if (!cancelled) setLoadError(true); };
    document.body.appendChild(script);

    return () => { cancelled = true; };
  }, [eventId, triggerId, eventTitle, scriptDomain]);

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
        className={styles.buyButton}
        onClick={() => track({ name: 'eventbrite_click', event_label: eventTitle })}
      >
        <FormattedMessage id="festivalEvent.buyTickets" />
      </a>
    );
  }

  return (
    <button id={triggerId} type="button" className={styles.buyButton}>
      <FormattedMessage id="festivalEvent.buyTickets" />
    </button>
  );
}
