import React, { useState, useEffect } from 'react';
import { auth } from '../../authentication';

const ReportReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reportTextMap, setReportTextMap] = useState({});
  const [reportTypeMap, setReportTypeMap] = useState({});

  useEffect(() => {
    // Fetch reviews from your API when the component mounts
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
        const user = auth.currentUser;
        const idToken = await user.getIdToken();
        const response = await fetch('/api/admin/allReviews', {
            headers: {
            'authorization': idToken,
            },
        });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data);

      // Initialize state variables for each review
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

  const handleReportSubmission = async (reviewId) => {
    try {
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

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      alert('Report submitted successfully!');
      // Optionally, you can refetch the reviews to update the UI
      fetchReviews();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    }
  };

  return (
    <div>
      <h2>Report Reviews</h2>
      <div className = "policy">
      {reviews.map((review) => (
        <div key={review.reviewId}>
          <p>{review.reviewText} -{review.user}</p>
          <select value={reportTypeMap[review.reviewId]} onChange={(e) => setReportTypeMap((prev) => ({ ...prev, [review.reviewId]: e.target.value }))}>
                <option value="Infringement Notice">Infringement Notice</option>
                <option value="Takedown Request">Takedown Request</option>
                <option value="Dispute Claim">Dispute Claim</option>
            </select>
          <textarea value={reportTextMap[review.reviewId]} onChange={(e) => setReportTextMap((prev) => ({ ...prev, [review.reviewId]: e.target.value }))} placeholder="Enter your report"/>
          <button onClick={() => handleReportSubmission(review.reviewId)}>
            Submit Report
          </button>
        </div>
      ))}
      </div>
    </div>
  );
};

export default ReportReviews;

