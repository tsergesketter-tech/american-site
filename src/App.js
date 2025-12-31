import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="App">
          <Header />
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
          </Routes>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
