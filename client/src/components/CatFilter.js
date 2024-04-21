// CatFilter.js
import React, { useState } from 'react';

const CatFilter = ({ cats, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    onFilterChange(event.target.value);
    console.log("Search term: ", event.target.value);
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search cats..." />
    </div>
  );
};

export default CatFilter;
