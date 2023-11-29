import React, { useState } from 'react';
import '../css/UnauthFieldSearch.css';

const ExpandableSearchResults = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`expandable-item ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      <div className="header">{title}</div>
      {isExpanded && <div className="content" onClick={handleContentClick}>{content}</div>}
    </div>
  );
};

export default ExpandableSearchResults;
