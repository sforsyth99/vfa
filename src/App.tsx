import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { SkipToContent } from './components/SkipToContent';
import HomePage from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Test from './pages/Test';

function App() {
  return (
    <>
      <Header />
      <SkipToContent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
