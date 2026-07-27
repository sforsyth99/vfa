import { Container } from '../../components/Container/Container';
import { FeaturedEvents } from '../../components/FeaturedEvents/FeaturedEvents';
import { InstagramFeed } from '../../components/InstagramFeed/InstagramFeed';
import { Hero } from '../../components/Hero/Hero';
import { KidsFestPromo } from '../../components/KidsFestPromo/KidsFestPromo';

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <FeaturedEvents />
      <KidsFestPromo />
      <Container>
        <InstagramFeed />
      </Container>
      {/*<Container>*/}
      {/*  <EventSchedule hideKidfest hidePast />*/}
      {/*</Container>*/}
    </main>
  );
}
