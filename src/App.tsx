import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { SkipToContent } from './components/SkipToContent';
import HomePage from './pages/Home';
import Events from './pages/Events';
import DynamicPage from './pages/DynamicPage';

function App() {
  return (
    <>
      <Header />
      <SkipToContent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/pages/:slug" element={<DynamicPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
