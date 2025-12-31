import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { trackAbandonedCart, identifyUser } from '../services/salesforceTracking';

const Checkout = () => {
  const navigate = useNavigate();
  const { selectedFlights, selectedSeats, setPassengers, setBookingState } = useBooking();

  // Track page entry time for abandoned cart detection
  const [pageEntryTime] = useState(Date.now());
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Form state
  const [passengerData, setPassengerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    knownTravelerNumber: ''
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Track time on page for abandoned cart detection
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - pageEntryTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [pageEntryTime]);

  // Abandoned cart detection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // If user has started filling form but hasn't completed booking
      if (passengerData.email && timeOnPage > 30) {
        // Track abandoned cart with Salesforce
        trackAbandonedCart({
          email: passengerData.email,
          flightNumber: selectedFlights.outbound?.flightNumber,
          total: calculateTotal().total,
          timeOnPage
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [passengerData.email, timeOnPage, selectedFlights]);

  // Identify user when email is entered
  useEffect(() => {
    if (passengerData.email && passengerData.firstName && passengerData.lastName) {
      identifyUser({
        email: passengerData.email,
        firstName: passengerData.firstName,
        lastName: passengerData.lastName,
        phone: passengerData.phone
      });
    }
  }, [passengerData.email, passengerData.firstName, passengerData.lastName, passengerData.phone]);

  const handlePassengerChange = (field, value) => {
    setPassengerData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    let total = selectedFlights.outbound?.price || 0;

    // Add seat price if selected
    if (selectedSeats.outbound && selectedSeats.outbound.length > 0) {
      // For demo, add $35 for seat selection
      total += 35;
    }

    // Add taxes and fees
    const taxes = Math.round(total * 0.12);
    return { subtotal: total, taxes, total: total + taxes };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!passengerData.firstName || !passengerData.lastName || !passengerData.email) {
      alert('Please fill in all required passenger information');
      return;
    }

    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    // Save to context
    setPassengers([passengerData]);
    setBookingState('confirmed');

    // Navigate to confirmation
    navigate('/confirmation');
  };

  const { subtotal, taxes, total } = calculateTotal();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/flights/seats')}
            className="text-aa-light-blue hover:underline text-sm flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to seat selection
          </button>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger Information */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={passengerData.firstName}
                    onChange={(e) => handlePassengerChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={passengerData.lastName}
                    onChange={(e) => handlePassengerChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={passengerData.email}
                    onChange={(e) => handlePassengerChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={passengerData.phone}
                    onChange={(e) => handlePassengerChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={passengerData.dateOfBirth}
                    onChange={(e) => handlePassengerChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Known Traveler Number
                  </label>
                  <input
                    type="text"
                    value={passengerData.knownTravelerNumber}
                    onChange={(e) => handlePassengerChange('knownTravelerNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                  />
                </div>
              </form>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-aa-light-blue rounded focus:ring-2 focus:ring-aa-light-blue"
                />
                <span className="text-sm text-gray-700">
                  I accept the{' '}
                  <a href="#" className="text-aa-light-blue hover:underline">
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-aa-light-blue hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Flight</div>
                  <div className="font-medium">
                    {selectedFlights.outbound?.origin} → {selectedFlights.outbound?.destination}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedFlights.outbound?.flightNumber} · {selectedFlights.outbound?.departTime}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Cabin</div>
                  <div className="font-medium capitalize">{selectedFlights.outbound?.selectedCabin}</div>
                </div>

                {selectedSeats.outbound && selectedSeats.outbound.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600">Seat</div>
                    <div className="font-medium">{selectedSeats.outbound[0]}</div>
                  </div>
                )}

                {passengerData.firstName && (
                  <div>
                    <div className="text-sm text-gray-600">Passenger</div>
                    <div className="font-medium">
                      {passengerData.firstName} {passengerData.lastName}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span className="font-medium">${taxes}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-aa-blue">${total}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-aa-light-blue text-white py-3 rounded hover:bg-blue-600 transition font-semibold"
              >
                Complete Booking
              </button>

              {/* Abandoned Cart Indicator (for demo) */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <div className="font-semibold text-yellow-800 mb-1">
                  🔔 Demo: Abandoned Cart Tracking
                </div>
                <div className="text-yellow-700">
                  Time on page: {timeOnPage}s
                  <br />
                  {timeOnPage > 30 && passengerData.email && (
                    <span className="text-yellow-900 font-medium">
                      ✓ Will trigger abandoned cart email if you leave
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
