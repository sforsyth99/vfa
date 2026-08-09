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
    <button
      id={MODAL_TRIGGER_ID}
      type="button"
      style={{
        display: 'block',
        marginTop: '1rem',
        padding: '1rem 2rem',
        fontSize: '1.25rem',
        fontWeight: 700,
        background: '#e05c2a',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      🎟 Buy Tickets — opens popup
    </button>
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
        <h2 style={{ marginTop: '2rem' }}>Option 1: Inline checkout</h2>
        <InlineEmbed />
        <h2 style={{ marginTop: '3rem' }}>Option 2: Modal checkout (button)</h2>
        <p style={{ marginBottom: '0.5rem', color: '#666' }}>Click the button below — checkout opens in a popup overlay.</p>
        <ModalEmbed />
      </Container>
    </main>
  );
}
