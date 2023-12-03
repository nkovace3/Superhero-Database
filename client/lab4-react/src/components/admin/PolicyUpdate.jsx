import React, { useState, useEffect } from 'react';

const PolicyUpdate = () => {
  const [formData, setFormData] = useState({
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
        setFormData(data);
      } catch (error) {
        console.error('Error fetching policy data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateClick = async (field) => {
    try {
      const response = await fetch('/api/admin/update-policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field,
          value: formData[field] + ' Last Updated: ' + new Date().toLocaleDateString('en-US')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update policy');
      }

      alert(`${field} updated successfully!`);
    } catch (error) {
      console.error('Error updating policy:', error);
    }
  };

  return (
    <div>
      <h2>Update Policies</h2>
      <div className="update-policies">
        <div>
          <p>Update Security and Privacy Policy</p>
          <textarea
            name="security_and_privacy"
            value={formData.security_and_privacy}
            onChange={handleInputChange}
          />
          <button onClick={() => handleUpdateClick('security_and_privacy')}>Update</button>
        </div>
        <div>
          <p>Update DMCA Policy</p>
          <textarea name="dmca" value={formData.dmca} onChange={handleInputChange} />
          <button onClick={() => handleUpdateClick('dmca')}>Update</button>
        </div>
        <div>
          <p>Update AUP Policy</p>
          <textarea name="aup" value={formData.aup} onChange={handleInputChange} />
          <button onClick={() => handleUpdateClick('aup')}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default PolicyUpdate;
