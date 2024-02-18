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
    // const location = useLocation();
    // console.log("LOCATION", location)

    // // const [pathname, setPathname] = useState(#);

    // let projectDetails = null
    // if (location.state !== null){
    //     projectDetails = location.state.projectDetails;
    // } else {
    //     console.log("No location.state found")
    //     projectDetails = getProjectByID(location.pathname);
    // }
    
    // // else {
    // //     return (
    // //         <h2 className="proj-title">'404: project not retrieved'</h2>
    // //     )
    // // }
    // console.log(projectDetails)

    // useEffect(() => {
    //     console.log('in useEffect');
    //     if (location.state === null){
    //         console.log('useEffect preparing to fetch')
    //         // projectDetails = location.state.projectDetails;
    //     }
    // }, [location.pathname])
    

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
            <p>Members: {projectDetails.members}</p>
            <p>Mentors: {projectDetails.mentors}</p>
            <p>UCSD or Industry: {projectDetails.ucsd_or_ind}</p>
            <p>Year: {projectDetails.year}</p>
            <p>Report summary: {projectDetails.summarized}</p>
            {isValidUrl(projectDetails.github_url) && (
                <p><a href={projectDetails.github_url}>GitHub Repository</a></p>
            )}
            {isValidUrl(projectDetails.website_url) && (
                <p><a href={projectDetails.website_url}>Website</a></p>
            )}
            {isValidUrl(projectDetails.report_url) && (
                <p><a href={projectDetails.report_url}>Report</a></p>
            )}
            {isValidUrl(projectDetails.poster_url) && (
                <p><a href={projectDetails.poster_url}>Poster</a></p>
            )}
            {github_contributors_json !== null ? (
                <div>
                    <p>GitHub contributors:</p>
                    <ul>
                        {Object.entries(github_contributors_json).map(([name, link]) => (
                            <li key={name}>
                                <a href={link}>{name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>GitHub contributors: Information unavailable</p>
            )}
            <div>
            {language_breakdown_json !== null ? (
                <div>
                    <p>Language breakdown:</p>
                    <ul>
                        {Object.entries(language_breakdown_json).map(([lang, prop]) => (
                            <li key={lang}>
                                <p>{lang}: {Math.round(parseFloat(prop) * 100) + "%"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Language breakdown: Information unavailable</p>
            )}
            </div>
        </div>
    );
};

export default ProjectDetails;
