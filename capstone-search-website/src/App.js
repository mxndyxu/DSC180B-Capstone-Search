// src/App.js
import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const fetchSearchResult = (searchTerm) => {
    fetch(`http://localhost:8000/api/search?query=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  };

  return (
    <div className="App">
      <header className="App-header">
        <SearchBar onSearch={fetchSearchResult} />
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;

// function App() {
//   const [searchResults, setSearchResults] = useState([]);

//   // Function to handle the search and update searchResults state
//   const handleSearch = (searchTerm) => {
//     // Implement your search logic here (e.g., filtering data)
//     // For demonstration purposes, let's just update the state with the search term
//     setSearchResults([searchTerm]);
//   };

//   return (
//     <div className="App">
//       <Header />
//       <SearchBar onSearch={handleSearch} />
//       <div>
//         {/* Display search results */}
//         {searchResults.map((result, index) => (
//           <p key={index}>{result}</p>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
