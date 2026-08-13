import { Container } from '../../components/Container/Container';
import { InstagramFeed } from '../../components/InstagramFeed/InstagramFeed';
import { Hero } from '../../components/Hero/Hero';
import { HomeAuthorsSpotlight } from '../../components/HomeAuthorsSpotlight/HomeAuthorsSpotlight';
import { HomeEventBrowser } from '../../components/HomeEventBrowser/HomeEventBrowser';
import { KidsFestPromo } from '../../components/KidsFestPromo/KidsFestPromo';
import { HomeNewsletter } from '../../components/HomeNewsletter/HomeNewsletter';
import { HomeWorkshopCallout, HomeOnlineCallout } from '../../components/HomeEventCallouts/HomeEventCallouts';
import { HomeReadingList } from '../../components/HomeReadingList/HomeReadingList';
import { LatestInterviews } from '../../components/LatestInterviews/LatestInterviews';

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <HomeEventBrowser />
      <KidsFestPromo />
      <HomeAuthorsSpotlight />
      <HomeReadingList />
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
