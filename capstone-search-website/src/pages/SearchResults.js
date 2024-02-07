import React, { useEffect, useState } from 'react';
import { useLocation, useParams, NavLink } from 'react-router-dom';
// import SearchBar from '../components/SearchBar';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({});
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
    
    // console.log(filters)
    // Construct the API query based on the URL parameters
    let apiUrl = `http://localhost:8000/api/search?query=${searchTerm}`;

    // Add optional filters if they exist
    if (year) {
      apiUrl += `&year=${year}`;
    }
    if (domain) {
      apiUrl += `&domain=${domain}`;
    }
    if (mentor) {
      apiUrl += `&mentor=${mentor}`;
    }

    // Fetch search results from your FastAPI backend
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setSearchResults(data.message))  // Assuming results is an array of strings
      .catch(error => console.error('Error fetching search results:', error));

      // console.log(filters)
      console.log(searchTerm)
      
  }, [searchTerm, year, mentor, domain]);

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


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const SearchResults = () => {
//   const { searchTerm } = useParams();
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     // Fetch search results from your FastAPI backend
//     // Replace 'http://localhost:8000' with your actual backend URL
//     fetch(`http://localhost:8000/api/search?query=${searchTerm}`)
//       .then(response => response.json())
//       .then(data => setSearchResults(data.message))  // Assuming results is an array of strings
//       .catch(error => console.error('Error fetching search results:', error));

//       // console.log(searchTerm)
//   }, [searchTerm]);

//   return (
//     <div>
//       <h2>Search results for: {searchTerm}</h2>
//       <ul>
//         {searchResults.map((result, index) => (
//           <li key={index}>{result}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchResults;

