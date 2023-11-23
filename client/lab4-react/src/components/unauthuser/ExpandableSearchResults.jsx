import React, { useState } from 'react';
import '../css/UnauthFieldSearch.css';

const ExpandableSearchResults = ({title, content}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    };

    return (
        <li className={`expandable-item ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
        <div className="header">{title}</div>
        {isExpanded && <div className="content">{content}</div>}
      </li> 
    );
};

export default ExpandableSearchResults;