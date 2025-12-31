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
          </Routes>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
