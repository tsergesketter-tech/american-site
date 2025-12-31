import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      badge: 'LIMITED-TIME OFFER',
      title: 'Earn up to 90,000 bonus miles',
      subtitle: 'The new Citi® / AAdvantage® Globe™ card has landed',
      bgColor: 'from-teal-700 to-teal-600',
      image: 'credit-cards'
    },
    {
      id: 2,
      badge: 'TRAVEL DEALS',
      title: 'Explore the world with American',
      subtitle: 'Book your next adventure today',
      bgColor: 'from-blue-700 to-blue-600',
      image: 'destinations'
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.bgColor} relative`}>
            {/* Background image overlay */}
            <div className="absolute inset-0 opacity-40">
              <div className="h-full w-full bg-cover bg-center"
                   style={{
                     backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=500&fit=crop')`
                   }}
              />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-block bg-aa-red text-white px-4 py-1 rounded text-sm font-semibold mb-4">
                  {slide.badge}
                </div>

                {/* Title */}
                <h1 className="text-white text-5xl md:text-6xl font-light mb-4 leading-tight">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-white text-xl mb-6 flex items-center gap-2">
                  {slide.subtitle}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </p>

                {/* Terms */}
                <p className="text-white text-sm opacity-80">Terms apply</p>
              </div>

              {/* Decorative credit cards (for first slide) */}
              {index === 0 && (
                <div className="hidden lg:block absolute right-20 top-1/2 transform -translate-y-1/2">
                  <div className="relative w-64 h-64">
                    {/* Simulated credit cards stack */}
                    <div className="absolute top-0 right-0 w-48 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-2xl transform rotate-6"></div>
                    <div className="absolute top-8 right-4 w-48 h-28 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg shadow-2xl transform rotate-12"></div>
                    <div className="absolute top-16 right-8 w-48 h-28 bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-2xl transform rotate-3"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pause Button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute bottom-6 left-6 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded transition"
        aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
      >
        {isPaused ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
