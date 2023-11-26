import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const DeleteList = ({ listName, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const auth = getAuth();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const idToken = await auth.currentUser.getIdToken();
      await axios.delete(`/api/lists/${listName}`, {
        headers: {
          Authorization: idToken,
        },
        data: {
          username: auth.currentUser.displayName,
        },
      });
      onDelete();
    } catch (error) {
      console.error(`Error deleting list ${listName}:`, error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <span
      style={{
        color: 'red',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      onClick={handleDelete}
    >
      {isDeleting ? 'Deleting...' : 'Delete List'}
    </span>
  );
};

export default DeleteList;