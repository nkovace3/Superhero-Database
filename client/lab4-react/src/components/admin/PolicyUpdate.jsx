// Import necessary modules and components from React
import React, { useState, useEffect } from 'react';

// Define the functional component PolicyUpdate
const PolicyUpdate = () => {
  // State variable to store form data for policy updates
  const [formData, setFormData] = useState({
    security_and_privacy: '',
    dmca: '',
    aup: '',
  });

  // useEffect hook to fetch policy data from the server when the component mounts
  useEffect(() => {
    // Function to fetch policy data
    const fetchData = async () => {
      try {
        // Fetch policy data from the server
        const response = await fetch('/api/admin/get-policy');

        // Check if the fetch operation was successful
        if (!response.ok) {
          throw new Error('Failed to fetch policy data');
        }

        // Parse the response and update the form data state
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        // Handle errors during the fetch operation
        console.error('Error fetching policy data:', error);
      }
    };

    // Run fetchData when the component mounts
    fetchData();
  }, []);

  // Event handler for updating form data on input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Event handler for updating a specific policy field on button click
  const handleUpdateClick = async (field) => {
    try {
      // Send a request to the server to update the specified policy field
      const response = await fetch('/api/admin/update-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include the updated value and timestamp in the request body
        body: JSON.stringify({
          field,
          value: formData[field] + ' Last Updated: ' + new Date().toLocaleDateString('en-US'),
        }),
      });

      // Check if the update operation was successful
      if (!response.ok) {
        throw new Error('Failed to update policy');
      }

      // Show an alert indicating a successful update
      alert(`${field} updated successfully!`);
    } catch (error) {
      // Handle errors during the update operation
      console.error('Error updating policy:', error);
    }
  };

  // Render the component UI
  return (
    <div>
      <h2>Update Policies</h2>
      <div className="update-policies">
        {/* Form sections for updating each policy field */}
        <div>
          <p>Update Security and Privacy Policy</p>
          {/* Textarea for updating security and privacy policy */}
          <textarea
            name="security_and_privacy"
            value={formData.security_and_privacy}
            onChange={handleInputChange}
          />
          {/* Button to trigger updating security and privacy policy */}
          <button onClick={() => handleUpdateClick('security_and_privacy')}>Update</button>
        </div>
        <div>
          <p>Update DMCA Policy</p>
          {/* Textarea for updating DMCA policy */}
          <textarea name="dmca" value={formData.dmca} onChange={handleInputChange} />
          {/* Button to trigger updating DMCA policy */}
          <button onClick={() => handleUpdateClick('dmca')}>Update</button>
        </div>
        <div>
          <p>Update AUP Policy</p>
          {/* Textarea for updating AUP policy */}
          <textarea name="aup" value={formData.aup} onChange={handleInputChange} />
          {/* Button to trigger updating AUP policy */}
          <button onClick={() => handleUpdateClick('aup')}>Update</button>
        </div>
      </div>
    </div>
  );
};

// Export the PolicyUpdate component as the default export
export default PolicyUpdate;
