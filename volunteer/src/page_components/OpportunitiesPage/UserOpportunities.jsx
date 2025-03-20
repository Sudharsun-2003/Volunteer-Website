import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiMapPin, FiAward, FiClock, FiHeart, FiCalendar, FiEdit, FiMenu, FiX, FiChevronRight, FiUsers, FiMapPin as FiLocation, FiClock as FiTime } from 'react-icons/fi';

const UserOpportunities = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opportunities, setOpportunities] = useState({
    posted: [],
    completed: []
  });
  const [expandedOpportunity, setExpandedOpportunity] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    emailid: '',
    district: '',
    skill: ''
  });

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Get token and userId from localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          console.log('No token or userId found in localStorage');
          navigate('/login');
          return;
        }
        
        // Fetch user profile data first
        const profileUrl = `http://localhost:5001/api/users/${userId}`;
        const profileResponse = await fetch(profileUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const userData = await profileResponse.json();
        setProfile(userData);

        // Fetch opportunities posted by this user
        const opportunitiesUrl = `http://localhost:5001/api/opportunities/user/${userId}`;
        const opportunitiesResponse = await fetch(opportunitiesUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!opportunitiesResponse.ok) {
          throw new Error('Failed to fetch opportunities data');
        }
        
        const opportunitiesData = await opportunitiesResponse.json();
        
        // Process opportunities to separate posted and completed
        const today = new Date();
        const postedOpps = opportunitiesData.opportunities || [];
        
        // Sort completed vs not completed (based on date)
        const completed = postedOpps.filter(opp => {
          const oppDate = new Date(opp.date);
          return oppDate < today;
        });
        
        const active = postedOpps.filter(opp => {
          const oppDate = new Date(opp.date);
          return oppDate >= today;
        });
        
        setOpportunities({
          posted: active,
          completed: completed
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchOpportunities();
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleOpportunityDetails = (opportunityId) => {
    if (expandedOpportunity === opportunityId) {
      setExpandedOpportunity(null);
    } else {
      setExpandedOpportunity(opportunityId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500 text-lg mb-4">Error loading opportunities</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/profile')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`bg-white transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'} absolute h-screen z-10`}>
          <div className={`p-4 ${sidebarOpen ? 'px-6' : 'px-3'}`}>
            <div className="flex justify-between items-center mb-6">
              {sidebarOpen && <h2 className="text-lg font-semibold text-gray-800">Volunteer Connect</h2>}
              <button 
                onClick={toggleSidebar} 
                className="p-2 rounded-full hover:bg-gray-100 items-center transition-colors"
              >
                {sidebarOpen ? <FiX className="text-gray-600 " /> : <FiMenu className="text-gray-600" />}
              </button>
            </div>
            
            <div className={`flex flex-col ${sidebarOpen ? 'items-center' : 'items-center'}`}>
              <div className={`rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold ${sidebarOpen ? 'h-24 w-24 text-xl' : 'h-12 w-12 text-sm'}`}>
                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
              </div>
              {sidebarOpen && (
                <>
                  <h2 className="mt-3 text-lg font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-xs text-gray-600 mb-1">{profile.emailid}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FiMapPin className="mr-1" size={10} />
                    <span>{profile.district}</span>
                  </div>
                </>
              )}
            </div>
            
            <nav className="mt-6">
              <div className="space-y-1">
                <button 
                  onClick={() => navigate('/profile')}
                  className={`w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md ${!sidebarOpen && 'justify-center'}`}
                >
                  <FiUser className={sidebarOpen ? 'mr-3' : ''} />
                  {sidebarOpen && <span>Profile</span>}
                </button>
                <button className={`w-full flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-md ${!sidebarOpen && 'justify-center'}`}>
                  <FiHeart className={sidebarOpen ? 'mr-3' : ''} />
                  {sidebarOpen && <span>Opportunities</span>}
                </button>
                <button className={`w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md ${!sidebarOpen && 'justify-center'}`}>
                  <FiAward className={sidebarOpen ? 'mr-3' : ''} />
                  {sidebarOpen && <span>Achievements</span>}
                </button>
                <button className={`w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md ${!sidebarOpen && 'justify-center'}`}>
                  <FiCalendar className={sidebarOpen ? 'mr-3' : ''} />
                  {sidebarOpen && <span>Calendar</span>}
                </button>
                <button 
                  className={`w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md ${!sidebarOpen && 'justify-center'}`}
                  onClick={handleLogout}
                >
                  <FiX className={sidebarOpen ? 'mr-3' : ''} />
                  {sidebarOpen && <span>Logout</span>}
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Opportunities</h1>
                <button 
                  onClick={() => navigate('/post-opportunity')} 
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiEdit className="mr-1.5" size={14} /> Post New Opportunity
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 pb-16">
            {/* Active Opportunities */}
            <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Active Opportunities</h2>
                <div className="text-sm text-gray-500">{opportunities.posted.length} posted</div>
              </div>
              
              {opportunities.posted.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.posted.map((opportunity) => (
                    <div key={opportunity._id} className="border rounded-lg overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleOpportunityDetails(opportunity._id)}>
                        <div className="mb-2 sm:mb-0">
                          <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                          <p className="text-sm text-gray-600">{opportunity.organization}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(opportunity.date)}</p>
                        </div>
                        <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
                          View Details <FiChevronRight size={14} className="ml-1" />
                        </button>
                      </div>
                      
                      {expandedOpportunity === opportunity._id && (
                        <div className="bg-gray-50 p-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center">
                              <FiUsers className="text-blue-600 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Volunteers</p>
                                <p className="text-sm font-medium">{opportunity.applicants?.length || 0} / {opportunity.volunteers}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FiLocation className="text-blue-600 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-sm font-medium">{opportunity.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FiTime className="text-blue-600 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="text-sm font-medium">{opportunity.start_time} - {opportunity.end_time}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Description</p>
                            <p className="text-sm text-gray-700">{opportunity.description}</p>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Address</p>
                            <p className="text-sm text-gray-700">
                              {opportunity.address?.street}, {opportunity.address?.city}, {opportunity.address?.district}, {opportunity.address?.pincode}
                            </p>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button 
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              onClick={() => navigate(`/opportunity/${opportunity._id}`)}
                            >
                              Manage Opportunity
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">You haven't posted any active opportunities yet.</p>
                  <button 
                    onClick={() => navigate('/post-opportunity')}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Post Your First Opportunity
                  </button>
                </div>
              )}
            </div>
            
            {/* Completed Opportunities */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Completed Opportunities</h2>
                <div className="text-sm text-gray-500">{opportunities.completed.length} completed</div>
              </div>
              
              {opportunities.completed.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.completed.map((opportunity) => (
                    <div key={opportunity._id} className="border rounded-lg overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleOpportunityDetails(opportunity._id)}>
                        <div className="mb-2 sm:mb-0">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                          </div>
                          <p className="text-sm text-gray-600">{opportunity.organization}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(opportunity.date)}</p>
                        </div>
                        <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
                          View Summary <FiChevronRight size={14} className="ml-1" />
                        </button>
                      </div>
                      
                      {expandedOpportunity === opportunity._id && (
                        <div className="bg-gray-50 p-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center">
                              <FiUsers className="text-green-600 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Participated</p>
                                <p className="text-sm font-medium">{opportunity.applicants?.length || 0} volunteers</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FiLocation className="text-green-600 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-sm font-medium">{opportunity.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FiClock className="text-green-600 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="text-sm font-medium">{opportunity.duration} hours</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Impact</p>
                            <p className="text-sm text-gray-700">{opportunity.impact}</p>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button 
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              onClick={() => navigate(`/opportunity/${opportunity._id}/summary`)}
                            >
                              View Full Summary
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">You don't have any completed opportunities yet.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserOpportunities;