import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaUsers, FaSearch, FaClock, FaHeart, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const PostOpportunityModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    address: {
      street: '',
      city: '',
      district: '',
      pincode: '',
      state: ''
    },
    date: '',
    start_time: '',
    end_time: '',
    description: '',
    volunteers: '',
    category: 'Environment',
    duration: '',
    skills: '',
    impact: '',
    imageUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format skills as needed by API
      const formattedData = {
        ...formData,
        volunteers: Number(formData.volunteers), // Convert to number
        skills: formData.skills // Server will handle this as a string
      };
      
      const response = await axios.post('http://localhost:5000/api/opportunities/', formattedData);
      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Failed to create opportunity. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Post New Opportunity</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>
          
          {/* Address fields */}
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, street: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, city: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.address.district}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, district: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.address.pincode}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, pincode: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, state: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Environment">Environment</option>
                <option value="Community">Community</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Social Work">Social Work</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <input
                type="text"
                required
                placeholder="e.g., 4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volunteers Needed</label>
              <input
                type="number"
                required
                placeholder="e.g., 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.volunteers}
                onChange={(e) => setFormData({...formData, volunteers: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (comma-separated)</label>
            <input
              type="text"
              required
              placeholder="e.g., Gardening, Physical Work, Team Player"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Impact Statement</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.impact}
              onChange={(e) => setFormData({...formData, impact: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              required
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Post Opportunity
          </button>
        </form>
      </div>
    </div>
  );
};

const ApplicationModal = ({ isOpen, onClose, opportunity }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/opportunities/${opportunity._id}/apply`, formData);
      alert('Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-2">Apply for Opportunity</h2>
        <p className="text-gray-600 mb-6">{opportunity.title} - {opportunity.organization}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = ['All', 'Environment', 'Community', 'Education', 'Healthcare', 'Social Work'];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/opportunities/');
      setOpportunities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setError('Failed to load opportunities. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddOpportunity = (newOpportunity) => {
    setOpportunities([...opportunities, newOpportunity]);
  };

  const handleApplyClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsApplyModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatSkills = (skills) => {
    if (typeof skills === 'string') {
      return skills.split(',').map(skill => skill.trim());
    }
    return Array.isArray(skills) ? skills : [];
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Volunteer Opportunities
              </h1>
              <p className="mt-2 text-gray-600 max-w-3xl">
                Make a difference in your community by joining these meaningful volunteer opportunities.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaPlus className="mr-2" />
              Post Opportunity
            </button>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchOpportunities}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSearch size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredOpportunities.map((opportunity) => (
              <div 
                key={opportunity._id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 relative group">
                    <img
                      src={opportunity.imageUrl}
                      alt={opportunity.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full shadow-sm">
                        {opportunity.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{opportunity.title}</h2>
                        <div className="flex items-center text-gray-700 mb-4">
                          <FaBuilding className="mr-2" />
                          <span className="font-medium">{opportunity.organization}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleApplyClick(opportunity)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        Apply Now
                      </button>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {opportunity.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="text-gray-900">{opportunity.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p className="text-gray-900">{formatDate(opportunity.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="text-gray-900">{opportunity.duration} hours</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Volunteers Needed</p>
                          <p className="text-gray-900">{opportunity.volunteers}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {formatSkills(opportunity.skills).map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaHeart className="text-red-400 mr-2" />
                        <p className="text-sm text-gray-700">{opportunity.impact}</p>
                      </div>
                    </div>
                    
                    {opportunity.address && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Complete Address</h3>
                        <p className="text-gray-700">
                          {opportunity.address.street}, {opportunity.address.city}, {opportunity.address.district}, {opportunity.address.state}, {opportunity.address.pincode}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Timing</h3>
                      <p className="text-gray-700">
                        {opportunity.start_time} - {opportunity.end_time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PostOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOpportunity}
      />
      
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        opportunity={selectedOpportunity}
      />
    </div>
  );
};

export default Opportunities;