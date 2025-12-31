import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const SeatSelection = () => {
  const navigate = useNavigate();
  const { selectedFlights, setSelectedSeats, setBookingState } = useBooking();
  const [selectedSeatsLocal, setSelectedSeatsLocal] = useState([]);

  // Mock seat map for Boeing 737 (rows 1-30, seats A-F)
  const generateSeatMap = () => {
    const rows = 30;
    const seats = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatMap = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = seats.map(seat => {
        const seatNumber = `${row}${seat}`;
        let status = 'available';
        let price = 0;
        let type = 'standard';

        // First class (rows 1-4)
        if (row <= 4) {
          type = 'first';
          price = 150;
        }
        // Extra legroom (rows 10-12)
        else if (row >= 10 && row <= 12) {
          type = 'extra';
          price = 75;
        }
        // Preferred seats (exit rows, front of cabin)
        else if (row === 13 || row === 14 || row <= 9) {
          type = 'preferred';
          price = 35;
        }

        // Randomly occupy some seats
        if (Math.random() < 0.3) {
          status = 'occupied';
        }

        return { seatNumber, status, price, type };
      });

      seatMap.push({ row, seats: rowSeats });
    }

    return seatMap;
  };

  const [seatMap] = useState(generateSeatMap());

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied') return;

    const isSelected = selectedSeatsLocal.includes(seat.seatNumber);

    if (isSelected) {
      setSelectedSeatsLocal(selectedSeatsLocal.filter(s => s !== seat.seatNumber));
    } else {
      // For now, allow only one seat selection
      setSelectedSeatsLocal([seat.seatNumber]);
    }
  };

  const handleContinue = () => {
    setSelectedSeats({ outbound: selectedSeatsLocal, return: [] });
    setBookingState('checkout');
    navigate('/checkout');
  };

  const getSeatClassName = (seat) => {
    const isSelected = selectedSeatsLocal.includes(seat.seatNumber);
    const baseClass = 'w-10 h-10 rounded border-2 cursor-pointer transition-all text-xs font-semibold flex items-center justify-center';

    if (seat.status === 'occupied') {
      return `${baseClass} bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed`;
    }

    if (isSelected) {
      return `${baseClass} bg-aa-light-blue border-aa-blue text-white`;
    }

    if (seat.type === 'first') {
      return `${baseClass} bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100`;
    }

    if (seat.type === 'extra') {
      return `${baseClass} bg-green-50 border-green-300 text-green-700 hover:bg-green-100`;
    }

    if (seat.type === 'preferred') {
      return `${baseClass} bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100`;
    }

    return `${baseClass} bg-white border-gray-300 text-gray-700 hover:bg-gray-50`;
  };

  const getSelectedSeatPrice = () => {
    if (selectedSeatsLocal.length === 0) return 0;
    const selectedSeat = seatMap
      .flatMap(row => row.seats)
      .find(seat => seat.seatNumber === selectedSeatsLocal[0]);
    return selectedSeat?.price || 0;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/flights')}
            className="text-aa-light-blue hover:underline text-sm flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to flights
          </button>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Select your seat</h1>
          <p className="text-gray-600">
            Flight {selectedFlights.outbound?.flightNumber} - {selectedFlights.outbound?.origin} to {selectedFlights.outbound?.destination}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md">
            {/* Legend */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h3 className="font-semibold mb-3">Seat Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                  <span>Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-50 border-2 border-blue-300 rounded"></div>
                  <span>Preferred ($35)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-50 border-2 border-green-300 rounded"></div>
                  <span>Extra leg ($75)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-50 border-2 border-purple-300 rounded"></div>
                  <span>First ($150)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
                  <span>Occupied</span>
                </div>
              </div>
            </div>

            {/* Aircraft Diagram */}
            <div className="max-w-md mx-auto">
              {/* Cockpit */}
              <div className="mb-4 text-center">
                <div className="bg-gray-200 rounded-t-full py-3 text-sm text-gray-600">
                  ✈ Front of Aircraft
                </div>
              </div>

              {/* Column Headers */}
              <div className="flex justify-center mb-2 text-xs text-gray-600 font-semibold">
                <div className="w-10 text-center">A</div>
                <div className="w-10 text-center">B</div>
                <div className="w-10 text-center">C</div>
                <div className="w-8"></div>
                <div className="w-10 text-center">D</div>
                <div className="w-10 text-center">E</div>
                <div className="w-10 text-center">F</div>
              </div>

              {/* Seat Rows */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {seatMap.map((rowData) => (
                  <div key={rowData.row} className="flex items-center justify-center gap-1">
                    <div className="w-8 text-xs text-gray-500 text-right pr-2">{rowData.row}</div>
                    {rowData.seats.slice(0, 3).map((seat) => (
                      <button
                        key={seat.seatNumber}
                        onClick={() => handleSeatClick(seat)}
                        className={getSeatClassName(seat)}
                        disabled={seat.status === 'occupied'}
                        title={`${seat.seatNumber} - ${seat.type} ${seat.price > 0 ? `+$${seat.price}` : 'included'}`}
                      >
                        {seat.seatNumber.slice(-1)}
                      </button>
                    ))}
                    <div className="w-8"></div>
                    {rowData.seats.slice(3, 6).map((seat) => (
                      <button
                        key={seat.seatNumber}
                        onClick={() => handleSeatClick(seat)}
                        className={getSeatClassName(seat)}
                        disabled={seat.status === 'occupied'}
                        title={`${seat.seatNumber} - ${seat.type} ${seat.price > 0 ? `+$${seat.price}` : 'included'}`}
                      >
                        {seat.seatNumber.slice(-1)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Trip Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Flight</div>
                  <div className="font-medium">
                    {selectedFlights.outbound?.origin} → {selectedFlights.outbound?.destination}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedFlights.outbound?.flightNumber}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Cabin</div>
                  <div className="font-medium capitalize">{selectedFlights.outbound?.selectedCabin}</div>
                </div>

                {selectedSeatsLocal.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600">Selected Seat</div>
                    <div className="font-medium">{selectedSeatsLocal[0]}</div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base fare</span>
                  <span className="font-medium">${selectedFlights.outbound?.price}</span>
                </div>
                {getSelectedSeatPrice() > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Seat selection</span>
                    <span className="font-medium">+${getSelectedSeatPrice()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-aa-blue">
                    ${(selectedFlights.outbound?.price || 0) + getSelectedSeatPrice()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className={`w-full py-3 rounded font-semibold transition ${
                  selectedSeatsLocal.length > 0
                    ? 'bg-aa-light-blue text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedSeatsLocal.length === 0}
              >
                Continue to checkout
              </button>

              <button
                onClick={() => {
                  setSelectedSeatsLocal([]);
                  navigate('/checkout');
                }}
                className="w-full mt-3 py-3 rounded font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Skip seat selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
