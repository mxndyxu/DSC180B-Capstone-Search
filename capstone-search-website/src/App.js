import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import About from './pages/About';
import SearchResults from './pages/SearchResults'
import './styles/App.css';

function App() {
  const [message, setMessage] = useState('');

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

  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/search/:searchTerm/*" element={<Layout><SearchResults /></Layout>} />
          <Route path="/search/*" element={<Layout><SearchResults /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;