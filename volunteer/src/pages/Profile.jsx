import React, { useState } from 'react';
import { FiUser, FiMail, FiMapPin, FiAward, FiClock, FiHeart, FiCalendar, FiEdit, FiMenu, FiX, FiChevronRight, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'New York, NY',
    bio: 'Passionate about helping others and making a difference in the community.',
    skills: ['Teaching', 'Gardening', 'Event Planning', 'Leadership', 'Communication', 'Project Management'],
    stats: {
      totalHours: 150,
      opportunitiesCompleted: 12,
      organizationsHelped: 5,
      upcomingEvents: 3
    },
    achievements: [
      { id: 1, title: '100 Hours Club', description: 'Completed 100+ volunteer hours', date: '2024-02-01' },
      { id: 2, title: 'Community Leader', description: 'Led 5+ community events', date: '2024-01-15' },
      { id: 3, title: 'First Milestone', description: 'Completed first volunteer opportunity', date: '2023-12-01' }
    ],
    completedOpportunities: [
      {
        id: 1,
        title: 'Community Garden Helper',
        organization: 'Green Earth Initiative',
        date: '2024-03-15',
        hours: 4,
        impact: 'Helped maintain community garden serving 100+ families'
      },
      {
        id: 2,
        title: 'Food Bank Volunteer',
        organization: 'Local Food Bank',
        date: '2024-03-10',
        hours: 3,
        impact: 'Distributed food to 50+ families in need'
      }
    ],
    upcomingOpportunities: [
      {
        id: 1,
        title: 'Youth Mentoring Program',
        organization: 'Education First',
        date: '2024-04-01',
        duration: '2 hours',
        status: 'Confirmed'
      },
      {
        id: 2,
        title: 'Beach Cleanup Drive',
        organization: 'Ocean Warriors',
        date: '2024-04-15',
        duration: '3 hours',
        status: 'Pending'
      }
    ]
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Now collapsible */}
        <div className={`bg-white  transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'} absolute h-screen z-10`}>
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
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              {sidebarOpen && (
                <>
                  <h2 className="mt-3 text-lg font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-xs text-gray-600 mb-1">{profile.email}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FiMapPin className="mr-1" size={10} />
                    <span>{profile.location}</span>
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
                <button className={`w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md ${!sidebarOpen && 'justify-center'}`}>
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
                  <p className="text-gray-600 text-sm">{profile.bio}</p>
                  
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold text-gray-900">Skills & Expertise</h3>
                      <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                        View all <FiChevronRight size={14} className="ml-1" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-gray-900">Recent Opportunities</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                      View all <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profile.completedOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{opportunity.title}</h4>
                            <p className="text-xs text-gray-600">{opportunity.organization}</p>
                            <p className="text-xs text-gray-500 mt-1">{opportunity.impact}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-medium text-gray-900">{opportunity.hours} hours</span>
                            <p className="text-xs text-gray-500">{opportunity.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-3">
                    {profile.upcomingOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <h4 className="text-sm font-medium text-gray-900">{opportunity.title}</h4>
                        <p className="text-xs text-gray-600">{opportunity.organization}</p>
                        <div className="mt-1.5 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{opportunity.date}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            opportunity.status === 'Confirmed' 
                              ? 'bg-green-50 text-green-700 border border-green-100' 
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                          }`}>
                            {opportunity.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-gray-900">Achievements</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                      View all <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
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