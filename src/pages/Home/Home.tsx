import { Container } from '../../components/Container/Container';
import { FeaturedEvents } from '../../components/FeaturedEvents/FeaturedEvents';
import { InstagramFeed } from '../../components/InstagramFeed/InstagramFeed';
import { Hero } from '../../components/Hero/Hero';
import { HomeQuickNav } from '../../components/HomeQuickNav/HomeQuickNav';
import { HomeAuthorsSpotlight } from '../../components/HomeAuthorsSpotlight/HomeAuthorsSpotlight';
import { KidsFestPromo } from '../../components/KidsFestPromo/KidsFestPromo';
import { HomeNewsletter } from '../../components/HomeNewsletter/HomeNewsletter';
import { HomeWorkshopCallout, HomeOnlineCallout } from '../../components/HomeEventCallouts/HomeEventCallouts';
import { LatestInterviews } from '../../components/LatestInterviews/LatestInterviews';

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <HomeQuickNav />
      <FeaturedEvents />
      <Container>
        <HomeAuthorsSpotlight />
      </Container>
      <KidsFestPromo />
      <HomeWorkshopCallout />
      <HomeNewsletter />
      <Container>
        <LatestInterviews />
      </Container>
      <HomeOnlineCallout />
      <Container>
        <InstagramFeed />
      </Container>
    </main>
  );
}
