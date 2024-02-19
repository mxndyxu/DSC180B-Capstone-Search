// Function to extract project ID from pathname
function getProjectID(pathName) {
    // Extract the project ID part from the pathname (assuming it's at index 9 onwards)
    // Convert the extracted ID to a number and return it
    const id = pathName.slice(9);
    return Number(id);
}

// Function to fetch project data by ID
export async function getProjectByID(pathName) {
    // Get the project ID from the path name using the helper function
    const id = getProjectID(pathName);
    // Construct the API endpoint using the project ID
    const endpoint = `http://localhost:8000/api/project?id=${id}`;
    // Log the constructed endpoint for debugging
    console.log(endpoint);
    try {
        // Fetch data from the constructed endpoint
        // Parse the response data as JSON
        const response = await fetch(endpoint);
        const data = await response.json();

        console.log("DATA", data);
        
        return data.message;
    } catch (error) {
        // Log and rethrow any errors that occur during fetching
        console.error('Error fetching search results:', error);
        throw error;
    }
}

// Function to get project details
export async function getProjectDetails(location) {
    console.log('in getProjectDetails');
    // Check if location is provided and contains state
    if (location && location.state != null) {
        // If location state is available, return it
        return location.state;
    } else {
        try {
            // If location state is not available, fetch project data by ID
            console.log("Get Project By ID", await getProjectByID(location.pathname));
            return await getProjectByID(location.pathname);
        } catch (error) {
            console.error('Error fetching project details:', error);
            return null;
        }
    }
}
