import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  // Search parameters
  const [searchParams, setSearchParams] = useState({
    from: 'IND',
    fromCity: 'Indianapolis',
    to: 'DFW',
    toCity: 'Dallas/Fort Worth',
    departDate: '2026-01-13',
    returnDate: null,
    passengers: 1,
    tripType: 'roundTrip',
    cabin: 'economy'
  });

  // Selected flights
  const [selectedFlights, setSelectedFlights] = useState({
    outbound: null,
    return: null
  });

  // Seat selections
  const [selectedSeats, setSelectedSeats] = useState({
    outbound: [],
    return: []
  });

  // Passenger details
  const [passengers, setPassengers] = useState([]);

  // Payment info
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Booking state
  const [bookingState, setBookingState] = useState('searching'); // searching, selecting, seats, checkout, confirmed

  // Cart total
  const [cartTotal, setCartTotal] = useState(0);

  // Update search parameters
  const updateSearchParams = (params) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  // Select a flight
  const selectFlight = (direction, flight) => {
    setSelectedFlights(prev => ({ ...prev, [direction]: flight }));
    updateCartTotal();
  };

  // Update cart total
  const updateCartTotal = () => {
    let total = 0;
    if (selectedFlights.outbound) total += selectedFlights.outbound.price;
    if (selectedFlights.return) total += selectedFlights.return.price;
    setCartTotal(total);
  };

  // Clear booking
  const clearBooking = () => {
    setSelectedFlights({ outbound: null, return: null });
    setSelectedSeats({ outbound: [], return: [] });
    setPassengers([]);
    setPaymentInfo(null);
    setCartTotal(0);
    setBookingState('searching');
  };

  const value = {
    searchParams,
    updateSearchParams,
    selectedFlights,
    selectFlight,
    selectedSeats,
    setSelectedSeats,
    passengers,
    setPassengers,
    paymentInfo,
    setPaymentInfo,
    bookingState,
    setBookingState,
    cartTotal,
    clearBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
