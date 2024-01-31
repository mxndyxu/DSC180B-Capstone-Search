// src/App.js
import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar'; // Import the SearchBar component
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle the search and update searchResults state
  const handleSearch = (searchTerm) => {
    // Implement your search logic here (e.g., filtering data)
    // For demonstration purposes, let's just update the state with the search term
    setSearchResults([searchTerm]);
  };

  return (
    <div className="App">
      <Header />
      <SearchBar onSearch={handleSearch} />
      <div>
        {/* Display search results */}
        {searchResults.map((result, index) => (
          <p key={index}>{result}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
