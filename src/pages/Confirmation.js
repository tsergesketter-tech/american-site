import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { trackPurchase } from '../services/salesforceTracking';

const Confirmation = () => {
  const navigate = useNavigate();
  const { selectedFlights, selectedSeats, passengers, clearBooking } = useBooking();

  // Generate a random booking reference
  const bookingReference = `AA${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  useEffect(() => {
    // Track purchase event with Salesforce
    if (selectedFlights.outbound && passengers.length > 0) {
      const total = selectedFlights.outbound.price + (selectedSeats.outbound?.length > 0 ? 35 : 0);

      trackPurchase({
        bookingReference,
        total,
        lineItems: [{
          flightNumber: selectedFlights.outbound.flightNumber,
          price: selectedFlights.outbound.price,
          attributes: {
            origin: selectedFlights.outbound.origin,
            destination: selectedFlights.outbound.destination,
            cabin: selectedFlights.outbound.selectedCabin,
            seat: selectedSeats.outbound?.[0],
            passenger: `${passengers[0]?.firstName} ${passengers[0]?.lastName}`
          }
        }]
      });
    }
  }, []);

  const handleNewBooking = () => {
    clearBooking();
    navigate('/');
  };

  if (!selectedFlights.outbound || !passengers || passengers.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg p-8 shadow-md mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your flight has been successfully booked. A confirmation email has been sent to{' '}
              <span className="font-medium">{passengers[0]?.email}</span>
            </p>
          </div>

          {/* Booking Reference */}
          <div className="bg-aa-blue text-white rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-sm mb-2 opacity-90">Booking Reference</div>
              <div className="text-4xl font-bold tracking-wider">{bookingReference}</div>
              <div className="text-sm mt-2 opacity-90">
                Save this reference number for check-in and managing your trip
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Flight Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">{selectedFlights.outbound?.origin}</div>
                    <div className="text-2xl font-semibold">{selectedFlights.outbound?.departTime}</div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{selectedFlights.outbound?.destination}</div>
                    <div className="text-2xl font-semibold">{selectedFlights.outbound?.arriveTime}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight</span>
                    <span className="font-medium">{selectedFlights.outbound?.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aircraft</span>
                    <span className="font-medium">{selectedFlights.outbound?.aircraft}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{selectedFlights.outbound?.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cabin</span>
                    <span className="font-medium capitalize">{selectedFlights.outbound?.selectedCabin}</span>
                  </div>
                  {selectedSeats.outbound && selectedSeats.outbound.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seat</span>
                      <span className="font-medium">{selectedSeats.outbound[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Passenger Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-gray-600">Name</div>
                    <div className="font-medium">
                      {passengers[0]?.firstName} {passengers[0]?.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Email</div>
                    <div className="font-medium">{passengers[0]?.email}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Phone</div>
                    <div className="font-medium">{passengers[0]?.phone}</div>
                  </div>
                  {passengers[0]?.knownTravelerNumber && (
                    <div>
                      <div className="text-gray-600">Known Traveler Number</div>
                      <div className="font-medium">{passengers[0]?.knownTravelerNumber}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Check-in opens 24 hours before your flight</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Download the American Airlines app for mobile boarding passes</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Arrive at the airport at least 2 hours before departure for domestic flights</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Review baggage policies and fees before your trip</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleNewBooking}
              className="flex-1 bg-aa-light-blue text-white py-3 px-6 rounded hover:bg-blue-600 transition font-semibold"
            >
              Book Another Flight
            </button>
            <button className="flex-1 border-2 border-aa-blue text-aa-blue py-3 px-6 rounded hover:bg-aa-blue hover:text-white transition font-semibold">
              Manage My Trips
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded hover:bg-gray-50 transition font-semibold"
            >
              Print Confirmation
            </button>
          </div>
        </div>

        {/* Marketing Cloud Integration Note */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <div className="font-semibold text-green-900 mb-1">
                Marketing Cloud Integration Point
              </div>
              <div className="text-green-800">
                This confirmation triggers: (1) Purchase event in Salesforce, (2) Booking confirmation email via Journey Builder, (3) Post-flight survey scheduled, (4) Retargeting audience exclusion
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
