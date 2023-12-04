import React from 'react';
import DisplayPolicies from '../components/policies/DisplayPolicies';
import ReportReviews from '../components/policies/ReportReviews';

const PoliciesHome= () => {
    return (
        <div>
        <h1>Policies</h1>
        <DisplayPolicies />
        <ReportReviews />
        </div>
    )
}

export default PoliciesHome;