import { Container } from '../../components/Container/Container';
import { EventSchedule } from '../../components/EventSchedule/EventSchedule';
import { InstagramFeed } from '../../components/InstagramFeed/InstagramFeed';

export default function HomePage() {
  return (
    <main id="main-content">
      <Container>
        <EventSchedule />
        <InstagramFeed />
      </Container>
    </main>
  );
}
