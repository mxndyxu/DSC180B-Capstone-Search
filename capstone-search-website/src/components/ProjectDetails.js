import React from 'react';
import { useLocation } from 'react-router-dom';

const ProjectDetails = () => {
    const location = useLocation();
    const { projectDetails } = location.state;
    console.log(projectDetails)

  return (
    <div className="proj-details-container">
      <h2 className="proj-title">{projectDetails.proj_title}</h2>
      <p>Members: {projectDetails.members}</p>
      <p>Mentors: {projectDetails.mentors}</p>
      <p>UCSD or Industry: {projectDetails.ucsd_or_ind}</p>
      <p>Year: {projectDetails.year}</p>
      <a href={projectDetails.github_url}>GitHub Repository</a>
      <a href={projectDetails.website_url}>Website</a>
      <a href={projectDetails.report_url}>Report</a>
      <a href={projectDetails.poster_url}>Poster</a>
      <p>GitHub contributors: {projectDetails.github_contributors}</p>
      <p>Language breakdown: {projectDetails.language_breakdown}</p>
    </div>
  );
};

export default ProjectDetails;
