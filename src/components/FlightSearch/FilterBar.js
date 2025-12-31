import React from 'react';

const FilterBar = ({ filters, onFilterChange, resultCount }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Filters */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Filter by:</span>

          {/* Stops Filter */}
          <div className="relative">
            <select
              value={filters.stops}
              onChange={(e) => onFilterChange('stops', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-aa-light-blue cursor-pointer"
            >
              <option value="all">Stops</option>
              <option value="nonstop">Nonstop only</option>
              <option value="1stop">1 stop or fewer</option>
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Airline Filter */}
          <button className="border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50 transition">
            American Airlines
          </button>
        </div>

        {/* Right: Result Count */}
        <div className="text-sm font-medium text-gray-700">
          {resultCount} results
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-4 mt-4 border-t border-gray-200 pt-4">
        <button
          onClick={() => onFilterChange('sortBy', 'depart')}
          className={`flex items-center gap-1 text-sm font-medium ${
            filters.sortBy === 'depart' ? 'text-aa-light-blue' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Depart
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
        <button
          onClick={() => onFilterChange('sortBy', 'arrive')}
          className={`flex items-center gap-1 text-sm font-medium ${
            filters.sortBy === 'arrive' ? 'text-aa-light-blue' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Arrive
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
        <button
          onClick={() => onFilterChange('sortBy', 'duration')}
          className={`flex items-center gap-1 text-sm font-medium ${
            filters.sortBy === 'duration' ? 'text-aa-light-blue' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Duration
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
