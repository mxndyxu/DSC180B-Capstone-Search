import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import About from './pages/About';
import Projects from './pages/Projects';
import SearchResults from './pages/SearchResults'
import ProjectDetails from './components/ProjectDetails';
import './styles/App.css';

function App() {
  const [message, setMessage] = useState('');
  const [uniqueIds, setUniqueIds] = useState([]);

  const fetchSearchResult = (searchTerm, selectedFilters) => {
    
    let url = `http://localhost:8000/api/search?query=${searchTerm}`;

    if (selectedFilters.year) {
      url += `&year=${selectedFilters.year}`;
    }

    if (selectedFilters.domain) {
      url += `&domain=${selectedFilters.domain}`;
    }

    if (selectedFilters.mentor) {
      url += `&mentor=${selectedFilters.mentor}`;
    }

    console.log(searchTerm)
    console.log(selectedFilters)
    fetch(url)
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  };

  const Home = () => (
    <div>
      <Header />
      <header className="App-header">
        <SearchBar onSearch={fetchSearchResult} className="home-search-bar"/>
      </header>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./es_data_json.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const es_data = await response.json();


        const proj_ids = [];
        es_data.forEach(item => {
          if (!proj_ids.includes(item.project_id)) {
            proj_ids.push(item.project_id);
          } 

        });
        setUniqueIds(proj_ids);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  // console.log(uniqueIds);

  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/search/:searchTerm/*" element={<Layout><SearchResults /></Layout>} />
          {uniqueIds.map((id) => {
            return <Route path={`/:project${id}`} element={<Layout><ProjectDetails /></Layout>}/>
          })}
          <Route path="/search/*" element={<Layout><SearchResults /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;