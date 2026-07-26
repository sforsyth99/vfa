import { Container } from '../../components/Container/Container';
import { EventSchedule } from '../../components/EventSchedule/EventSchedule';
import { InstagramFeed } from '../../components/InstagramFeed/InstagramFeed';
import { Hero } from '../../components/Hero/Hero';

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Container>
        <EventSchedule />
        <InstagramFeed />
      </Container>
    </main>
  );
}
