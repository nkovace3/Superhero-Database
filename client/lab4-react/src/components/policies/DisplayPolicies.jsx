// Import necessary modules and styles
import React, { useState, useEffect } from 'react';
import '../css/Policies.css';

// Define the functional component DisplayPolicies
const DisplayPolicies = () => {
  // State variable to store policy data
  const [policies, setPolicies] = useState({
    security_and_privacy: '',
    dmca: '',
    aup: '',
  });

  // Effect hook to fetch policy data on component mount
  useEffect(() => {
    // Function to fetch policy data asynchronously
    const fetchData = async () => {
      try {
        // Fetch policy data from the '/api/admin/get-policy' endpoint
        const response = await fetch('/api/admin/get-policy');

        // Throw an error if the response is not okay (HTTP status not in the range 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch policy data');
        }

        // Parse the response JSON and set the policies state
        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        // Log an error message if there's an error fetching policy data
        console.error('Error fetching policy data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures that the effect runs only once on mount

  // Render the UI for displaying policies
  return (
    <div>
      {/* Render each policy section with its corresponding title and content */}
      <div>
        <h2>Security and Privacy Policy</h2>
        {/* Display the security_and_privacy policy content */}
        <div className="policy">{policies.security_and_privacy}</div>
      </div>
      <div>
        <h2>DMCA Policy</h2>
        {/* Display the dmca policy content */}
        <div className="policy">{policies.dmca}</div>
      </div>
      <div>
        <h2>AUP Policy</h2>
        {/* Display the aup policy content */}
        <div className="policy">{policies.aup}</div>
      </div>
    </div>
  );
};

// Export the DisplayPolicies component as the default export
export default DisplayPolicies;
