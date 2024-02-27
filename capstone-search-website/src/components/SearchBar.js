/**
 * React component for a search bar.
 * Allows users to search for capstone projects based on various filters.
 * Provides search input field, filter options for year, domain, and mentor,
 * and handles navigation to search results page.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

// SearchBar component
const SearchBar = ({ onSearch }) => {
  // State variables for search term, selected filters, unique filter options, and popup visibility
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueDomains, setUniqueDomains] = useState([]);
  const [uniqueMentors, setUniqueMentors] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  // Fetch unique filter options on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch JSON data
        const response = await fetch('./es_data_json.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const es_data = await response.json();

        // Extract unique years, domains, and mentors from the data
        const years = [];
        const domains = [];
        const mentors = [];
        es_data.forEach(item => {
          if (!years.includes(item.year_presented)) {
            years.push(item.year_presented);
          }

          if (!domains.includes(item.domain)) {
            domains.push(item.domain);
          }

          const mentorsArray = item.mentors.split(',');
          for (let i = 0; i < mentorsArray.length; i++) {
            if (!mentors.includes(mentorsArray[i]) && mentorsArray[i] !== 'Not Specified') {
              mentors.push(mentorsArray[i]);
            }
          }

          const industriesArray = item.industry.split(',');
          for (let i=0; i<industriesArray.length; i++) {
            if (!mentors.includes(industriesArray[i])) {
              mentors.push(industriesArray[i]);
            }
          }
        });

        // Update state with unique years, domains, and mentors
        setUniqueYears(years);
        setUniqueDomains(domains);
        setUniqueMentors(mentors);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Event handlers for filter selection and search term input
  const handleYearChange = event => {
    setSelectedYear(event.target.value);
  };

  const handleDomainChange = event => {
    setSelectedDomain(event.target.value);
  };

  const handleMentorChange = event => {
    setSelectedMentor(event.target.value);
  };

  const handleInputChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value);
  };

  // Handle key press events (e.g., pressing Enter to search)
  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Perform search based on selected filters and search term
  const handleSearch = () => {
    if (!searchTerm && !selectedYear && !selectedDomain && !selectedMentor) {
      // If no search term and no filters selected, show popup
      setShowPopup(true);
      return;
    }

    // Construct URL based on selected filters and search term
    let url = '/search';
    if (searchTerm) {
      url += `/${searchTerm}`;
    } else if (selectedYear || selectedDomain || selectedMentor) {
      url += '/';
    }

    if (selectedYear) {
      url += `/year/${selectedYear}`;
    }

    if (selectedDomain) {
      url += `/domain/${selectedDomain}`;
    }

    if (selectedMentor) {
      url += `/mentor/${selectedMentor}`;
    }

    // Navigate to search results page with selected filters
    navigate(url, {
      state: {
        year: selectedYear,
        domain: selectedDomain,
        mentor: selectedMentor
      }
    });
  };

  // Render search bar component
  return (
    
    <div className="search-bar content-container">
      {/* {console.log("DMY",uniqueDomains, uniqueMentors, uniqueYears)} */}
      {/* Popup message for empty search term and filters */}
      {showPopup && (
        <div className="popup">
          <button className="popup-close" onClick={() => setShowPopup(false)}>x</button>
          <p className="popup-text">Please enter at least a query or filter.</p>
        </div>
      )}
      {/* Search input field */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Search for capstone..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
        />
        {/* Search button */}
        <button className="search" onClick={handleSearch}>
          Search
        </button>
      </div>
      {/* Filter options */}
      <div className="filter">
        <label className="filters">Filters</label>
        {/* Year filter dropdown */}
        <select value={selectedYear} onChange={handleYearChange} onKeyUp={handleKeyPress}>
          <option value="">Years</option>
          {uniqueYears.map((year, index) => (
            <option key={index} value={year}>{String(Number(year) - 1) + " - " + year}</option>
          ))}
        </select>
        {/* Domain filter dropdown */}
        <select value={selectedDomain} onChange={handleDomainChange} onKeyUp={handleKeyPress}>
          <option value="">Domains</option>
          {uniqueDomains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        {/* Mentor filter dropdown */}
        <select value={selectedMentor} onChange={handleMentorChange} onKeyUp={handleKeyPress}>
          <option value="">Mentors</option>
          {uniqueMentors.map((mentor, index) => (
            <option key={index} value={mentor}>
              {mentor}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  );
};

// Export SearchBar component
export default SearchBar;

