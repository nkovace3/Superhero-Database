import React, { useState, useEffect } from 'react';

const PolicyUpdate = () => {
  const [formData, setFormData] = useState({
    security_and_privacy: '',
    dmca: '',
    aup: '',
  });

  useEffect(() => {
    // Fetch initial data from the server when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/get-policy'); // Adjust the endpoint accordingly

        if (!response.ok) {
          throw new Error('Failed to fetch policy data');
        }

        const data = await response.json();
        setFormData(data); // Assuming the response is an object with the same structure as formData
      } catch (error) {
        console.error('Error fetching policy data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once when the component mounts

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
          value: formData[field],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update policy');
      }

      // Optionally, you can handle success or show a notification
      console.log(`${field} updated successfully!`);
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
