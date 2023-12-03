import React, { useState, useEffect } from 'react';
import '../css/Policies.css'

const DisplayPolicies = () => {
  const [policies, setPolicies] = useState({
    security_and_privacy: '',
    dmca: '',
    aup: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/get-policy');

        if (!response.ok) {
          throw new Error('Failed to fetch policy data');
        }

        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error('Error fetching policy data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h2>Security and Privacy Policy</h2>
        <div className = "policy">{policies.security_and_privacy}</div>
      </div>
      <div>
        <h2>DMCA Policy</h2>
        <div className = "policy">{policies.dmca}</div>
      </div>
      <div>
        <h2>AUP Policy</h2>
        <div className = "policy">{policies.aup}</div>
      </div>
    </div>
  );
};

export default DisplayPolicies;
