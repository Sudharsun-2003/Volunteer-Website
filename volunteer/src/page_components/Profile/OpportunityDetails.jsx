import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCheck, FiX, FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';

const OpportunityDetails = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    // Update this function
const fetchOpportunityDetails = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      console.log('No token or userId found in localStorage');
      navigate('/login');
      return;
    }
    
    // Fetch opportunity details
    const opportunityUrl = `https://volunteer-backend-egrn.onrender.com/api/opportunities/${opportunityId}`;
    const opportunityResponse = await fetch(opportunityUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!opportunityResponse.ok) {
      throw new Error('Failed to fetch opportunity data');
    }
    
    const opportunityData = await opportunityResponse.json();
    setOpportunity(opportunityData);
    
    // Extract applicants from the opportunity data
    // Map them to match the expected structure in your component
    const mappedApplicants = opportunityData.applicants.map(app => ({
      _id: app.userId._id,
      name: app.userId.name,
      email: app.userId.emailid, // Note: backend has emailid, not email
      phone: app.userId.phone || "Not provided", // Handle missing phone
      status: app.status.toLowerCase() // Convert to lowercase for frontend
    }));
    
    setApplicants(mappedApplicants);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching opportunity details:', err);
    setError(err.message);
    setLoading(false);
  }
};
    
    fetchOpportunityDetails();
  }, [opportunityId, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusUpdate = async (applicantId, status) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Convert frontend status to backend status format
      const backendStatus = status === 'accepted' ? 'Approved' :
                           status === 'rejected' ? 'Rejected' : 'Pending';
      
      // Update applicant status using the update application status endpoint
      const updateUrl = `https://volunteer-backend-egrn.onrender.com/api/opportunities/${opportunityId}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT', // Note: backend uses PUT not PATCH
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: applicantId,
          status: backendStatus,
          requesterId: userId // Required by backend
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update applicant status');
      }
      
      // Update local state
      setApplicants(prevApplicants => 
        prevApplicants.map(applicant => 
          applicant._id === applicantId ? { ...applicant, status } : applicant
        )
      );
      
      setUpdateMessage(`Applicant status updated to ${status}`);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating applicant status:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500 text-lg mb-4">Error loading opportunity details</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/opportunities')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">Opportunity not found</p>
          <button 
            onClick={() => navigate('/opportunities')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/opportunities')} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back to My Opportunities
          </button>
        </div>
        
        {updateMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {updateMessage}
          </div>
        )}
        
        {/* Opportunity Details */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
            <p className="text-gray-600">{opportunity.organization}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center">
                <FiCalendar className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(opportunity.date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiClock className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{opportunity.start_time} - {opportunity.end_time}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiMapPin className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{opportunity.location}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700">{opportunity.description}</p>
            </div>
            
            <div className="flex items-center mb-6">
              <FiUsers className="text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Volunteers</p>
                <p className="font-medium">{applicants.length} / {opportunity.volunteers}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Applicants Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Applicants</h2>
          </div>
          
          {applicants.length > 0 ? (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applicants.map((applicant) => (
                      <tr key={applicant._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FiUser className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiMail className="mr-1 text-gray-400" />
                              {applicant.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FiPhone className="mr-1 text-gray-400" />
                              {applicant.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              applicant.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {applicant.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleStatusUpdate(applicant._id, 'accepted')}
                                className="text-white bg-green-600 hover:bg-green-700 p-1.5 rounded-full"
                                title="Accept"
                              >
                                <FiCheck />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(applicant._id, 'rejected')}
                                className="text-white bg-red-600 hover:bg-red-700 p-1.5 rounded-full"
                                title="Reject"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleStatusUpdate(applicant._id, 'pending')}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Reset Status
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No applicants yet for this opportunity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;