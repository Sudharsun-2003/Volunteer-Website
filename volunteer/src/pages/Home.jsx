import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/animations.css'

const Home = () => {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const partners = [
    {
      url: "https://logos-world.net/wp-content/uploads/2022/01/Red-Cross-Emblem.png",
      name: "Red Cross"
    },
    {
      url: "https://logos-world.net/wp-content/uploads/2020/11/UNICEF-Logo.png",
      name: "UNICEF"
    },
    {
      url: "https://1.bp.blogspot.com/-HJufaQhi4OQ/VSS21HpTchI/AAAAAAAAB3w/CUdlbGtzBik/s1600/Rotary-International-logo-vector.png",
      name: "Rotary International"
    },
    {
      url: "https://thecolorfuldreams.com/wp-content/uploads/2023/03/World-Health-Organization-1.jpg",
      name: "WHO"
    },
    {
      url: "https://e7.pngegg.com/pngimages/903/572/png-clipart-old-colony-habitat-for-humanity-volunteering-donation-habitat-for-humanity-moncton-area-charity-logo-text-hand.png",
      name: "Habitat for Humanity"
    },
    {
      url: "https://logosmarken.com/wp-content/uploads/2020/11/World-Wide-Fund-for-Nature-Emblem.png",
      name: "WWF"
    }
  ];

  const aboutImages = [
    {
      url: 'https://cdn2.iconfinder.com/data/icons/management-business/256/Partnership-512.png',
      title: 'Community Service'
    },
    {
      url: 'https://img.franchising.com/art/articles/5145_plate.jpg',
      title: 'Environmental Care'
    },
    {
      url: 'https://triscott.com.au/wp-content/uploads/cert-4-education-support-header-1024x599.jpg',
      title: 'Education Support'
    },
  
    {
      url: 'https://www.saihmc.com/sites/default/files/blood_camp_6.jpg',
      title: 'Healthcare Assistance'
    },
   
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Make a Difference</span>
              <span className="block text-indigo-200">Through Volunteering</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join our community of volunteers and create positive change in the world. 
              Find meaningful opportunities that match your passion and skills.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                to="/opportunities"
                className="rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-indigo-50 transition duration-300"
              >
                Get Started
              </Link>
              <button
                onClick={scrollToFeatures}
                className="rounded-md px-8 py-3 text-base font-medium text-white border border-transparent hover:border-white transition duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative blob */}
        <div className="absolute inset-y-0 right-0 w-1/2 opacity-50">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
            <path d="M0 0L100 0L100 100L0 100Z" fill="url(#gradient)" />
          </svg>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 0.4 }} />
              <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Volunteer Connect?</h2>
          <p className="mt-4 text-lg text-gray-600">Empowering individuals to make a lasting impact</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Opportunities</h3>
              <p className="text-gray-600 mb-4">Discover meaningful volunteer opportunities that align with your interests and schedule.</p>
              <Link
                to="/opportunities"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
              >
                Browse Opportunities
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Feature Card 2 - Updated Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Matching</h3>
              <p className="text-gray-600 mb-4">Get matched with opportunities that perfectly align with your skills and interests instantly.</p>
              <Link
                to="/opportunities"
                className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
              >
                Find Your Match
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Schedule</h3>
              <p className="text-gray-600 mb-4">Choose opportunities that fit your schedule and commitment level.</p>
              <Link
                to="/opportunities"
                className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
              >
                Find Matches
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section - Updated with new image layout */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">About Volunteer Connect</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make volunteering accessible to everyone. Our platform connects passionate individuals 
              with meaningful opportunities to create positive change in their communities.
            </p>
          </div>

          {/* New Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {aboutImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">Over 1000+ volunteer opportunities available</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">Trusted by 500+ organizations</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">Active in 50+ cities nationwide</p>
            </div>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
          >
            Learn more about us
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Partner Logos Section - Enhanced Animation */}
      <div className="bg-white py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Trusted by Leading Organizations
          </h2>
          <div className="relative">
            {/* First row of logos */}
            <div className="overflow-hidden">
              <div className="flex space-x-20 animate-scroll">
                {[...partners, ...partners].map((partner, index) => (
                  <div 
                    key={`row1-${index}`} 
                    className="flex-shrink-0 group relative w-48 h-32 flex items-center justify-center"
                  >
                    <img
                      src={partner.url}
                      alt={partner.name}
                      className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-110 group-hover:-translate-y-1"
                    />
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second row of logos (reverse direction) */}
            <div className="overflow-hidden mt-12">
              <div className="flex space-x-20 animate-scroll-reverse">
                {[...partners.reverse(), ...partners].map((partner, index) => (
                  <div 
                    key={`row2-${index}`} 
                    className="flex-shrink-0 group relative w-48 h-32 flex items-center justify-center"
                  >
                    <img
                      src={partner.url}
                      alt={partner.name}
                      className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-110 group-hover:-translate-y-1"
                    />
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          </div>
        </div>
      </div>

      {/* Impact Stats Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">10,000+</div>
              <div className="text-blue-100">Volunteers Registered</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">50,000+</div>
              <div className="text-blue-100">Hours Contributed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">1,000+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="bg-blue-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:py-16">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to make an impact?
                </h2>
                <p className="mt-4 text-lg text-blue-100">
                  Join thousands of volunteers who are already making a difference in their communities.
                </p>
                <div className="mt-8">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition duration-300"
                  >
                    Get Started Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 