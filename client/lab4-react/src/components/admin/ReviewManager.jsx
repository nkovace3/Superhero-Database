// Import necessary modules and components from React and Firebase
import React, { useState, useEffect } from 'react';
import { auth } from '../../authentication';
import { onAuthStateChanged } from 'firebase/auth';

// Define the functional component ReviewManager
const ReviewManager = () => {
  // State variables for storing reviews and selected reviews to hide
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);

  // Function to fetch reviews from the server
  const fetchData = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Get the ID token of the current user
        const idToken = await user.getIdToken();
        
        // Fetch reviews from the server, including hidden status
        const response = await fetch('/api/admin/allReviews', {
          headers: {
            'authorization': idToken,
          },
        });

        // Parse the response and update the reviews state
        const data = await response.json();
        setReviews(data);

        // Set selectedReviews based on hidden status
        setSelectedReviews(data.filter(review => !review.hidden).map(review => review.reviewId));
      }
    } catch (error) {
      // Handle errors during the fetch operation
      console.error('Error fetching reviews:', error.message);
    }
  };

  // useEffect hook to fetch reviews when the component mounts and listen for authentication state changes
  useEffect(() => {
    fetchData();

    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, async () => {
      await fetchData();
    });

    // Cleanup function to unsubscribe from onAuthStateChanged
    return () => unsubscribe();
  }, []);

  // Event handler for checkbox changes to select/deselect reviews to hide
  const handleCheckboxChange = (reviewId) => {
    setSelectedReviews((prevSelectedReviews) => {
      const updatedSelectedReviews = prevSelectedReviews.includes(reviewId)
        ? prevSelectedReviews.filter((review) => review !== reviewId)
        : [...prevSelectedReviews, reviewId];

      return updatedSelectedReviews;
    });
  };

  // Event handler for hiding/showing selected reviews
  const handleToggleReviews = async () => {
    try {
      // Create an array of updated reviews based on checkbox state
      const updatedReviews = reviews.map((review) => ({
        ...review,
        hidden: !selectedReviews.includes(review.reviewId),
      }));

      // Update the visibility on the server
      await updateReviewsVisibility(updatedReviews);

      // Fetch updated review data after making changes
      await fetchData();
      alert("List visibility updated successfully!");
    } catch (error) {
      // Handle errors during the update operation
      console.error('Error updating reviews visibility:', error.message);
    }
  };

  // Function to send updated reviews to the server for visibility changes
  const updateReviewsVisibility = async (updatedReviews) => {
    try {
      // Get the current user and their ID token
      const user = auth.currentUser;
      const idToken = await user.getIdToken();

      // Send the updated reviews to the server
      const response = await fetch('/api/admin/toggleReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': idToken,
        },
        body: JSON.stringify({ updatedReviews }),
      });

      // Parse the response data
      const data = await response.json();

      // Check if the update operation was successful
      if (!data.success) {
        console.error('Failed to update review visibility. Check the console for details.');
      }
    } catch (error) {
      // Handle errors during the update operation
      console.error('Error updating reviews visibility:', error.message);
    }
  };

  // Render the component UI
  return (
    <div>
      <h2>Hide Reviews</h2>
      <div className="reviews-list">
        {/* Display a list of reviews with checkboxes for selection */}
        <ul>
          {reviews.map((review) => (
            <li key={review.reviewId}>
              <input
                type="checkbox"
                id={review.reviewId}
                checked={selectedReviews.includes(review.reviewId)}
                onChange={() => handleCheckboxChange(review.reviewId)}
              />
              <label htmlFor={review.reviewId}>{review.reviewText} - {review.user}</label>
            </li>
          ))}
        </ul>
        {/* Button to trigger hiding/showing selected reviews */}
        <button onClick={handleToggleReviews}>Save Changes</button>
      </div>
    </div>
  );
};

// Export the ReviewManager component as the default export
export default ReviewManager;
