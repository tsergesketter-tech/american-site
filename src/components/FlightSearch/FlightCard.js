import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { trackAddToCart } from '../../services/salesforceTracking';

const FlightCard = ({ flight }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { selectFlight } = useBooking();
  const navigate = useNavigate();

  const handleSelectFlight = (cabin) => {
    const selectedFlight = {
      ...flight,
      selectedCabin: cabin,
      price: cabin === 'main' ? flight.mainPrice : flight.premiumPrice
    };

    // Track add to cart with Salesforce
    trackAddToCart(flight, cabin);

    selectFlight('outbound', selectedFlight);
    navigate('/flights/seats');
  };

  return (
    <div className="bg-white border border-gray-200 rounded mb-4 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Flight Details - Left Side */}
        <div className="col-span-12 md:col-span-6">
          {/* Departure and Arrival */}
          <div className="flex items-center gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-600">{flight.origin}</div>
              <div className="text-2xl font-semibold">{flight.departTime}</div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <div className="text-xs text-gray-600">{flight.duration}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">{flight.destination}</div>
              <div className="text-2xl font-semibold">{flight.arriveTime}</div>
            </div>
          </div>

          {/* Flight Number and Aircraft */}
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span className="text-sm text-gray-700">{flight.flightNumber} · {flight.aircraft}</span>
          </div>

          {/* Stops */}
          <div className="text-sm text-gray-600 mb-3">{flight.stops}</div>

          {/* Amenities */}
          <div className="flex gap-3">
            {flight.amenities?.includes('wifi') && (
              <span className="text-aa-light-blue" title="Wi-Fi available">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {flight.amenities?.includes('power') && (
              <span className="text-aa-light-blue" title="Power outlets">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </span>
            )}
            {flight.amenities?.includes('entertainment') && (
              <span className="text-aa-light-blue" title="Entertainment">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {flight.amenities?.includes('food') && (
              <span className="text-aa-light-blue" title="Food available">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </span>
            )}
          </div>

          {/* Details/Seats Links */}
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-aa-light-blue hover:underline text-sm font-medium"
            >
              Details
            </button>
            <button className="text-aa-light-blue hover:underline text-sm font-medium">
              Seats
            </button>
          </div>
        </div>

        {/* Pricing - Right Side */}
        <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
          {/* Main Cabin */}
          <div className="border rounded p-4 hover:border-aa-light-blue transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-gray-700">Main</div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-1">Round trip from</div>
              <div className="text-2xl font-semibold text-aa-light-blue">
                ${flight.mainPrice}
              </div>
            </div>
            <button
              onClick={() => handleSelectFlight('main')}
              className="w-full bg-aa-light-blue text-white py-2 rounded hover:bg-blue-600 transition text-sm font-medium"
            >
              Select
            </button>
          </div>

          {/* Premium Cabin */}
          <div className="border rounded p-4 bg-aa-blue text-white hover:bg-opacity-90 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold">Premium</div>
              <button className="text-white hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-200 mb-1">Round trip from</div>
              <div className="text-2xl font-semibold">
                ${flight.premiumPrice}
              </div>
            </div>
            <button
              onClick={() => handleSelectFlight('premium')}
              className="w-full bg-white text-aa-blue py-2 rounded hover:bg-gray-100 transition text-sm font-medium"
            >
              Select
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      {showDetails && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2">Flight details</div>
              <div className="text-gray-600">
                <div>Flight: {flight.flightNumber}</div>
                <div>Aircraft: {flight.aircraft}</div>
                <div>Duration: {flight.duration}</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Baggage</div>
              <div className="text-gray-600">
                <div>Personal item included</div>
                <div>Carry-on bag included</div>
                <div>Checked bags available for purchase</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
