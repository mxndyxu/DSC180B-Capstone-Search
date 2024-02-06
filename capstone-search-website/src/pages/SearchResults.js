import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch search results from your FastAPI backend
    // Replace 'http://localhost:8000' with your actual backend URL
    fetch(`http://localhost:8000/api/search?query=${searchTerm}`)
      .then(response => response.json())
      .then(data => setSearchResults(data.message))  // Assuming results is an array of strings
      .catch(error => console.error('Error fetching search results:', error));
  }, [searchTerm]);

  return (
    <div>
      <h2>Search results for: {searchTerm}</h2>
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;


