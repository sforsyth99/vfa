import { useEffect } from 'react';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { Container } from '../../components/Container/Container';
import { PageLoader } from '../../components/PageLoader/PageLoader';

const EVENT_ID = '1992291916754';
const CONTAINER_ID = `eventbrite-widget-container-${EVENT_ID}`;

function WidgetEmbed() {
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
        onOrderComplete: () => console.log('Order complete'),
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return <div id={CONTAINER_ID} style={{ minHeight: 425 }} />;
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
        <WidgetEmbed />
      </Container>
    </main>
  );
}
