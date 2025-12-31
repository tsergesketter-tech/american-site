import React from 'react';

const DateSelector = ({ selectedDate, onDateChange, dates }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2">
        {/* Previous Arrow */}
        <button className="p-2 hover:bg-gray-100 rounded transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Date Options */}
        <div className="flex-1 grid grid-cols-7 gap-2">
          {dates.map((date) => (
            <button
              key={date.date}
              onClick={() => onDateChange(date.date)}
              className={`text-center py-3 px-2 rounded transition ${
                date.date === selectedDate
                  ? 'bg-aa-light-blue text-white border-b-4 border-blue-700'
                  : 'hover:bg-gray-100 border-b-4 border-transparent'
              }`}
            >
              <div className="text-xs font-medium mb-1">{date.day}</div>
              <div className="text-sm font-semibold text-aa-light-blue">
                ${date.price}
              </div>
            </button>
          ))}
        </div>

        {/* Next Arrow */}
        <button className="p-2 hover:bg-gray-100 rounded transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DateSelector;
