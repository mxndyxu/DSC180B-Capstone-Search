# DSC180B-Capstone-Search
Mandy Xu, William Hu
Mentor: Colin Jemmott

[Website Checkpoint](https://mxndyxu.github.io/DSC180B-Capstone-Search/)
<!-- Add link to actual search tool website -->

## Introduction
Our capstone project is to create a gallery for all of the other pre-existing capstones! We want to provide a website that can show off all prior DSC capstones and allow everyone whether it be students, mentors, DSC faculty, or anyone to browse the various cool projects that the DSC students have made. In regards to our own domain of Search our website revolves around creating an intuitive and easy search experience. Our project is to create a website with ReactJS frontend and a Python and ElasticSearch Backend.

We collected the various data from the past capstones and aggregated it into a dataset which is fed into an ElasticSearch instance. Users of the website will be able to search and add some filters to get a better search experience from the capstones.

## Github Repository Structure
The current Github Repository Structure as follows:

* Backend Folder: This is the backend of the project. Current consisting of main.py and search_engine.py. 
  * main.py: This is where the backend is run with a search_engine instance that utilizes ElasticSearch and searches throught        the query. Takes the requests from the frontend and returns the search results.
  * dummy_api.py: This is a "dummy" version of main.py that doesn't connect to the ElasticSearch and merely prints out hardcoded JSON responses to queries. It's used for FrontEnd Development.
  * search_engine.py: This is where the search_engine with ElasticSearch is made. It connects to an ElasticSearch cluster, loads in the data and returns the outputs.
* Frontend Folder (capstone-search-website): This is the ReactJS front end of the folder. It has the public folder where the images/json files are imported from to the src folder.
  *   public Folder: Where the images/JSON files are stored and read from to the front-end.
  *   src Folder:
    * Components Folder: Where the ReactJS components js files are stored.
    * Pages Folder: Where the pages like About.js & SearchResults.js are stored
    * Styles Folder: Where the CSS files are kept
* Data Folder: Where all of the data for the backend is stored. There are pickle objects and csv files.
  * Legacy Folder: This is where our earlier original data files are stored. They are no longer in use and are kept as legacy.
* Scripts Folder: This is where all of our earlier testing on Jupyter Notebooks are held. These are experimental files and are both no longer in use and very minimally commented. 

## Setup Instructions

### Backend Setup
If you want to run this project, you can run anaconda and clone the environment.yml file to get the code environment to run these files locally. 

If you have issues cloning the environment.yml file, you can also make a new anaconda environment and pip install the following:

* pip install pandas 

* pip install torch 

* pip install transformers[torch] 

* pip install fastapi 

* pip install uvicorn 

To setup the backend, you want to navigate to the directory with the main.py (backend folder) and run the following command:
uvicorn main:app --reload

### Front End Setup
You're going to make sure you have NodeJS installed, then after cloning the Github Repository, navigate to the capstone-search-website/ folder and type in the command:

npm install (This is will install the required dependencies)

Then, to run the project run:

npm start

### ElasticSearch Setup
You will need to have Docker Desktop installed and run the following command:

docker run --rm -p 9200:9200 -p 9300:9300 -e "xpack.security.enabled=false" -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.11.0

## Credit
We used the internet and a lot of various articles in our code. A huge thanks to:

* Colin for being a fantastic mentor and always providing great feedback and solutions!
* ChatGPT for being our guide to ReactJS
* https://www.freecodecamp.org/news/extract-data-from-pdf-files-with-python/
* https://dylancastillo.co/elasticsearch-python/#create-a-local-elasticsearch-cluster
* https://medium.com/muthoni-wanyoike/implementing-text-summarization-using-openais-gpt-3-api-dcd6be4f6933
* https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28#http-method
* https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
* https://www.geeksforgeeks.org/how-to-scrape-all-pdf-files-in-a-website/
* https://pypdf2.readthedocs.io/en/3.0.0/user/extract-images.html
* https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html
* https://github.com/elastic/elasticsearch-labs/blob/main/notebooks/search/03-ELSER.ipynb
* https://dev.to/am20dipi/how-to-build-a-simple-search-bar-in-javascript-4onf
* https://www.geeksforgeeks.org/how-to-create-a-multi-page-website-using-react-js/
* https://blog.openreplay.com/reacts-layout-components-concept/
* https://stackoverflow.com/questions/70054635/passing-props-with-navlink-in-react-router-dom-v6 




