import React, { useEffect, useState } from 'react';
import { useLocation, useParams, NavLink } from 'react-router-dom';
// import SearchBar from '../components/SearchBar';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [queryParams, setQueryParams] = useState('');
  const { state } = useLocation();
  const { year, domain, mentor } = state || {};

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
      userInputFilters.push(`year: ${year}`);
    }
    if (domain) {
      apiUrl += `&domain=${domain}`;
      userInputFilters.push(`domain: ${domain}`);
    }
    if (mentor) {
      apiUrl += `&mentor=${mentor}`;
      userInputFilters.push(`mentor: ${mentor}`);
    }

    setQueryParams(`${userInputFilters.join(', ')}`)

    // Fetch search results from your FastAPI backend
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setSearchResults(data.message))  // Assuming results is an array of strings
      .catch(error => console.error('Error fetching search results:', error));

      // console.log(filters)
      console.log(searchTerm)

      


  }, [searchTerm, year, mentor, domain]);

  // console.log("searchResults", searchResults)

  // Convert the JSON object to an array of key-value pairs
  const resultsArray = Object.entries(searchResults);

  // Sort the array based on the "score" value in descending order
  resultsArray.sort(([, a], [, b]) => b.score - a.score);

  // console.log("resultsArray", resultsArray)

//   resultsArray.map(([key, value]) => (
//     console.log("key", key, "value", value)
//  ))


  return (
    <div className='content-container search-results-container'>
      {/* <SearchBar className="results-search-bar"/> */}
      <div className='spacer'></div>
      <h2 className="search-results-text">
        Search results for:
        </h2>
      <h3 className="search-results-subtitle">
        {searchTerm ? "Query: " + searchTerm + `${year || domain || mentor ? `, ${queryParams}` : ''}`: `${year || domain || mentor ? `\n${queryParams}` : ''}`}
      </h3>
      <ul className="search-results">
        {resultsArray.map(([key, value]) => (
            <li key={key}>
              <ul className="search-results-specs">
                <NavLink
                  to={`/project/${key}`}
                  state={{
                    projectDetails: value
                  }}
                  className="proj-link"
                >
                  <li className="result-line-title"><strong>{value.proj_title}</strong></li>
                  <li className="result-line"><strong>ID: </strong>{key}</li>
                  <li className="result-line"><strong>Year: </strong>{String(Number(value.year) - 1) + " - " + value.year}</li>
                  <li className="result-line"><strong>Student(s): </strong>{value.members}</li>
                  <li className="result-line"><strong>{value.ucsd_or_ind} Mentor(s): </strong>{value.mentors}</li>
                  <li className="result-line"><strong>Domain: </strong>{value.domain}</li>
                </NavLink>
              </ul>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
