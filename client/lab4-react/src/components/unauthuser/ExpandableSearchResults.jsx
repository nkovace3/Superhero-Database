// Import necessary modules and styles
import React, { useState } from 'react';
import '../css/UnauthFieldSearch.css';

// Define the functional component ExpandableSearchResults
const ExpandableSearchResults = ({ title, content }) => {
  // State variable to track whether the content is expanded or not
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the expanded state when the item is clicked
  const toggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  // Function to handle click events on the content to prevent collapsing when clicked
  const handleContentClick = (e) => {
    e.stopPropagation(); // Prevent the click event from reaching the parent div
  };

  // Render the UI for the expandable search result item
  return (
    <div className={`expandable-item ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      <div className="header">{title}</div>
      {/* Render content if the item is expanded */}
      {isExpanded && <div className="content" onClick={handleContentClick}>{content}</div>}
    </div>
  );
};

// Export the ExpandableSearchResults component as the default export
export default ExpandableSearchResults;
