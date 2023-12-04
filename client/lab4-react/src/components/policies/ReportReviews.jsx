// Import necessary modules and styles
import React, { useState, useEffect } from 'react';
import { auth } from '../../authentication';

// Define the functional component ReportReviews
const ReportReviews = () => {
  // State variables to store reviews, report text, and report type for each review
  const [reviews, setReviews] = useState([]);
  const [reportTextMap, setReportTextMap] = useState({});
  const [reportTypeMap, setReportTypeMap] = useState({});

  // Effect hook to fetch reviews from the API when the component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  // Function to fetch reviews from the API
  const fetchReviews = async () => {
    try {
      // Get the current user and their ID token for authentication
      const user = auth.currentUser;
      const idToken = await user.getIdToken();

      // Fetch reviews from the '/api/admin/allReviews' endpoint
      const response = await fetch('/api/admin/allReviews', {
        headers: {
          'authorization': idToken,
        },
      });

      // Throw an error if the response is not okay
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      // Parse the response JSON and set the reviews state
      const data = await response.json();
      setReviews(data);

      // Initialize state variables for each review (reportTextMap and reportTypeMap)
      const initialReportTextMap = {};
      const initialReportTypeMap = {};
      data.forEach((review) => {
        initialReportTextMap[review.reviewId] = '';
        initialReportTypeMap[review.reviewId] = 'Infringement Notice';
      });
      setReportTextMap(initialReportTextMap);
      setReportTypeMap(initialReportTypeMap);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Function to handle report submission for a specific review
  const handleReportSubmission = async (reviewId) => {
    try {
      // Fetch the '/api/admin/reportSubmit' endpoint to submit the report
      const response = await fetch('/api/admin/reportSubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          reportText: reportTextMap[reviewId],
          reportType: reportTypeMap[reviewId],
        }),
      });

      // Throw an error if the response is not okay
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      // Display a success message and refetch reviews to update the UI
      alert('Report submitted successfully!');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting report:', error);
      // Display an error message if report submission fails
      alert('Failed to submit report');
    }
  };

  // Render the UI for reporting reviews
  return (
    <div>
      <h2>Report Reviews</h2>
      <div className="policy">
        {/* Map through each review and display report form for each */}
        {reviews.map((review) => (
          <div key={review.reviewId}>
            {/* Display review text and user information */}
            <p>{review.reviewText} - {review.user}</p>
            {/* Dropdown for selecting the report type */}
            <select value={reportTypeMap[review.reviewId]} onChange={(e) => setReportTypeMap((prev) => ({ ...prev, [review.reviewId]: e.target.value }))}>
              <option value="Infringement Notice">Infringement Notice</option>
              <option value="Takedown Request">Takedown Request</option>
              <option value="Dispute Claim">Dispute Claim</option>
            </select>
            {/* Textarea for entering the report text */}
            <textarea value={reportTextMap[review.reviewId]} onChange={(e) => setReportTextMap((prev) => ({ ...prev, [review.reviewId]: e.target.value }))} placeholder="Enter your report" />
            {/* Button to submit the report for the review */}
            <button onClick={() => handleReportSubmission(review.reviewId)}>
              Submit Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the ReportReviews component as the default export
export default ReportReviews;
