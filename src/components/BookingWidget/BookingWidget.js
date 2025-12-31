import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { trackFlightSearch } from '../../services/salesforceTracking';

const BookingWidget = () => {
  const navigate = useNavigate();
  const { updateSearchParams } = useBooking();

  const [activeTab, setActiveTab] = useState('book');
  const [tripType, setTripType] = useState('roundTrip');
  const [bookingType, setBookingType] = useState('flight');
  const [redeemMiles, setRedeemMiles] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [from, setFrom] = useState('IND');
  const [to, setTo] = useState('DFW');
  const [departDate, setDepartDate] = useState('2026-01-13');

  const handleSearch = () => {
    const searchParams = {
      from,
      to,
      departDate,
      passengers,
      tripType
    };

    // Track flight search with Salesforce
    trackFlightSearch(searchParams);

    updateSearchParams(searchParams);
    navigate('/flights');
  };

  return (
    <div className="bg-white shadow-lg -mt-20 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('book')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === 'book'
                ? 'bg-white text-aa-blue border-b-4 border-aa-blue'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Book
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === 'manage'
                ? 'bg-white text-aa-blue border-b-4 border-aa-blue'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manage trips / Check-in
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === 'status'
                ? 'bg-white text-aa-blue border-b-4 border-aa-blue'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Flight status
          </button>
        </div>

        {/* Book Tab Content */}
        {activeTab === 'book' && (
          <div className="p-6">
            {/* Booking Type Navigation */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setBookingType('flight')}
                className={`pb-3 px-2 font-medium transition ${
                  bookingType === 'flight'
                    ? 'text-aa-light-blue border-b-2 border-aa-light-blue'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Flight
              </button>
              <button
                onClick={() => setBookingType('vacation')}
                className={`pb-3 px-2 font-medium transition ${
                  bookingType === 'vacation'
                    ? 'text-aa-light-blue border-b-2 border-aa-light-blue'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Vacation packages
              </button>
              <button
                onClick={() => setBookingType('hotel')}
                className={`pb-3 px-2 font-medium transition ${
                  bookingType === 'hotel'
                    ? 'text-aa-light-blue border-b-2 border-aa-light-blue'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hotel
                <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <button
                onClick={() => setBookingType('car')}
                className={`pb-3 px-2 font-medium transition ${
                  bookingType === 'car'
                    ? 'text-aa-light-blue border-b-2 border-aa-light-blue'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Car
                <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <button
                onClick={() => setBookingType('experiences')}
                className={`pb-3 px-2 font-medium transition ${
                  bookingType === 'experiences'
                    ? 'text-aa-light-blue border-b-2 border-aa-light-blue'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Experiences
                <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Flight Booking Form */}
            {bookingType === 'flight' && (
              <div>
                {/* Trip Type and Options */}
                <div className="flex items-center gap-8 mb-6">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value="roundTrip"
                        checked={tripType === 'roundTrip'}
                        onChange={(e) => setTripType(e.target.value)}
                        className="w-4 h-4 text-aa-light-blue"
                      />
                      <span className="text-gray-700">Round trip</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value="oneWay"
                        checked={tripType === 'oneWay'}
                        onChange={(e) => setTripType(e.target.value)}
                        className="w-4 h-4 text-aa-light-blue"
                      />
                      <span className="text-gray-700">One way</span>
                    </label>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={redeemMiles}
                      onChange={(e) => setRedeemMiles(e.target.checked)}
                      className="w-4 h-4 text-aa-light-blue rounded"
                    />
                    <span className="text-gray-700">Redeem miles</span>
                  </label>
                </div>

                {/* Search Fields */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                  {/* From */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="IND"
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* To */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="City or airport"
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Number of Passengers */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of passengers
                    </label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  {/* Depart Date */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depart
                    </label>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-aa-light-blue"
                    />
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-2 flex items-end">
                    <button
                      onClick={handleSearch}
                      className="w-full bg-aa-light-blue text-white px-6 py-3 rounded hover:bg-blue-600 transition font-semibold"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Discover Destinations Link */}
                <div className="flex items-center gap-2 text-aa-light-blue hover:underline cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Discover destinations</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            )}

            {/* Placeholder for other booking types */}
            {bookingType !== 'flight' && (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">
                  {bookingType === 'vacation' && 'Vacation packages booking form'}
                  {bookingType === 'hotel' && 'Hotel booking form'}
                  {bookingType === 'car' && 'Car rental booking form'}
                  {bookingType === 'experiences' && 'Experiences booking form'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Manage Trips Tab Content */}
        {activeTab === 'manage' && (
          <div className="p-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Manage trips / Check-in</h3>
            <p className="text-gray-500">View and manage your upcoming trips or check in for your flight.</p>
          </div>
        )}

        {/* Flight Status Tab Content */}
        {activeTab === 'status' && (
          <div className="p-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Flight status</h3>
            <p className="text-gray-500">Check the status of your flight.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWidget;
