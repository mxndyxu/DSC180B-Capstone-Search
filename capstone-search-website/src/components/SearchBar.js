import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all')
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm, selectedFilter);
    navigate(`/search/${searchTerm}`);
  };

  return (
    <div className="search-bar">
      <div className="input-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search" onClick={handleSearch}>Search</button>
      </div>
      <div className="filter">
        <label className="filters">Filters</label>
        <select value={selectedFilter} onChange={handleFilterChange}>
            <option default>Year</option>
            <option value="year1">2019-2020</option>
            <option value="year2">2020-2021</option>
            <option value="year3">2021-2022</option>
            <option value="year4">2022-2023</option>
        </select>
        <select value={selectedFilter} onChange={handleFilterChange}>
            <option default>Domain</option>
        </select>
        <select value={selectedFilter} onChange={handleFilterChange}>
            <option default>Mentors</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
