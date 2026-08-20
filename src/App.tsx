import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { SkipToContent } from './components/SkipToContent/SkipToContent';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop';
import { GoogleAnalytics } from './components/GoogleAnalytics/GoogleAnalytics';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AllContent2026Page from './pages/AllContent2026/AllContent2026';
import HomePage from './pages/Home/Home';
import Events from './pages/Events/Events';
import DynamicPage from './pages/DynamicPage/DynamicPage';
import InterviewPage from './pages/Interview/Interview';
import InterviewsPage from './pages/Interviews/Interviews';
import PersonPage from './pages/Person/Person';
import FestivalEventPage from './pages/FestivalEvent/FestivalEvent';
import VenuePage from './pages/Venue/Venue';
import BookPage from './pages/Book/Book';
import KidsFest2026Page from './pages/KidsFest2026/KidsFest2026';
import AuthorsPage from './pages/Authors/Authors';
import BooksPage from './pages/Books/Books';
import VenuesPage from './pages/Venues/Venues';
import WhoWeArePage from './pages/WhoWeAre/WhoWeAre';
import StrategicPlanPage from './pages/StrategicPlan/StrategicPlan';
import ArchivesPage from './pages/Archives/Archives';
import EventbriteTestPage from './pages/EventbriteTest/EventbriteTest';
import NotFoundPage from './pages/NotFound/NotFound';

function App() {
  return (
    <>
      <ScrollToTop />
      <GoogleAnalytics />
      <SkipToContent />
      <Header />
      <ErrorBoundary>
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
      </ErrorBoundary>
      <Footer />
    </>
  );
}

export default App;
