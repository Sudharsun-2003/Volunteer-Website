import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaUsers, FaSearch, FaClock, FaHeart, FaPlus, FaFilter, FaMapPin } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostOpportunityModal from '../page_components/OpportunitiesPage/PostOpportunityModal';
import ApplicationModal from '../page_components/OpportunitiesPage/ApplOpportunities';

const OpportunityCard = ({ opportunity, onApply, isLoggedIn }) => {
  const navigate = useNavigate();
  const [showAddressDetails, setShowAddressDetails] = useState(false);

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
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [searchTerm, categoryFilter, districtFilter, statusFilter, opportunities]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/opportunities/');
      setOpportunities(response.data);
      setFilteredOpportunities(response.data);
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
    
    setFilteredOpportunities(filtered);
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
  };

  const categories = ['All', 'Environment', 'Community', 'Education', 'Healthcare', 'Social Work'];
  const statusOptions = ['All', 'Open', 'Filled', 'Completed', 'Canceled'];
  
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

  // Get unique districts from opportunities data
  const availableDistricts = ['All', ...new Set(
    opportunities
      .filter(opp => opp.address && opp.address.district)
      .map(opp => opp.address.district)
  )].sort();

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
              <button
                onClick={toggleFilters}
                className="py-3 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
              >
                <FaFilter className="mr-2" />
                Filters {showFilters ? '▲' : '▼'}
              </button>
            </div>
            
            {showFilters && (
              <div className="p-4 border border-gray-200 rounded-lg mt-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <div className="flex items-end">
                    <button
                      onClick={handleClearFilters}
                      className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Filter summary */}
        {(categoryFilter !== 'All' || districtFilter !== 'All' || statusFilter !== 'All' || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
            <span className="text-gray-700">Filters:</span>
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