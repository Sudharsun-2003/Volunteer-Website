import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiMapPin, FiAward, FiClock, FiHeart, FiCalendar, FiEdit, FiMenu, FiX, FiChevronRight } from 'react-icons/fi';
import UserOpportunities from '../page_components/OpportunitiesPage/UserOpportunities';

const Profile = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    emailid: '',
    district: '',
    skill: '',
    userid: '',
    created_at: '',
    updated_at: '',
    stats: {
      totalHours: 0,
      opportunitiesCompleted: 0,
      organizationsHelped: 0,
      upcomingEvents: 0
    },
    achievements: [],
    applications: [],
    upcomingOpportunities: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token and userId from localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        console.log('Token:', token);
        console.log('User ID:', userId);
        
        if (!token || !userId) {
          console.log('No token or userId found in localStorage');
          navigate('/login');
          return;
        }
        
        // Fetch user profile data
        const profileUrl = `http://localhost:5001/api/users/${userId}`;
        console.log('Fetching profile from:', profileUrl);
        
        const profileResponse = await fetch(profileUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          console.error('API error response:', errorData);
          throw new Error(`Failed to fetch profile data: ${errorData.message || profileResponse.statusText}`);
        }
        
        const userData = await profileResponse.json();
        console.log('User data received:', userData);
        
        // Fetch user applications
        const applicationsUrl = `http://localhost:5001/api/applications/user-applications/${userId}`;
        console.log('Fetching applications from:', applicationsUrl);
        
        const applicationsResponse = await fetch(applicationsUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let applications = [];
        let upcomingOpportunities = [];
        
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          console.log('Applications data received:', applicationsData);
          
          // Process applications to separate past and upcoming opportunities
          if (applicationsData.applications && applicationsData.applications.length > 0) {
            applications = applicationsData.applications.map(app => ({
              id: app._id,
              title: app.opportunityTitle || (app.opportunityId ? app.opportunityId.title : 'Unnamed Opportunity'),
              category: app.opportunityCategory || (app.opportunityId ? app.opportunityId.category : 'Uncategorized'),
              status: app.status,
              date: formatDate(app.appliedAt),
              rawDate: app.appliedAt
            }));
            
            // Calculate stats
            const stats = {
              totalHours: 0,
              opportunitiesCompleted: applications.filter(app => app.status === 'accepted').length,
              organizationsHelped: new Set(applications.filter(app => app.status === 'accepted').map(app => app.title)).size,
              upcomingEvents: 0
            };
            
            // Get upcoming opportunities based on event dates
            // In a real scenario, you would compare with the event date from the opportunity model
            const today = new Date();
            
            // For this example, we'll use applications with status 'accepted' as upcoming
            upcomingOpportunities = applications
              .filter(app => app.status === 'accepted')
              .map(app => ({
                id: app.id,
                title: app.title,
                organization: app.category,
                date: app.date,
                status: 'Confirmed'
              }));
              
            stats.upcomingEvents = upcomingOpportunities.length;
            
            // Format the data for our profile component
            setProfile({
              ...userData,
              stats,
              achievements: [],
              applications,
              upcomingOpportunities
            });
          } else {
            setProfile({
              ...userData,
              stats: {
                totalHours: 0,
                opportunitiesCompleted: 0,
                organizationsHelped: 0,
                upcomingEvents: 0
              },
              achievements: [],
              applications: [],
              upcomingOpportunities: []
            });
          }
        } else {
          console.log('No applications found or error fetching applications');
          setProfile({
            ...userData,
            stats: {
              totalHours: 0,
              opportunitiesCompleted: 0,
              organizationsHelped: 0,
              upcomingEvents: 0
            },
            achievements: [],
            applications: [],
            upcomingOpportunities: []
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Add logout function
  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    // Any other auth-related items should be cleared here
    
    console.log('User logged out');
    
    // Navigate to login page
    navigate('/login');
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted':
        return 'bg-green-50 text-green-700 border border-green-100';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-100';
      default: // pending
        return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500 text-lg mb-4">Error loading profile</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Now collapsible */}
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
                <button className={`w-full flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-md ${!sidebarOpen && 'justify-center'}`}>
                  <FiUser className={sidebarOpen ? 'mr-3' : ''} />
                  {sidebarOpen && <span>Profile</span>}
                </button>
                
                <button 
                  onClick={() => navigate('/oopportunities')}
                  className={`w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md ${!sidebarOpen && 'justify-center'}`}
                >
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
                {/* Add logout to sidebar */}
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
                <h1 className="text-2xl font-bold text-gray-900">Volunteer Profile</h1>
                <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                  <FiEdit className="mr-1.5" size={14} /> Edit Profile
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Stats Cards */}
              <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FiClock className="text-blue-600" size={18} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600">Total Hours</p>
                      <p className="text-xl font-bold text-gray-900">{profile.stats.totalHours}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full">
                      <FiHeart className="text-green-600" size={18} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600">Opportunities</p>
                      <p className="text-xl font-bold text-gray-900">{profile.stats.opportunitiesCompleted}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FiAward className="text-purple-600" size={18} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600">Organizations</p>
                      <p className="text-xl font-bold text-gray-900">{profile.stats.organizationsHelped}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <FiCalendar className="text-yellow-600" size={18} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-600">Upcoming</p>
                      <p className="text-xl font-bold text-gray-900">{profile.stats.upcomingEvents}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Profile Info */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-gray-900">About</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                      View more <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Volunteer since {formatDate(profile.created_at)}
                  </p>
                  
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold text-gray-900">Skills & Expertise</h3>
                      <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                        Add skills <FiChevronRight size={14} className="ml-1" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {profile.skill}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold text-gray-900">User Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">User ID</p>
                        <p className="text-sm font-medium">{profile.userid}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">{profile.emailid}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">District</p>
                        <p className="text-sm font-medium">{profile.district}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="text-sm font-medium">{formatDate(profile.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-gray-900">Applications</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                      Find opportunities <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                  {profile.applications.length > 0 ? (
                    <div className="space-y-3">
                     {profile.applications.map((application) => (
                        <div key={application.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{application.title}</h4>
                              <p className="text-xs text-gray-600">{application.category}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(application.status)}`}>
                                {formatStatus(application.status)}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">{application.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">No applications yet.</p>
                      <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        Find your first opportunity
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Side Content */}
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-gray-900">Upcoming Events</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                      View all <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                  
                  {profile.upcomingOpportunities.length > 0 ? (
                    <div className="space-y-3">
                      {profile.upcomingOpportunities.map((opportunity) => (
                        <div key={opportunity.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <h4 className="text-sm font-medium text-gray-900">{opportunity.title}</h4>
                          <p className="text-xs text-gray-600">{opportunity.organization}</p>
                          <div className="mt-1.5 flex justify-between items-center">
                            <span className="text-xs text-gray-500">{opportunity.date}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">
                              {opportunity.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">No upcoming events.</p>
                      <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                        Browse opportunities
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-gray-900">Achievements</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                      View all <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                  
                  {profile.achievements.length > 0 ? (
                    <div className="space-y-3">
                      {profile.achievements.map((achievement) => (
                        <div key={achievement.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <div className="p-1.5 bg-purple-50 rounded-full mr-2.5 border border-purple-100">
                              <FiAward className="text-purple-600" size={14} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{achievement.title}</h4>
                              <p className="text-xs text-gray-600">{achievement.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">Complete volunteer opportunities to earn achievements!</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Account Details</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium">{formatDate(profile.created_at)}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium">{profile.updated_at ? formatDate(profile.updated_at) : formatDate(profile.created_at)}</p>
                    </div>
                    
                    <div className="pt-3">
                      <button 
                        className="w-full py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;