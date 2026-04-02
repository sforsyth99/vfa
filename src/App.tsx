import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { SkipToContent } from './components/SkipToContent';
import HomePage from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Test from './pages/Test';
import Books from './pages/Books';
import Authors from './pages/Authors';
import TribeVenues from './pages/TribeVenues';
import TribeOrganizers from './pages/TribeOrganizers';
import MediaPage from './pages/Media';
import Menus from './pages/Menus';
import DynamicPage from './pages/DynamicPage';

function App() {
  return (
    <>
      <Header />
      <SkipToContent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/books" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/venues" element={<TribeVenues />} />
        <Route path="/organizers" element={<TribeOrganizers />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/test" element={<Test />} />
        <Route path="/pages/:slug" element={<DynamicPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
