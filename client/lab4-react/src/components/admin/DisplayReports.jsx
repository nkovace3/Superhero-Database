// Import necessary modules and components from React
import React, { useState, useEffect } from 'react';

// Define the functional component ReportComponent
const ReportComponent = () => {
  // State variables for storing reports and associated reviews
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState({});

  // useEffect hook to fetch reports when the component mounts
  useEffect(() => {
    // Fetch reports from the server
    fetchReports();
  }, []);

  // Function to fetch reports from the server
  const fetchReports = async () => {
    try {
      // Fetch reports from the API endpoint
      const response = await fetch('/api/admin/allReports');
      
      // Check if the fetch operation was successful
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      // Parse the response and update the reports state
      const data = await response.json();
      setReports(data);

      // Fetch and set reviews based on the reviewIds in reports
      const reviewIds = data.map((report) => report.reviewId);
      await fetchReviews(reviewIds);
    } catch (error) {
      // Handle errors during the fetch operation
      console.error('Error fetching reports:', error);
    }
  };

  // Function to fetch reviews based on reviewIds
  const fetchReviews = async (reviewIds) => {
    try {
      // Fetch reviews for each reviewId using Promise.all
      const reviewsData = await Promise.all(
        reviewIds.map(async (reviewId) => {
          const response = await fetch(`/api/admin/getReviewById?reviewId=${reviewId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch review');
          }
          return response.json();
        })
      );

      // Create a map of reviewId to review data
      const reviewsMap = {};
      reviewIds.forEach((reviewId, index) => {
        reviewsMap[reviewId] = reviewsData[index];
      });

      // Update the reviews state with the fetched data
      setReviews(reviewsMap);
    } catch (error) {
      // Handle errors during the fetch operation
      console.error('Error fetching reviews:', error);
    }
  };

  // Render the component UI
  return (
    <div>
      <h2>Reports</h2>
      <div className='user-list-container'>
        {/* Display each report and its associated review information */}
        {reports.map((report) => (
          <div key={report._id}>
            <p>Report Text: {report.reportText}</p>
            <p>Report Type: {report.reportType}</p>
            <p>Date: {new Date(report.date).toLocaleString()}</p>
            {/* Display review contents if available */}
            {reviews[report.reviewId] && (
              <div>
                <p>Review Contents: {reviews[report.reviewId].review}</p>
                <p>Username: {reviews[report.reviewId].username}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the ReportComponent component as the default export
export default ReportComponent;
