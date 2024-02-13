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
    </div>
  );
};

export default ProjectDetails;
