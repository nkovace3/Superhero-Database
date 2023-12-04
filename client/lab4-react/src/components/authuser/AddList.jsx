// Import necessary modules and components from React, Firebase, and other libraries
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../css/AddList.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../authentication';

// Define the functional component AddList
const AddList = ({ isEditing, onCancelEdit, selectedList, onUpdate }) => {
  // Define privacy options for the dropdown
  const privacyOptions = [
    { value: true, label: 'Public' },
    { value: false, label: 'Private' },
  ];

  // State variable to store form data
  const [formData, setFormData] = useState({
    list_name: '',
    privacy: false,
    ids: [],
    description: '',
  });

  // Effect hook to populate the form data when editing an existing list
  useEffect(() => {
    if (selectedList) {
      let initialIds;
      if (Array.isArray(selectedList.ids) && typeof selectedList.ids[0] === 'number') {
        initialIds = selectedList.ids.map((id) => ({ value: id, label: `ID ${id}` }));
      } else {
        initialIds = selectedList.ids;
      }
      setFormData({
        list_name: selectedList.list_name,
        privacy: selectedList.privacy.toString(),
        ids: initialIds,
        description: selectedList.description || '',
      });
    }
  }, [selectedList]);

  // Event handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Event handler for privacy dropdown changes
  const handlePrivacyChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      privacy: selectedOption.value,
    }));
  };

  // Event handler for superhero IDs dropdown changes
  const handleIdsChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      ids: selectedOptions.map((option) => ({ value: option.value, label: `ID ${option.value}` })),
    }));
  };

  // Effect hook to obtain the user's display name (username)
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName);
      } else {
        setDisplayName('');
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to submit the form data
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      // Check if a list name already exists for the user when adding a new list
      if (!selectedList) {
        const response = await fetch(`/api/listnum/${displayName}`);
        if (!response.ok) {
          alert("Too many lists added by user!");
          return;
        }
      }

      // Get the current user and ID token
      const user = auth.currentUser;
      const idToken = await user.getIdToken();

      // Perform list update or addition based on the editing state
      if (isEditing) {
        // Handle validation for required fields
        if (formData.list_name.length === 0) {
          alert("You must enter a list name!");
          return;
        }
        if (formData.ids.length === 0) {
          alert("You must enter at least 1 superhero!");
          return;
        }

        // Send a request to update the list
        const res = await fetch(`/api/update/${selectedList.list_name}/${displayName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': idToken,
          },
          body: JSON.stringify({
            list_name: formData.list_name,
            privacy: formData.privacy,
            ids: formData.ids.map((option) => option.value),
            description: formData.description,
            username: displayName,
            modification_time: Date.now()
          }),
        });

        // Handle the response
        if (res.ok) {
          alert(`List updated successfully: ${formData.list_name}`);
          onUpdate();
          onCancelEdit();
        } else if (res.status === 400) {
          // Handle 400 Bad Request if needed
        }
      } else {
        // Handle validation for required fields
        if (formData.list_name.length === 0) {
          alert("You must enter a list name!");
          return;
        }
        if (formData.ids.length === 0) {
          alert("You must enter at least 1 superhero!");
          return;
        }

        // Send a request to add a new list
        const res = await fetch('/api/lists/' + formData.list_name, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': idToken
          },
          body: JSON.stringify({
            list_name: formData.list_name,
            privacy: formData.privacy,
            ids: formData.ids.map((option) => option.value),
            description: formData.description,
            username: displayName,
            modification_time: Date.now()
          }),
        });

        // Handle the response
        const data = await res.json();
        if (res.ok) {
          alert(`List ${selectedList ? 'updated' : 'added'} successfully: ${data.list_name}`);
        } else {
          console.log(res.status);
        }
      }

    } catch (error) {
      console.log("Error fetching data", error);
      console.error("Error: " + error);
      alert("List name already exists!");
    }
  };

  // Generate superhero ID options
  const idOptions = Array.from({ length: 734 }, (_, index) => ({
    value: index,
    label: `${index}`
  }));

  // Render the AddList component
  return (
    <div>
      <h2>{selectedList ? 'Edit List' : 'Add List'}</h2>
      <div className="add-list-container">
        <form className="my-form">
          {/* Input for List Name */}
          <label className="my-label" htmlFor="list_name">List Name:</label>
          <input
            className="my-input"
            type="text"
            id="list_name"
            name="list_name"
            value={formData.list_name}
            onChange={handleInputChange}
            required
          />

          {/* Dropdown for Privacy */}
          <label className="my-label" htmlFor="privacy">Privacy:</label>
          <Select
            className="my-dropdown"
            options={privacyOptions}
            value={privacyOptions.find((option) => option.value === formData.privacy)}
            onChange={handlePrivacyChange}
            defaultValue={privacyOptions[1]}
          />

          {/* Multi-select Dropdown for Superhero IDs */}
          <label className="my-label" htmlFor="ids">Superhero IDs:</label>
          <Select
            className="my-dropdown"
            isMulti
            options={idOptions}
            value={formData.ids}
            onChange={handleIdsChange}
          />

          {/* Input for Description (Optional) */}
          <label className="my-label" htmlFor="description">Description (Optional):</label>
          <input
            className="my-input"
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          {/* Button to submit the form */}
          <button className="my-button" type="button" onClick={submitForm}>
            {selectedList ? 'Save Changes' : 'Add List'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Export the AddList component as the default export
export default AddList;
