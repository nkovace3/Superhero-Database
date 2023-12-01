import React, { useState, useEffect } from 'react';
import { auth } from '../../authentication';
import { onAuthStateChanged } from 'firebase/auth';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/allReviews', {
          headers: {
            'authorization': idToken,
          },
        });

        const data = await response.json();
        setReviews(data);

        // Set selectedReviews based on hidden status
        setSelectedReviews(data.filter(review => !review.hidden).map(review => review.reviewId));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, async () => {
      await fetchData();
    });

    // Cleanup function to unsubscribe from onAuthStateChanged
    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = (reviewId) => {
    setSelectedReviews((prevSelectedReviews) => {
      const updatedSelectedReviews = prevSelectedReviews.includes(reviewId)
        ? prevSelectedReviews.filter((review) => review !== reviewId)
        : [...prevSelectedReviews, reviewId];

      return updatedSelectedReviews;
    });
  };

  const handleToggleReviews = async () => {
    try {
      // Create an array of selected reviews based on checkbox state
      const updatedReviews = reviews.map((review) => ({
        ...review,
        hidden: !selectedReviews.includes(review.reviewId),
      }));

      // Update the visibility on the server
      await updateReviewsVisibility(updatedReviews);

      // Fetch updated review data after making changes
      await fetchData();
    } catch (error) {
      console.error('Error updating reviews visibility:', error.message);
    }
  };

  const updateReviewsVisibility = async (updatedReviews) => {
    try {
      // Send the updated reviews to the server
      const user = auth.currentUser;
      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/toggleReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': idToken,
        },
        body: JSON.stringify({ updatedReviews }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Failed to update review visibility. Check the console for details.');
      }
    } catch (error) {
      console.error('Error updating reviews visibility:', error.message);
    }
  };

  return (
    <div>
      <h2>Hide Reviews</h2>
      <div className="reviews-list">
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
        <button onClick={handleToggleReviews}>Save Changes</button>
      </div>
    </div>
  );
};

export default ReviewManager;

