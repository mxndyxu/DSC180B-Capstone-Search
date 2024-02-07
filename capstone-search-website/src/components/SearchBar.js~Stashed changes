import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
// import es_data from './es_data_json.json'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all')
  const navigate = useNavigate();
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueDomains, setUniqueDomains] = useState([]);
  const [uniqueMentors, setUniqueMentors] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  

  useEffect(() => {
    // Fetch JSON data or import it directly
    // For example, if data.json is in the public folder:
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

          if (!domains.includes(item.domain)){
            domains.push(item.domain)
          }

          const mentorsArray = item.mentors.split(',');
          // console.log(mentorsArray)

          for (let i = 0; i < mentorsArray.length; i++) {
            if (!mentors.includes(mentorsArray[i])){
              mentors.push(mentorsArray[i])
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

  const handleYearChange = (event) => {
    const selectedValue = event.target.value;
    console.log('Selected Year:', selectedValue);
    setSelectedYear(event.target.value);
  };

  const handleDomainChange = (event) => {
    const selectedValue = event.target.value;
    console.log('Selected Domain:', selectedValue);
    setSelectedDomain(event.target.value);
  };

  const handleMentorChange = (event) => {
    const selectedValue = event.target.value;
    console.log('Selected Mentor:', selectedValue);
    setSelectedMentor(event.target.value);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleSearch = () => {
    // Constructing URL based on search term and selected filters
    let url = `/search/${searchTerm}`;

    if (selectedYear) {
      url += `/year/${selectedYear}`;
    }

    if (selectedDomain) {
      url += `/domain/${selectedDomain}`;
    }

    if (selectedMentor) {
      url += `/mentor/${selectedMentor}`;
    }

    console.log(url)
    navigate(url, { //THIS ONE
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
        />
        <button className="search" onClick={handleSearch}>Search</button>
      </div>
      <div className="filter">
        <label className="filters">Filters</label>
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="">All Years</option>
          {uniqueYears.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
        <select value={selectedDomain} onChange={handleDomainChange}>
          <option value="">All Domains</option>
          {uniqueDomains.map((domain, index) => (
            <option key={index} value={domain}>{domain}</option>
          ))}
        </select>
        <select value={selectedMentor} onChange={handleMentorChange}>
          <option value="">All Mentors</option>
          {uniqueMentors.map((mentor, index) => (
            <option key={index} value={mentor}>{mentor}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;