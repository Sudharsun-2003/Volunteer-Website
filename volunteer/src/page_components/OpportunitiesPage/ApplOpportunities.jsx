import React, { useState, useEffect } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import axios from 'axios';

const ApplicationModal = ({ isOpen, onClose, opportunity }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    relevantExperience: '',
    additionalMessage: ''
  });
  const [idProofImage, setIdProofImage] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Get the user ID from localStorage
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    // Validate ID proof image
    if (!idProofImage) {
      setError('ID proof image is required.');
      setSubmitting(false);
      return;
    }
    
    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('opportunityId', opportunity._id);
      formDataObj.append('userId', userId);
      formDataObj.append('fullName', formData.fullName);
      formDataObj.append('phoneNumber', formData.phoneNumber);
      formDataObj.append('relevantExperience', formData.relevantExperience || '');
      formDataObj.append('additionalMessage', formData.additionalMessage || '');
      formDataObj.append('idProofImage', idProofImage);
      
      // Send the application to the API with the auth token
      const response = await axios.post('https://volunteer-backend-egrn.onrender.com/api/applications/apply', formDataObj, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdProofImage(file);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setIdProofPreview(previewUrl);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      relevantExperience: '',
      additionalMessage: ''
    });
    setIdProofImage(null);
    setIdProofPreview(null);
    setError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  // Clean up preview URL when component unmounts or when a new file is selected
  useEffect(() => {
    return () => {
      if (idProofPreview) {
        URL.revokeObjectURL(idProofPreview);
      }
    };
  }, [idProofPreview]);

  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={submitting}
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-2">Apply for Opportunity</h2>
        <p className="text-gray-600 mb-6">{opportunity.title} - {opportunity.organization}</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              disabled={submitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              disabled={submitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof</label>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <FaUpload className="mr-2" />
                  <span>Upload ID Proof</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={submitting}
                    required
                  />
                </label>
                <span className="ml-4 text-sm text-gray-500">
                  {idProofImage ? idProofImage.name : 'No file selected'}
                </span>
              </div>
              
              {idProofPreview && (
                <div className="mt-2">
                  <img 
                    src={idProofPreview} 
                    alt="ID Proof Preview" 
                    className="max-h-48 rounded-lg border border-gray-300" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.relevantExperience}
              onChange={(e) => setFormData({...formData, relevantExperience: e.target.value})}
              disabled={submitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.additionalMessage}
              onChange={(e) => setFormData({...formData, additionalMessage: e.target.value})}
              disabled={submitting}
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:bg-gray-100"
              disabled={submitting}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;