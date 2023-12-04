// import React, { useState, useEffect } from 'react';

// const DisplayReports = () => {
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     // Fetch reports from your API when the component mounts
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       const response = await fetch('/api/admin/allReports'); // Replace with your actual API endpoint
//       if (!response.ok) {
//         throw new Error('Failed to fetch reports');
//       }

//       const data = await response.json();
//       setReports(data);
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//     }
//   };

//   const fetchReviewById = async (reviewId) => {
//     try {
//       const response = await fetch(`/api/admin/getReviewById?reviewId=${reviewId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch review');
//       }

//       const reviewData = await response.json();
//       console.log('Fetched Review:', reviewData);
//       // Handle the fetched review data as needed
//     } catch (error) {
//       console.error('Error fetching review by ID:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Reports</h2>
//       {reports.map((report) => (
//         <div key={report._id}>
//           <p>Review ID: {report.reviewId}</p>
//           <p>Report Text: {report.reportText}</p>
//           <p>Report Type: {report.reportType}</p>
//           <p>Date: {new Date(report.date).toLocaleString()}</p>
//           <button onClick={() => fetchReviewById(report.reviewId)}>
//             Fetch Review
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DisplayReports;
import React, { useState, useEffect } from 'react';

const ReportComponent = () => {
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    // Fetch reports from your API when the component mounts
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/allReports'); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data);

      // Fetch and set reviews based on the reviewIds in reports
      const reviewIds = data.map((report) => report.reviewId);
      await fetchReviews(reviewIds);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchReviews = async (reviewIds) => {
    try {
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

      setReviews(reviewsMap);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      <div className='user-list-container'>
      {reports.map((report) => (
        <div key={report._id}>
          <p>Report Text: {report.reportText}</p>
          <p>Report Type: {report.reportType}</p>
          <p>Date: {new Date(report.date).toLocaleString()}</p>
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

export default ReportComponent;

