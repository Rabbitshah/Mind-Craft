import React, { useState } from "react";

export default function Landing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const carouselImages = [
    {
      id: 1,
      alt: "Design workspace with wireframes and sketches",
      description: "Design workspace showing wireframes and UI sketches"
    },
    {
      id: 2,
      alt: "Creative process visualization",
      description: "Creative process and design thinking"
    },
    {
      id: 3,
      alt: "Digital design tools interface",
      description: "Modern digital design interface"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#1D1DD0' }}>
      {/* Header/Navigation Bar */}
      <header className="text-white shadow-xl mb-4" style={{ backgroundColor: '#1D1DD0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">MindCraft</h1>
              
              {/* Explore Dropdown Button */}
              <button className="ml-6 flex items-center px-4 py-2 border border-white rounded-md text-white hover:bg-blue-700 transition-colors">
                Explore
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your craft..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-white hover:text-blue-200 transition-colors">Courses</a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">Teaching</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Login
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Signin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1D1DD0' }}>
        <div className="max-w-6xl mx-auto text-center">
          {/* Image Carousel */}
          <div className="relative mb-8">
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <div className="flex transition-transform duration-500 ease-in-out">
                  {carouselImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`w-full flex-shrink-0 ${
                        index === currentImageIndex ? 'block' : 'hidden'
                      }`}
                    >
                      {/* Placeholder for the actual image - simulating the design workspace */}
                      <div className="w-full h-96 bg-gradient-to-r from-gray-300 to-gray-400 relative">
                        {/* Simulating the split view from the image description */}
                        <div className="absolute inset-0 flex">
                          {/* Left side - blurred background */}
                          <div className="w-1/2 bg-gray-500 opacity-60 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-600 rounded-lg transform rotate-12"></div>
                          </div>
                          
                          {/* Right side - wireframes and sketches */}
                          <div className="w-1/2 bg-white p-6 flex flex-col space-y-4">
                            {/* Wireframe rectangles */}
                            <div className="flex space-x-2">
                              <div className="w-8 h-6 bg-gray-300 rounded border-2 border-gray-400 flex items-center justify-center text-xs">X</div>
                              <div className="w-12 h-6 bg-gray-300 rounded border-2 border-gray-400 flex items-center justify-center text-xs">X</div>
                              <div className="w-6 h-6 bg-gray-300 rounded border-2 border-gray-400 flex items-center justify-center text-xs">X</div>
                            </div>
                            
                            {/* Text lines */}
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                              <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                              <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                            </div>
                            
                            {/* More wireframe elements */}
                            <div className="flex space-x-3">
                              <div className="w-10 h-8 bg-gray-300 rounded border-2 border-gray-400 flex items-center justify-center text-xs">X</div>
                              <div className="w-8 h-8 bg-gray-300 rounded border-2 border-gray-400 flex items-center justify-center text-xs">X</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Toolbar on the right edge */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gray-200 flex flex-col items-center justify-center space-y-2">
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to shape your Craft?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover the power of creative design and bring your ideas to life with MindCraft
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
