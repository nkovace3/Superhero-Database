// Import React library for creating React components
import React from 'react';

// Import DisplayPolicies and ReportReviews components
import DisplayPolicies from '../components/policies/DisplayPolicies';
import ReportReviews from '../components/policies/ReportReviews';

// Define the functional component PoliciesHome
const PoliciesHome= () => {
    // Render the UI for the PoliciesHome component
    return (
        <div>
            {/* Main heading */}
            <h1>Policies</h1>
            
            {/* DisplayPolicies component for showing security and privacy, DMCA, and AUP policies */}
            <DisplayPolicies />

            {/* ReportReviews component for handling the reporting of reviews based on policies */}
            <ReportReviews />
        </div>
    );
}

// Export the PoliciesHome component as the default export
export default PoliciesHome;
