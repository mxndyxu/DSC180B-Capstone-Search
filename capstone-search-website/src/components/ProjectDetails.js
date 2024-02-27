/**
 * React component for displaying project details.
 * Fetches project details either from location state or API based on the pathname.
 * Renders project title, overview, report summary, links, GitHub contributors, and language breakdown.
 */
import React, { useState, useEffect } from 'react';
import {useLocation, useParams, NavLink } from 'react-router-dom';
import {getProjectDetails, getProjectByID} from './helpers/projectDetailHelpers'

const ProjectDetails = () => {

    const location = useLocation();
    const [projectDetails, setProjectDetails] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                if (location.state !== null && location.state.projectDetails) {
                    // If project details are available in location state, use them directly
                    setProjectDetails(location.state.projectDetails);
                } else {
                    // If not available, fetch from API using the pathname
                    const fetchedProjectDetails = await getProjectByID(location.pathname);
                    setProjectDetails(fetchedProjectDetails);
                }
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchProjectDetails();
    }, [location.pathname, location.state]);

    // Check if project details are available
    if (!projectDetails) {
        return <h2 className="proj-title">'Loading project details...'</h2>;
    }

    // Function to check if the URL is valid
    const isValidUrl = (url) => url && url !== "null";

    // Turn GitHub contributors string to JSON object
    const validJsonString = projectDetails.github_contributors.replace(/'/g, '"');
    const github_contributors_json = JSON.parse(validJsonString)

    console.log(github_contributors_json)

    // Turn language breakdown string to JSON object
    const validJsonString2 = projectDetails.language_breakdown.replace(/'/g, '"')
    const language_breakdown_json = JSON.parse(validJsonString2)

    console.log(projectDetails);

    return (
        <div className="proj-details-container">
            <h2 className="proj-title">{projectDetails.proj_title}</h2>
            <h3 className="subheadings-text">Project Overview</h3>
            <div className="proj-body">
                <p><strong>Year: </strong>{String(Number(projectDetails.year) - 1) + " - " + projectDetails.year}</p>
                <p><strong>Member(s): </strong>{projectDetails.members}</p>
                <p><strong>Mentor(s): </strong>{projectDetails.mentors}</p>
                <p><strong>UCSD or Industry Led: </strong>{projectDetails.ucsd_or_ind}</p>
            </div>
            <h3 className="subheadings-text">Project Summary</h3>
            <div className="proj-body">
                <p>{projectDetails.summarized}</p>
            </div>
            <h3 className="subheadings-text">Links</h3>
            <div className="proj-body">
                {isValidUrl(projectDetails.website_url) && (
                    <p><a href={projectDetails.website_url} target="_blank">Website</a></p>
                )}
                {isValidUrl(projectDetails.report_url) && (
                    <p><a href={projectDetails.report_url} target="_blank">Report</a></p>
                )}
                {isValidUrl(projectDetails.github_url) && (
                    <p><a href={projectDetails.github_url} target="_blank">GitHub Repo</a></p>
                )}
                {isValidUrl(projectDetails.poster_url) && (
                    <p><a href={projectDetails.poster_url} target="_blank">Poster</a></p>
                )}
                <p><strong>Disclaimer: </strong>Some of these links may not work.</p>
            </div>
            <h3 className="subheadings-text">Additional GitHub Details</h3>
            <div className="proj-body">
                {github_contributors_json !== null ? (
                    <div>
                        <p>
                            <strong>GitHub Contributors: </strong>
                            {Object.entries(github_contributors_json).map(([name, link], index, array) => (
                                <span key={name}>
                                    <a href={link} target="_blank">{name}</a>
                                    {index !== array.length - 1 && ", "}
                                </span>
                            ))}
                        </p>
                    </div>
                ) : (
                    <p><strong>GitHub Contributors: </strong>Information unavailable.</p>
                )}
                <div>
                {language_breakdown_json !== null ? (
                    <div>
                        <p>
                            <strong>Language Breakdown: </strong>
                            {Object.entries(language_breakdown_json).map(([lang, prop], index, array) => (
                                <span key={lang}>
                                    {lang}: {Math.round(parseFloat(prop) * 100) + "%"}
                                    {index !== array.length - 1 && ", "}
                                </span>
                            ))}
                        </p>
                    </div>
                ) : (
                    <p><strong>Language Breakdown: </strong>Information unavailable.</p>
                )}
                <p>
                    <strong>Disclaimer: </strong>Some of these links may not work.<br />
                    The language breakdown may also not be accurate.
                </p>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
