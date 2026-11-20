import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import BookingWidget from './components/BookingWidget/BookingWidget';
import OffersSection from './components/OffersSection/OffersSection';
import Footer from './components/Footer/Footer';
import FlightResults from './pages/FlightResults';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import AAdvantageCitiCard from './pages/CreditCards/AAdvantageCitiCard';
import AAdvantageBusinessCard from './pages/CreditCards/AAdvantageBusinessCard';
import Promotions from './pages/Promotions/Promotions';
import IropDemo from './pages/IropDemo/IropDemo';

// The IROP demo is a full-bleed, phone-only stage, so it skips the site header/footer.
const SiteChrome = ({ children }) => {
  const { pathname } = useLocation();
  return pathname.startsWith('/irop-demo') ? null : children;
};

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="App">
          <SiteChrome><Header /></SiteChrome>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <BookingWidget />
                <OffersSection />
              </>
            } />
            <Route path="/flights" element={<FlightResults />} />
            <Route path="/flights/seats" element={<SeatSelection />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/credit-cards/aadvantage-citi" element={<AAdvantageCitiCard />} />
            <Route path="/credit-cards/business" element={<AAdvantageBusinessCard />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/irop-demo" element={<IropDemo />} />
          </Routes>
          <SiteChrome><Footer /></SiteChrome>
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
