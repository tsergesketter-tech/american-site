import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import DateSelector from '../components/FlightSearch/DateSelector';
import FilterBar from '../components/FlightSearch/FilterBar';
import FlightCard from '../components/FlightSearch/FlightCard';

const FlightResults = () => {
  const navigate = useNavigate();
  const { searchParams } = useBooking();

  const [selectedDate, setSelectedDate] = useState('2026-01-13');
  const [filters, setFilters] = useState({
    stops: 'all',
    airline: 'all',
    sortBy: 'depart'
  });

  // Mock date data for date selector
  const dates = [
    { date: '2026-01-10', day: 'Sat, Jan 10', price: 694 },
    { date: '2026-01-11', day: 'Sun, Jan 11', price: 694 },
    { date: '2026-01-12', day: 'Mon, Jan 12', price: 694 },
    { date: '2026-01-13', day: 'Tue, Jan 13', price: 694 },
    { date: '2026-01-14', day: 'Wed, Jan 14', price: 509 },
    { date: '2026-01-15', day: 'Thu, Jan 15', price: 476 },
    { date: '2026-01-16', day: 'Fri, Jan 16', price: 520 }
  ];

  // Mock flight data
  const mockFlights = [
    {
      id: 1,
      flightNumber: 'AA 2782',
      aircraft: '738-Boeing 737',
      origin: 'IND',
      destination: 'DFW',
      departTime: '6:00 AM',
      arriveTime: '7:55 AM',
      duration: '2h 55m',
      stops: 'Nonstop',
      mainPrice: 694,
      premiumPrice: 1074,
      amenities: ['wifi', 'power', 'entertainment', 'food']
    },
    {
      id: 2,
      flightNumber: 'AA 3231',
      aircraft: '738-Boeing 737',
      origin: 'IND',
      destination: 'DFW',
      departTime: '9:23 AM',
      arriveTime: '11:08 AM',
      duration: '2h 45m',
      stops: 'Nonstop',
      mainPrice: 694,
      premiumPrice: 1074,
      amenities: ['wifi', 'power', 'entertainment']
    },
    {
      id: 3,
      flightNumber: 'AA 1456',
      aircraft: '738-Boeing 737',
      origin: 'IND',
      destination: 'DFW',
      departTime: '1:15 PM',
      arriveTime: '3:00 PM',
      duration: '2h 45m',
      stops: 'Nonstop',
      mainPrice: 694,
      premiumPrice: 1074,
      amenities: ['wifi', 'power', 'entertainment', 'food']
    },
    {
      id: 4,
      flightNumber: 'AA 892',
      aircraft: '738-Boeing 737',
      origin: 'IND',
      destination: 'DFW',
      departTime: '4:30 PM',
      arriveTime: '6:25 PM',
      duration: '2h 55m',
      stops: 'Nonstop',
      mainPrice: 694,
      premiumPrice: 1074,
      amenities: ['wifi', 'power']
    },
    {
      id: 5,
      flightNumber: 'AA 2145',
      aircraft: '738-Boeing 737',
      origin: 'IND',
      destination: 'DFW',
      departTime: '7:45 PM',
      arriveTime: '9:30 PM',
      duration: '2h 45m',
      stops: 'Nonstop',
      mainPrice: 694,
      premiumPrice: 1074,
      amenities: ['wifi', 'power', 'entertainment']
    }
  ];

  const [flights, setFlights] = useState(mockFlights);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));

    // Apply sorting
    if (filterType === 'sortBy') {
      let sorted = [...flights];
      if (value === 'depart') {
        sorted.sort((a, b) => a.departTime.localeCompare(b.departTime));
      } else if (value === 'arrive') {
        sorted.sort((a, b) => a.arriveTime.localeCompare(b.arriveTime));
      } else if (value === 'duration') {
        sorted.sort((a, b) => a.duration.localeCompare(b.duration));
      }
      setFlights(sorted);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Choose flights</h1>
          <button
            onClick={() => navigate('/')}
            className="text-aa-light-blue hover:underline text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            New search
          </button>
        </div>

        {/* Trip Summary */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="mb-2">
              <span className="text-xs text-gray-600 uppercase tracking-wide">DEPART</span>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-1">
              {searchParams.fromCity}, {searchParams.from} to {searchParams.toCity}, {searchParams.to}
            </h2>
            <p className="text-lg text-gray-700 mb-3">
              Tuesday, January 13, 2026
            </p>
            <div className="flex items-center gap-2 text-sm text-aa-light-blue">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              American Airlines flights may be listed first.
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          dates={dates}
        />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          resultCount={flights.length}
        />

        {/* Cabin Class Tabs */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 bg-white border-b-4 border-aa-light-blue text-aa-blue py-3 font-semibold">
            Main
          </button>
          <button className="flex-1 bg-aa-blue text-white py-3 font-semibold">
            Premium
          </button>
        </div>

        {/* Flight Results */}
        <div className="space-y-0">
          {flights.map(flight => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <button className="text-aa-light-blue hover:underline font-medium">
            Show more flights
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
