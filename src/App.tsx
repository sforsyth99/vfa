import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { SkipToContent } from './components/SkipToContent';
import { ScrollToTop } from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/Home';
import Events from './pages/Events';
import DynamicPage from './pages/DynamicPage';
import InterviewPage from './pages/Interview';
import InterviewsPage from './pages/Interviews';
import PersonPage from './pages/Person';
import FestivalEventPage from './pages/FestivalEvent';
import VenuePage from './pages/Venue';
import BookPage from './pages/Book';

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <SkipToContent />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/pages/:slug" element={<DynamicPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/interviews/:slug" element={<InterviewPage />} />
          <Route path="/people/:slug" element={<PersonPage />} />
          <Route path="/festival-events/:slug" element={<FestivalEventPage />} />
          <Route path="/venues/:slug" element={<VenuePage />} />
          <Route path="/books/:slug" element={<BookPage />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </>
  );
}

export default App;
