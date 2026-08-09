import { useEffect } from 'react';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { Container } from '../../components/Container/Container';
import { PageLoader } from '../../components/PageLoader/PageLoader';

const EVENT_ID = '1992291916754';
const CONTAINER_ID = `eventbrite-widget-container-${EVENT_ID}`;
const MODAL_TRIGGER_ID = `eventbrite-widget-modal-trigger-${EVENT_ID}`;

function InlineEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.eventbrite.ca/static/widgets/eb_widgets.js';
    script.async = true;
    script.onload = () => {
      window.EBWidgets?.createWidget({
        widgetType: 'checkout',
        eventId: EVENT_ID,
        iframeContainerId: CONTAINER_ID,
        iframeContainerHeight: 425,
        onOrderComplete: () => console.log('Order complete (inline)'),
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return <div id={CONTAINER_ID} style={{ minHeight: 425 }} />;
}

function ModalEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.eventbrite.ca/static/widgets/eb_widgets.js';
    script.async = true;
    script.onload = () => {
      window.EBWidgets?.createWidget({
        widgetType: 'checkout',
        eventId: EVENT_ID,
        modal: true,
        modalTriggerElementId: MODAL_TRIGGER_ID,
        onOrderComplete: () => console.log('Order complete (modal)'),
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <>
      <noscript>
        <a href={`https://www.eventbrite.ca/e/in-conversation-with-emily-st-john-mandel-tickets-${EVENT_ID}`} rel="noopener noreferrer" target="_blank">
          Buy Tickets on Eventbrite
        </a>
      </noscript>
      <button id={MODAL_TRIGGER_ID} type="button" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>
        Buy Tickets (modal)
      </button>
    </>
  );
}

export default function EventbriteTestPage() {
  const { data: events, isLoading } = useGetFestivalEvents();
  if (isLoading) return <PageLoader />;

  const event = (events ?? []).find((e) => e.event_data.eventbrite_url?.includes(EVENT_ID));
  const title = event ? decodeHtmlEntities(event.title?.rendered ?? '') : 'Emily St. John Mandel';

  return (
    <main id="main-content">
      <Container narrow>
        <h1>{title}</h1>
        <h2 style={{ marginTop: '2rem' }}>Option 1: Inline embed</h2>
        <InlineEmbed />
        <h2 style={{ marginTop: '2rem' }}>Option 2: Modal (button trigger)</h2>
        <ModalEmbed />
      </Container>
    </main>
  );
}
