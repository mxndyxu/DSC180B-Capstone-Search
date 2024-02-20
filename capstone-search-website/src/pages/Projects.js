import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/App.css';

const Projects = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('./es_data_json.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const es_data = await response.json();
      setData(es_data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  

  return (
    <div>
      <h1 className="projects-text">Projects</h1>
      <ul className="search-results">
        {data &&
          reverseOrderByYearPresented(Object.values(data)).map(project => (
            <li key={project.project_id}>
              <ul className="search-results-specs">
                <NavLink
                  to={`/project/${project.project_id}`}
                  className="proj-link"
                >
                  <li className="result-line-title"><strong>{project.project_title}</strong></li>
                  <li className="result-line"><strong>Year: </strong>{String(Number(project.year_presented) - 1) + " - " + project.year_presented}</li>
                  <li className="result-line"><strong>Student(s): </strong>{project.members.replace(",", ", ")}</li>
                  <li className="result-line"><strong>{project.ucsd_or_ind} Mentor(s): </strong>{project.mentors.replace(",", ", ")}</li>
                  <li className="result-line"><strong>Domain: </strong>{project.domain}</li>
                </NavLink>
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Projects;
