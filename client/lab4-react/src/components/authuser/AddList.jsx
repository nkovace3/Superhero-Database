import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../css/AddList.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../authentication';

const AddList = () => {
  const [formData, setFormData] = useState({
    list_name: '',
    privacy: 'public',
    ids: [],
    description: '',
  });

  const privacyOptions = [
    { value: true, label: 'Public' },
    { value: false, label: 'Private' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      privacy: selectedOption.value,
    }));
  };

  const handleIdsChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      ids: selectedOptions.map((option) => Number(option.value)),
    }));
  };

  //Obtains the user's display name (username)
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(user){
            setDisplayName(user.displayName);
        }else{
            setDisplayName('');
        }
  })
  return () => unsubscribe();
 }, []);

  const submitForm = async(e) => {
    e.preventDefault();
    try{
    const response = await fetch(`/api/listnum/${displayName}`);
    if(response.ok){
        try {
            const user = auth.currentUser;
            const idToken = await user.getIdToken();
            const res = await fetch('/api/lists/'+ formData.list_name, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': idToken
                },
                body: JSON.stringify({
                    list_name: formData.list_name,
                    privacy: formData.privacy,
                    ids: formData.ids,
                    description: formData.description,
                    username: displayName
                }),
            });
            const data = await res.json();
            if(res.ok){
                console.log("List added successfully: " + data.list_name);
            }else if (res.status === 400){
                
            }
        }
        catch (error) {
            console.error("Error: " + error);
            alert("List name already exists!");
        }
    }else{
        alert("Too many lists added by user!");
    }     
} catch (error) {
    console.log("Error fetching data", error);
}
  };

  const idOptions = Array.from({ length: 734}, (_, index) => ({
    value: index,
    label: `${index}`
  }));

  return (
    <div>
    <h2>Add List</h2>
    <div class = "add-list-container">
      
      <form className="my-form">
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
  
        <label className="my-label" htmlFor="privacy">Privacy:</label>
        <Select
          className="my-dropdown"
          options={privacyOptions}
          value={privacyOptions.find((option) => option.value === formData.privacy)}
          onChange={handlePrivacyChange}
        />
  
        <label className="my-label" htmlFor="ids">Superhero IDs:</label>
        <Select
          className="my-dropdown"
          isMulti
          options = {idOptions}
          value={formData.ids.map((id) => ({ value: id, label: `ID ${id}` }))}
          onChange={handleIdsChange}
        />
  
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
  
        <button className="my-button" type="button" onClick={submitForm}>
          Add List
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddList;

