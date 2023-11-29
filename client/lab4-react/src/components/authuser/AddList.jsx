import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../css/AddList.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../authentication';

const AddList = ({ isEditing, onCancelEdit, selectedList, onUpdate}) => {
  const privacyOptions = [
    { value: true, label: 'Public' },
    { value: false, label: 'Private' },
  ];
  
  const [formData, setFormData] = useState({
    list_name: '',
    privacy: false,
    ids: [],
    description: '',
  });

  // useEffect(() => {
  //   if (selectedList) {
  //     setFormData({
  //       list_name: selectedList.list_name,
  //       privacy: selectedList.privacy.toString(),
  //       ids: selectedList.ids.map((id) => ({ value: id, label: `ID ${id}` })),
  //       description: selectedList.description || '',
  //     });
  //   }
  // }, [selectedList]);

  useEffect(() => {
    if (selectedList) {
      let initialIds;
      console.log(typeof selectedList.ids);
      if(Array.isArray(selectedList.ids) && typeof selectedList.ids[0] === 'number') {
        initialIds = selectedList.ids.map((id) => ({ value: id, label: `ID ${id}` }));
      }else{
        initialIds = selectedList.ids;
      }
      console.log(initialIds);
      setFormData({
        list_name: selectedList.list_name,
        privacy: selectedList.privacy.toString(),
        ids: initialIds,
        description: selectedList.description || '',
      });
    }
  }, [selectedList]);

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

  // const handleIdsChange = (selectedOptions) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     ids: selectedOptions.map((option) => Number(option.value)),
  //   }));
  // };
  const handleIdsChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      ids: selectedOptions.map((option) => ({ value: option.value, label: `ID ${option.value}` })),
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
      console.log("Form data: ", formData);
      if (!selectedList) {
        const response = await fetch(`/api/listnum/${displayName}`);
        if (!response.ok) {
          alert("Too many lists added by user!");
          return;
        }
      }
        
      const user = auth.currentUser;
      const idToken = await user.getIdToken();

      if(isEditing){
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
        if (res.ok) {
          alert(`List updated successfully: ${formData.list_name}`);
          onUpdate();
          onCancelEdit();
          console.log("works");
        } else if (res.status === 400) {
          // Handle 400 Bad Request if needed
        }
      }else{
        // YOU HAVE TO SWITCH IT TO PUBLIC THEN PRIVATE FOR IT TO WORK WITHOUT THROWING AN ERROR, FIGURE THIS OUT
        console.log(formData.privacy.value);
        const res = await fetch('/api/lists/'+ formData.list_name, {
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
      const data = await res.json();
      if(res.ok){
        alert(`List ${selectedList ? 'updated' : 'added'} successfully: ${data.list_name}`);
      }else if (res.status === 400){
          
      }
      }

} catch (error) {
    console.log("Error fetching data", error);
    console.error("Error: " + error);
    alert("List name already exists!");
}
  
};

  const idOptions = Array.from({ length: 734}, (_, index) => ({
    value: index,
    label: `${index}`
  }));

  return (
    <div>
    <h2>{selectedList ? 'Edit List' : 'Add List'}</h2>
    <div className = "add-list-container">
      
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
          defaultValue = {privacyOptions[1]}
        />
  
        <label className="my-label" htmlFor="ids">Superhero IDs:</label>
        <Select
          className="my-dropdown"
          isMulti
          options = {idOptions}
          // value={formData.ids.map((id) => ({ value: id, label: `ID ${id}` }))}
          value = {formData.ids}
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
        {selectedList ? 'Save Changes' : 'Add List'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddList;