import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
// import SearchBar from '../components/SearchBar';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState({});

  useEffect(() => {
    // Fetch search results from FastAPI backend
    fetch(`http://localhost:8000/api/search?query=${searchTerm}`)
      .then(response => response.json())
      .then(data => setSearchResults(data.message))  // Assuming results is a dictionary
      .catch(error => console.error('Error fetching search results:', error));
  }, [searchTerm]);

  return (
    <div>
      {/* <SearchBar className="results-search-bar"/> */}
      <h2 className="results-text">Search results for: {searchTerm}</h2>
      <ul className="search-results">
        {Object.keys(searchResults).map(key => (
            <li key={key}>
              <ul className="search-results-specs">
                <NavLink to={`/project${key}`} className="proj-link">
                  <li className="result-line-title"><strong>{searchResults[key].proj_title}</strong></li>
                  <li className="result-line"><strong>Year: </strong>{String(Number(searchResults[key].year) - 1) + " - " + searchResults[key].year}</li>
                  <li className="result-line"><strong>Student(s): </strong>{searchResults[key].members}</li>
                  <li className="result-line"><strong>{searchResults[key].ucsd_or_ind} Mentor(s): </strong>{searchResults[key].mentors}</li>
                </NavLink>
              </ul>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;


