import { Container } from '../../components/Container/Container';
import { EventSchedule } from '../../components/EventSchedule/EventSchedule';

export default function HomePage() {
  return (
    <main id="main-content">
      <Container>
        <EventSchedule />
      </Container>
    </main>
  );
}
