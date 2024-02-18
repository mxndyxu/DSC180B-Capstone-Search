function getProjectID(pathName){
    const id = pathName.slice(8)
    return Number(id)
}

async function getProjectByID(pathName){
    const id = getProjectID(pathName);
    const endpoint = `http://localhost:8000/api/project?id=${id}` ;
    console.log(endpoint);
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log("DATA", data);
        return data.message;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error; // Throw the error to be caught by the caller
    }
}
export async function getProjectDetails(location){
    console.log('in getProjectDetails');
    if (location && location.state != null){
        return location.state;
    } else {
        try {
            console.log("Get Project By ID", await getProjectByID(location.pathname));
            return await getProjectByID(location.pathname);
        } catch (error) {
            console.error('Error fetching project details:', error);
            return null; // Return null in case of error
        }
    }
}