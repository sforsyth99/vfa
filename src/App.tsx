import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { SkipToContent } from './components/SkipToContent/SkipToContent';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop';
import { GoogleAnalytics } from './components/GoogleAnalytics/GoogleAnalytics';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { PageLoader } from './components/PageLoader/PageLoader';
import { lazyPage } from './utils/lazyPage';
// The home page is the most common landing page, so it stays in the main
// bundle. Every other page's code loads only when that page is visited.
import HomePage from './pages/Home/Home';

const AllContent2026Page = lazyPage(() => import('./pages/AllContent2026/AllContent2026'));
const Events = lazyPage(() => import('./pages/Events/Events'));
const DynamicPage = lazyPage(() => import('./pages/DynamicPage/DynamicPage'));
const InterviewPage = lazyPage(() => import('./pages/Interview/Interview'));
const InterviewsPage = lazyPage(() => import('./pages/Interviews/Interviews'));
const PersonPage = lazyPage(() => import('./pages/Person/Person'));
const FestivalEventPage = lazyPage(() => import('./pages/FestivalEvent/FestivalEvent'));
const VenuePage = lazyPage(() => import('./pages/Venue/Venue'));
const BookPage = lazyPage(() => import('./pages/Book/Book'));
const KidsFest2026Page = lazyPage(() => import('./pages/KidsFest2026/KidsFest2026'));
const AuthorsPage = lazyPage(() => import('./pages/Authors/Authors'));
const BooksPage = lazyPage(() => import('./pages/Books/Books'));
const VenuesPage = lazyPage(() => import('./pages/Venues/Venues'));
const WhoWeArePage = lazyPage(() => import('./pages/WhoWeAre/WhoWeAre'));
const StrategicPlanPage = lazyPage(() => import('./pages/StrategicPlan/StrategicPlan'));
const ArchivesPage = lazyPage(() => import('./pages/Archives/Archives'));
const EventbriteTestPage = lazyPage(() => import('./pages/EventbriteTest/EventbriteTest'));
const NotFoundPage = lazyPage(() => import('./pages/NotFound/NotFound'));

function App() {
  return (
    <>
      <ScrollToTop />
      <GoogleAnalytics />
      <SkipToContent />
      <Header />
      <ErrorBoundary>
        <Suspense
          fallback={
            <main id="main-content">
              <PageLoader />
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/2026-all" element={<AllContent2026Page />} />
            <Route path="/events" element={<Events />} />
            <Route path="/category/qa" element={<Navigate to="/interviews" replace />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/interviews/:slug" element={<InterviewPage />} />
            <Route path="/people/:slug" element={<PersonPage />} />
            <Route path="/events/:slug" element={<FestivalEventPage />} />
            <Route path="/venues/:slug" element={<VenuePage />} />
            <Route path="/books/:slug" element={<BookPage />} />
            <Route path="/kidsfest2026" element={<KidsFest2026Page />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/who-we-are" element={<WhoWeArePage />} />
            <Route path="/strategic-plan" element={<StrategicPlanPage />} />
            <Route path="/archives" element={<ArchivesPage />} />
            <Route path="/qa-archive-page" element={<ArchivesPage />} />
            <Route path="/test-widget" element={<EventbriteTestPage />} />
            <Route path="/:slug" element={<DynamicPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </>
  );
}

export default App;
