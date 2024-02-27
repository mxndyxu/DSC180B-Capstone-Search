/**
 * React component for displaying a list of projects.
 * Fetches project data from a JSON file and renders project details with links to individual project pages.
 * Projects are displayed in reverse order by year presented.
 */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// import SearchBar from '../components/SearchBar';
import '../styles/App.css';
import {es_data_json} from '../resources/es_data_json';

const Projects = () => {
  // State variable to hold project data
  const [data, setData] = useState(null);

  // Function to fetch project data from JSON file
  const fetchData = async () => {
    try {
      const es_data = es_data_json
      // const response = await fetch('./es_data_json.json');
      // if (!response.ok) {
      //   throw new Error('Failed to fetch data');
      // }
      // const es_data = await response.json();
      setData(es_data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
  };

  // Fetch project data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to reverse order of projects by year presented
  const reverseOrderByYearPresented = (projects) => {
    // Group projects by year_presented
    const groupedProjects = projects.reduce((acc, project) => {
      const yearPresented = project.year_presented;
      if (!acc[yearPresented]) {
        acc[yearPresented] = [];
      }
      acc[yearPresented].push(project);
      return acc;
    }, {});

    // Reverse the order of the groups based on year_presented
    const reversedGroups = Object.keys(groupedProjects).reverse().map(year => groupedProjects[year]);

    // Flatten the groups back into an array
    return reversedGroups.flat();
  };

  // Render projects
  return (
    <div className ="content-container">
      <h1 className="projects-text">Projects</h1>
      {/* <SearchBar id="proj-page-search-bar"/> */}
      <ul className="search-results">
        {/* Render project details */}
        {data &&
          reverseOrderByYearPresented(Object.values(data)).map(project => (
            <li key={project.project_id}>
              <ul className="search-results-specs">
                {/* Link to individual project page */}
                <NavLink
                  to={`/project/${project.project_id}`}
                  className="proj-link"
                >
                  {/* Project details */}
                  <li className="result-line-title"><strong>{project.project_title}</strong></li>
                </NavLink>
                <li className="result-line"><strong>Year: </strong>{String(Number(project.year_presented) - 1) + " - " + project.year_presented}</li>
                <li className="result-line"><strong>Student(s): </strong>{project.members.replaceAll(",", ", ")}</li>
                <li className="result-line"><strong>{project.ucsd_or_ind} Mentor(s): </strong>{project.mentors.replaceAll(",", ", ")}</li>
                <li className="result-line"><strong>Domain: </strong>{project.domain}</li>
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Projects;
