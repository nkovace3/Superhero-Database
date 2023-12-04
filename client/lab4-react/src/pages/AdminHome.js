// Import necessary dependencies and components
import React from 'react';
import { auth } from '../authentication';
import '../components/css/AddList.css';
import { useNavigate } from "react-router-dom";
import AddAdmin from '../components/admin/AddAdmin';
import DisableUser from '../components/admin/DisableUser';
import FieldSearch from "../components/unauthuser/FieldSearch";
import AddList from "../components/authuser/AddList";
import ViewLists from "../components/authuser/ViewLists";
import AuthPublicLists from "../components/authuser/AuthPublicLists";
import ReviewManager from '../components/admin/ReviewManager';
import PolicyUpdate from '../components/admin/PolicyUpdate';
import DisplayReports from '../components/admin/DisplayReports';

// Define the functional component AdminHome
const AdminHome =() => {
    // Initialize the navigate function from react-router-dom
    const navigate = useNavigate();
    return (
        <>
        <div id = "sign-out">
                <p onClick={async() => {
                    try{
                        await auth.signOut();
                        alert("Sign out successful!");
                        navigate('../');
                    }catch (error) {
                        console.error("Error signing out: ", error.message);
                    }                    
                    }}>
                        Sign Out
                </p>
            </div>
            <h1>Welcome Admin!</h1>
            <h2>This is a website that allows you to view superhero information, view favorited lists of superheroes, and more!</h2>
            
            <AddAdmin />
            <DisableUser />
            <ReviewManager />
            <PolicyUpdate />
            <FieldSearch />
            <AddList />
            <ViewLists />
            <AuthPublicLists/>
            <DisplayReports />
            
            <h2>DMCA Notice and Takedown Policy Implementation Workflow Guide</h2>
            <div className = "policy">
            <p><strong>1. Overview:</strong></p>
            <p>
                The DMCA notice and takedown process are essential for addressing copyright infringement claims on our superhero database website. This document outlines the step-by-step workflow and usage of tools to ensure a smooth implementation of the DMCA policy.
            </p>

            <p><strong>2. Designated Agent:</strong></p>
            <ul>
                <li><strong>Appointment:</strong> A designated agent is appointed to receive and process DMCA notices.</li>
                <li><strong>Contact Information:</strong> The designated agent's contact details, including name, position, email, and address, are prominently displayed on the website.</li>
            </ul>

            <p><strong>3. User Education:</strong></p>
            <ul>
                <li><strong>Incorporate in Policies:</strong> Information about the DMCA policy is included in the website's terms of service and user guidelines.</li>
                <li><strong>Guidance:</strong> Clear guidance is provided to users on how to submit a DMCA notice, including the required elements.</li>
            </ul>

            <p><strong>4. DMCA Notice Submission:</strong></p>
            <ul>
                <li><strong>Submission Channels:</strong> Users submitting a DMCA notice can send it to the designated agent via email or mail.</li>
                <li><strong>Required Elements:</strong> DMCA notices must include a physical or electronic signature, identification of the copyrighted work, identification of the infringing material, contact information, a statement of good faith belief, and a statement of accuracy.</li>
            </ul>

            <p><strong>5. Initial Review:</strong></p>
            <ul>
                <li><strong>Upon Receipt:</strong> The designated agent conducts an initial review upon receiving a DMCA notice to ensure it includes all necessary information.</li>
                <li><strong>Acknowledgment:</strong> Acknowledge receipt of the DMCA notice to the sender.</li>
            </ul>

            <p><strong>6. Temporary Content Removal:</strong></p>
            <ul>
                <li><strong>Valid Notice:</strong> If the DMCA notice is valid and complete, temporarily remove or disable access to the allegedly infringing material to prevent further distribution.</li>
                <li><strong>User Notification:</strong> Notify the user who posted the material, providing a copy of the DMCA notice and instructions on how to respond.</li>
            </ul>

            <p><strong>7. User Response:</strong></p>
            <ul>
                <li><strong>Dispute Instructions:</strong> If the user disputes the claim, provide clear instructions on submitting a counter-notification.</li>
                <li><strong>Counter-Notification Elements:</strong> Inform users that the counter-notification should include contact information, identification of the removed material, a statement of good faith belief, a statement consenting to the jurisdiction of the federal court, and a physical or electronic signature.</li>
            </ul>

            <p><strong>8. Counter-Notification Review:</strong></p>
            <ul>
                <li><strong>Completeness Check:</strong> Review the counter-notification for completeness and accuracy.</li>
                <li><strong>Restoration:</strong> If the counter-notification is valid, restore the removed material after 14 days, provided the claimant does not take legal action.</li>
            </ul>

            <p><strong>9. Documentation:</strong></p>
            <ul>
                <li><strong>Record Keeping:</strong> Maintain detailed records of all DMCA notices received, actions taken, and correspondence with users.</li>
                <li><strong>Resolution Log:</strong> Document the resolution of each case, including the restoration of material or permanent removal.</li>
            </ul>

            <p><strong>10. Periodic Review:</strong></p>
            <ul>
                <li><strong>Policy Updates:</strong> Regularly review and update the DMCA notice and takedown policy.</li>
                <li><strong>Staff Training:</strong> Conduct training sessions for staff involved in the DMCA process to ensure compliance.</li>
            </ul>

            <p><strong>11. Legal Consultation:</strong></p>
            <ul>
                <li><strong>Stay Informed:</strong> Seek legal advice to stay informed about changes in DMCA laws and regulations.</li>
                <li><strong>Legal Counsel:</strong> Consult legal counsel in cases of uncertainty or potential legal disputes.</li>
            </ul>            
            </div>
            <div>
                <p onClick={() => navigate('../policies')}>Policies</p>
            </div>
        </>
    )
};

// Export the AdminHome component as the default export
export default AdminHome;
