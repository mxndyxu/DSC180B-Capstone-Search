import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const SearchBar = ({ onSearch }) => {
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

  useEffect(() => {
    // Fetch JSON data or import it directly
    const fetchData = async () => {
      try {
        const response = await fetch('./es_data_json.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const es_data = await response.json();

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
            if (!mentors.includes(mentorsArray[i])) {
              mentors.push(mentorsArray[i]);
            }
          }
        });
        setUniqueYears(years);
        setUniqueDomains(domains);
        setUniqueMentors(mentors);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // console.log(es_data)
    fetchData();
  }, []);

  const handleYearChange = event => {
    const selectedValue = event.target.value;
    setSelectedYear(event.target.value);
  };

  const handleDomainChange = event => {
    const selectedValue = event.target.value;
    setSelectedDomain(event.target.value);
  };

  const handleMentorChange = event => {
    const selectedValue = event.target.value;
    setSelectedMentor(event.target.value);
  };

  const handleInputChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value);
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
        handleSearch();
    }
  };

  const handleSearch = () => {
    if (!searchTerm && !selectedYear && !selectedDomain && !selectedMentor) {
      // If no search term and no filters selected, show popup
      setShowPopup(true);
      return;
    }

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

    navigate(url, {
      state: {
        year: selectedYear,
        domain: selectedDomain,
        mentor: selectedMentor
      }
    });
  };

  return (
    <div className="search-bar">
      <div className="input-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
        />
        <button className="search" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="filter">
        <label className="filters">Filters</label>
        <select value={selectedYear} onChange={handleYearChange} onKeyUp={handleKeyPress}>
          <option value="">Years</option>
          {uniqueYears.map((year, index) => (
            <option key={index} value={year}>{String(Number(year) - 1) + " - " + year}</option>
          ))}
        </select>
        <select value={selectedDomain} onChange={handleDomainChange} onKeyUp={handleKeyPress}>
          <option value="">Domains</option>
          {uniqueDomains.map((domain, index) => (
            <option key={index} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        <select value={selectedMentor} onChange={handleMentorChange} onKeyUp={handleKeyPress}>
          <option value="">Mentors</option>
          {uniqueMentors.map((mentor, index) => (
            <option key={index} value={mentor}>
              {mentor}
            </option>
          ))}
        </select>
      </div>
      {showPopup && (
        <div className="popup">
          <button className="popup-close" onClick={() => setShowPopup(false)}>x</button>
          <p className="popup-text">Please enter at least one of the search term or filters.</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
