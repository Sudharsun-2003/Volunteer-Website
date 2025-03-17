import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
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
      state: 'Tamil Nadu'
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
  });
  
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
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a FormData object to send the multipart/form-data
      const formDataToSend = new FormData();
      
      // Add image file
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Add all other form fields
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          // Handle nested address object
          Object.keys(formData.address).forEach(addressKey => {
            formDataToSend.append(`address[${addressKey}]`, formData.address[addressKey]);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Convert volunteers to number
      formDataToSend.set('volunteers', Number(formData.volunteers));
      
      const response = await axios.post('http://localhost:5001/api/opportunities/', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating opportunity:', error);
      setError('Failed to create opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Post New Opportunity</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.address.district}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, district: e.target.value}
                  })}
                  disabled={isSubmitting}
                >
                  <option value="">Select a district</option>
                  {tamilNaduDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  readOnly
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          
          {/* Image upload section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div className="flex flex-col space-y-4">
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostOpportunityModal;