/**
 * React component for displaying search results.
 * Fetches search results from the backend API based on the search term and filters.
 * Renders search results with project details and provides links to individual project pages.
 */
import React, { useEffect, useState } from 'react';
import { useLocation, useParams, NavLink } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [queryParams, setQueryParams] = useState('');
  const { state } = useLocation();
  const { year, domain, mentor } = state || {};
  const [loading, setLoading] = useState(true); // State to track loading status
  
  useEffect(() => {

    console.log(year)
    console.log(domain)
    console.log(mentor)

    if (year || domain || mentor) {
      const appliedFilters = {};
      if (year) appliedFilters.year = year;
      if (domain) appliedFilters.domain = domain;
      if (mentor) appliedFilters.mentor = mentor;
      setFilters(appliedFilters);
    }

    let userInputFilters = []
    
    // console.log(filters)
    // Construct the API query based on the URL parameters
    let apiUrl = `http://localhost:8000/api/search?query=${searchTerm}`;

    // Add optional filters if they exist
    if (year) {
      apiUrl += `&year=${year}`;
      userInputFilters.push(`Year: ${String(Number(year) - 1) + " - " + year}`);
    }
    if (domain) {
      apiUrl += `&domain=${domain}`;
      userInputFilters.push(`Domain: ${domain}`);
    }
    if (mentor) {
      apiUrl += `&mentor=${mentor}`;
      userInputFilters.push(`Mentor: ${mentor}`);
    }

    setQueryParams(`${userInputFilters.join(', ')}`)

    // Fetch search results from your FastAPI backend
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
                setSearchResults(data.message);
                setLoading(false);
              })  // Assuming results is an array of strings
      .catch(error => {
        console.error('Error fetching search results:', error);
        setLoading(false)
      });

      // console.log(filters)
      console.log(searchTerm)

  }, [searchTerm, year, mentor, domain]);

  // console.log("searchResults", searchResults)

  // Convert the JSON object to an array of key-value pairs
  const resultsArray = Object.entries(searchResults);

  // Sort the array based on the "score" value in descending order
  resultsArray.sort(([, a], [, b]) => b.score - a.score);

  if (loading) {
    // Return a loading indicator instead of the "no results found" message while loading
    return (
      <div className='content-container'>
        <h2 className="search-results-text">Loading...</h2>
      </div>
    );
  }

  if (resultsArray.length === 0) {
    return (
      <div className='content-container no-search-results-container'>
        <h2 className="search-results-text">Oops...</h2>
        <h2 className="search-results-subtitle">We couldn’t find what you were searching for. Try adjusting your parameters.</h2>
        <SearchBar className="results-search-bar"/>
      </div>
    );
  }

  return (
    <div className='content-container search-results-container'>
      <div className='spacer'></div>
      <SearchBar className="results-search-bar"/>
      <div className='spacer'></div>
      <h2 className="search-results-text">
        Search results for...
        </h2>
      <h2 className="search-results-subtitle">
        {searchTerm ? "Query: " + searchTerm + `${year || domain || mentor ? `, ${queryParams}` : ''}`: `${year || domain || mentor ? `\n${queryParams}` : ''}`}
      </h2>
      <ul className="search-results">
        {resultsArray.map(([key, value]) => (
            <li key={key}>
              <ul className="search-results-specs">
                <NavLink
                  to={`/project/${key}`}
                  state={{
                    projectDetails: value
                  }}
                  className="proj-link">
                  <li className="result-line-title"><strong>{value.proj_title}</strong></li>
                </NavLink>
                <li className="result-line"><strong>ID: </strong>{key}</li>
                <li className="result-line"><strong>Year: </strong>{String(Number(value.year) - 1) + " - " + value.year}</li>
                <li className="result-line"><strong>Student(s): </strong>{value.members}</li>
                <li className="result-line"><strong>{value.ucsd_or_ind} Mentor(s): </strong>{value.mentors}</li>
                <li className="result-line"><strong>Domain: </strong>{value.domain}</li>
              </ul>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
