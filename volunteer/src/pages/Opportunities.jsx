import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaUsers, FaSearch, FaClock, FaHeart, FaPlus, FaFilter, FaMapPin, FaLocationArrow } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostOpportunityModal from '../page_components/OpportunitiesPage/PostOpportunityModal';
import ApplicationModal from '../page_components/OpportunitiesPage/ApplOpportunities';

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

const OpportunityCard = ({ opportunity, onApply, isLoggedIn, userLocation }) => {
  const navigate = useNavigate();
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Calculate distance if both user location and opportunity location are available
    if (userLocation && opportunity.coordinates) {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        opportunity.coordinates.latitude,
        opportunity.coordinates.longitude
      );
      setDistance(dist.toFixed(1));
    }
  }, [userLocation, opportunity]);

  const handleApplyClick = () => {
    if (isLoggedIn) {
      onApply(opportunity);
    } else {
      // Redirect to login page if not logged in
      navigate('/login');
    }
  };

  // Toggle address details visibility
  const toggleAddressDetails = () => {
    setShowAddressDetails(!showAddressDetails);
  };
  
  // Get status color and text
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Filled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Determine if the Apply button should be disabled
  const isApplyDisabled = opportunity.status !== 'Open';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={opportunity.imageUrl || 'https://via.placeholder.com/400x200?text=Volunteer+Opportunity'} 
          alt={opportunity.title}
          className="w-full h-full object-cover"
        />
        {/* Status badge at top right corner */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(opportunity.status)}`}>
          {opportunity.status}
        </div>
        
        {/* Distance badge if available */}
        {distance && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium flex items-center">
            <FaLocationArrow className="mr-1 text-blue-500" />
            {distance} km away
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {opportunity.category}
          </span>
          <span className="ml-auto flex items-center text-gray-500 text-sm">
            <FaUsers className="mr-1" />
            {opportunity.appliedVolunteers ?? 0}/{opportunity.volunteers} volunteers
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{opportunity.title}</h3>
        <p className="flex items-center text-gray-600 mb-2">
          <FaBuilding className="mr-2 text-blue-500" />
          {opportunity.organization}
        </p>
        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-2 text-green-500" />
          <span>{opportunity.location}</span>
          <button 
            onClick={toggleAddressDetails}
            className="ml-2 text-xs text-blue-500 hover:underline"
          >
            {showAddressDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>
        
        {/* Address details section that shows/hides based on state */}
        {showAddressDetails && opportunity.address && (
          <div className="ml-6 mb-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <p><FaMapPin className="inline mr-1 text-gray-500" /> {opportunity.address.street}</p>
            <p className="mt-1">{opportunity.address.city}, {opportunity.address.district}, {opportunity.address.pincode}</p>
            {opportunity.address.state && <p className="mt-1">{opportunity.address.state}</p>}
          </div>
        )}
        
        <p className="flex items-center text-gray-600 mb-2">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          {new Date(opportunity.date).toLocaleDateString()}
        </p>
        <p className="flex items-center text-gray-600 mb-4">
          <FaClock className="mr-2 text-orange-500" />
          {opportunity.start_time} - {opportunity.end_time} ({opportunity.duration} hrs)
        </p>
        <p className="text-gray-700 mb-4 line-clamp-3">{opportunity.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.skills.split(',').map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {skill.trim()}
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleApplyClick}
            disabled={isApplyDisabled}
            className={`flex-1 px-4 py-2 font-medium rounded-lg flex items-center justify-center transition-colors duration-200
              ${isApplyDisabled 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            <FaPlus className="mr-2" /> 
            {isApplyDisabled 
              ? (opportunity.status === 'Filled' ? 'Position Filled' : opportunity.status) 
              : 'Apply Now'}
          </button>
          <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <FaHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

const OpportunitiesPage = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [radiusFilter, setRadiusFilter] = useState(0); // 0 means no filter
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [searchTerm, categoryFilter, districtFilter, statusFilter, radiusFilter, userLocation, opportunities]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/opportunities/');
      
      // Add mock coordinates for testing (you should get real coordinates from your backend)
      const opportunitiesWithCoordinates = response.data.map(opp => {
        // You would get these coordinates from your database in production
        // This is just a mock example
        if (!opp.coordinates) {
          opp.coordinates = {
            latitude: 11.1271 + (Math.random() * 0.4 - 0.2), // Chennai area +/- 0.2 degrees
            longitude: 78.6569 + (Math.random() * 0.4 - 0.2)  // Tamil Nadu center +/- 0.2 degrees
          };
        }
        return opp;
      });
      
      setOpportunities(opportunitiesWithCoordinates);
      setFilteredOpportunities(opportunitiesWithCoordinates);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setError('Failed to load opportunities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = [...opportunities];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Filter by district
    if (districtFilter !== 'All') {
      filtered = filtered.filter(item => 
        item.address && 
        item.address.district && 
        item.address.district === districtFilter
      );
    }
    
    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Filter by radius if user location is available and radius filter is active
    if (userLocation && radiusFilter > 0) {
      filtered = filtered.filter(item => {
        if (item.coordinates) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            item.coordinates.latitude,
            item.coordinates.longitude
          );
          return distance <= radiusFilter;
        }
        return false; // Filter out items without coordinates
      });
      
      // Sort by distance
      filtered.sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.coordinates.latitude,
          a.coordinates.longitude
        );
        
        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.coordinates.latitude,
          b.coordinates.longitude
        );
        
        return distanceA - distanceB;
      });
    }
    
    setFilteredOpportunities(filtered);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setLocationLoading(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setRadiusFilter(20); // Set to 20km by default when location is obtained
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to get your location. Please check your location permissions.');
        setLocationLoading(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleApply = (opportunity) => {
    if (isLoggedIn) {
      setSelectedOpportunity(opportunity);
      setShowApplicationModal(true);
    } else {
      // Redirect to login page
      navigate('/login');
    }
  };

  const handlePostOpportunity = () => {
    if (isLoggedIn) {
      setShowPostModal(true);
    } else {
      // Redirect to login page
      navigate('/login');
    }
  };

  const handleOpportunityAdded = (newOpportunity) => {
    setOpportunities([...opportunities, newOpportunity]);
    fetchOpportunities(); // Refresh the list
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setDistrictFilter('All');
    setStatusFilter('All');
    setRadiusFilter(0);
  };

  const disableLocationFilter = () => {
    setRadiusFilter(0);
  };

  const categories = ['All', 'Environment', 'Community', 'Education', 'Healthcare', 'Social Work'];
  const statusOptions = ['All', 'Open', 'Filled', 'Completed', 'Canceled'];
  const radiusOptions = [5, 10, 15, 20, 30, 50];
  
  // List of all Tamil Nadu districts
  const tamilNaduDistricts = [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", 
    "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", 
    "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", 
    "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", 
    "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", 
    "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", 
    "Viluppuram", "Virudhunagar"
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Volunteer Opportunities</h1>
          <button
            onClick={handlePostOpportunity}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Post New Opportunity
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={getUserLocation}
                  disabled={locationLoading}
                  className={`py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-200 ${userLocation ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <FaLocationArrow className="mr-2" />
                  {locationLoading ? 'Getting location...' : (userLocation ? 'Location Active' : 'Use My Location')}
                </button>
                <button
                  onClick={toggleFilters}
                  className="py-3 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                >
                  <FaFilter className="mr-2" />
                  Filters {showFilters ? '▲' : '▼'}
                </button>
              </div>
            </div>
            
            {locationError && (
              <div className="mt-2 text-red-600 text-sm">
                {locationError}
              </div>
            )}
            
            {showFilters && (
              <div className="p-4 border border-gray-200 rounded-lg mt-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <select
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                    >
                      <option value="All">All Districts</option>
                      {tamilNaduDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance (km)
                    </label>
                    <select
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={radiusFilter}
                      onChange={(e) => setRadiusFilter(Number(e.target.value))}
                      disabled={!userLocation}
                    >
                      <option value="0">No limit</option>
                      {radiusOptions.map(radius => (
                        <option key={radius} value={radius}>Within {radius} km</option>
                      ))}
                    </select>
                    {!userLocation && (
                      <div className="mt-1 text-xs text-gray-500">
                        Click "Use My Location" to enable
                      </div>
                    )}
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleClearFilters}
                      className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Filter summary */}
        {(categoryFilter !== 'All' || districtFilter !== 'All' || statusFilter !== 'All' || radiusFilter > 0 || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
            <span className="text-gray-700">Active Filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                Search: "{searchTerm}"
                <button 
                  className="ml-2 text-blue-600"
                  onClick={() => setSearchTerm('')}
                >
                  &times;
                </button>
              </span>
            )}
            {categoryFilter !== 'All' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                Category: {categoryFilter}
                <button 
                  className="ml-2 text-blue-600"
                  onClick={() => setCategoryFilter('All')}
                >
                  &times;
                </button>
              </span>
            )}
            {districtFilter !== 'All' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                District: {districtFilter}
                <button 
                  className="ml-2 text-blue-600"
                  onClick={() => setDistrictFilter('All')}
                >
                  &times;
                </button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                Status: {statusFilter}
                <button 
                  className="ml-2 text-blue-600"
                  onClick={() => setStatusFilter('All')}
                >
                  &times;
                </button>
              </span>
            )}
            {radiusFilter > 0 && userLocation && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                Within {radiusFilter} km
                <button 
                  className="ml-2 text-green-600"
                  onClick={disableLocationFilter}
                >
                  &times;
                </button>
              </span>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-8 rounded-lg text-center">
            <p className="text-xl font-medium mb-2">No opportunities found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map(opportunity => (
              <OpportunityCard
                key={opportunity._id}
                opportunity={opportunity}
                onApply={handleApply}
                isLoggedIn={isLoggedIn}
                userLocation={userLocation}
              />
            ))}
          </div>
        )}
      </div>
      
      {isLoggedIn && (
        <>
          <PostOpportunityModal
            isOpen={showPostModal}
            onClose={() => setShowPostModal(false)}
            onSubmit={handleOpportunityAdded}
          />
          
          <ApplicationModal
            isOpen={showApplicationModal}
            onClose={() => setShowApplicationModal(false)}
            opportunity={selectedOpportunity}
          /> 
        </>
      )}
    </div>
  );
};

export default OpportunitiesPage;