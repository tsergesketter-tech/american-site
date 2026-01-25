import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { trackPurchase } from '../services/salesforceTracking';
import { trackBooking } from '../services/eventApi';

const Confirmation = () => {
  const navigate = useNavigate();
  const { selectedFlights, selectedSeats, passengers, clearBooking } = useBooking();
  const [eventStatus, setEventStatus] = useState({ sent: false, result: null });

  // Generate a random booking reference (memoized to prevent re-generation)
  const [bookingReference] = useState(() => `AA${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  useEffect(() => {
    // Guard: only send once per booking reference
    const sentKey = `booking_sent_${bookingReference}`;
    if (sessionStorage.getItem(sentKey)) {
      console.log('[Confirmation] Event already sent for this booking, skipping');
      return;
    }

    // Track purchase event with Salesforce Marketing Cloud
    if (selectedFlights.outbound && passengers.length > 0) {
      // Mark as sent immediately to prevent duplicates
      sessionStorage.setItem(sentKey, 'true');

      const total = selectedFlights.outbound.price + (selectedSeats.outbound?.length > 0 ? 35 : 0);

      // Track with Marketing Cloud
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

      // Send booking event to Salesforce Platform Events
      const sendBookingEvent = async () => {
        try {
          const result = await trackBooking({
            bookingReference,
            firstName: passengers[0]?.firstName,
            lastName: passengers[0]?.lastName,
            email: passengers[0]?.email,
            flightNumber: selectedFlights.outbound.flightNumber,
            origin: selectedFlights.outbound.origin,
            destination: selectedFlights.outbound.destination,
            departureDate: selectedFlights.outbound.departureDate || new Date().toISOString().split('T')[0],
            cabinClass: selectedFlights.outbound.selectedCabin,
            totalAmount: total,
            seatNumbers: selectedSeats.outbound?.join(', ') || '',
          });
          setEventStatus({ sent: true, result });
          console.log('[Confirmation] Booking event sent to Salesforce:', result);
        } catch (error) {
          console.error('[Confirmation] Failed to send booking event:', error);
          setEventStatus({ sent: true, result: { error: error.message } });
        }
      };

      sendBookingEvent();
    }
  }, [bookingReference, selectedFlights, selectedSeats, passengers]);

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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
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

        {/* Salesforce Platform Event Status */}
        <div className={`border rounded-lg p-4 ${eventStatus.sent ? (eventStatus.result?.success ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200') : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-start gap-3">
            {eventStatus.sent ? (
              eventStatus.result?.success ? (
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )
            ) : (
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <div className="text-sm flex-1">
              <div className={`font-semibold mb-1 ${eventStatus.sent ? (eventStatus.result?.success ? 'text-blue-900' : 'text-yellow-900') : 'text-gray-700'}`}>
                Salesforce Platform Event
              </div>
              <div className={eventStatus.sent ? (eventStatus.result?.success ? 'text-blue-800' : 'text-yellow-800') : 'text-gray-600'}>
                {!eventStatus.sent && 'Sending booking event to Salesforce...'}
                {eventStatus.sent && eventStatus.result?.success && (
                  <>Flight_Booking__e published successfully via Pub/Sub API</>
                )}
                {eventStatus.sent && eventStatus.result?.error && (
                  <>Event send failed: {eventStatus.result.error}</>
                )}
                {eventStatus.sent && eventStatus.result?.reason && (
                  <>Event skipped: {eventStatus.result.reason}</>
                )}
              </div>
              {eventStatus.result?.bookingReference && (
                <div className="mt-1 text-xs text-blue-600">
                  Booking Ref: {eventStatus.result.bookingReference}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
