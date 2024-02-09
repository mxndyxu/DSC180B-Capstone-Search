# DSC180B-Capstone-Search
Mandy Xu, William Hu
Mentor: Colin Jemmott

## Introduction
Our capstone project is to create a gallery for all of the other pre-existing capstones! We want to provide a website that can show off all prior DSC capstones and allow everyone whether it be students, mentors, DSC faculty, or anyone to browse the various cool projects that the DSC students have made. In regards to our own domain of Search our website revolves around creating an intuitive and easy search experience. Our project is to create a website with ReactJS frontend and a Python and ElasticSearch Backend.

We collected the various data from the past capstones and aggregated it into a dataset which is fed into an ElasticSearch instance. Users of the website will be able to search and add some filters to get a better search experience from the capstones.

## Github Repository Structure
The current Github Repository Structure as follows:

* Backend Folder: This is the backend of the project. Current consisting of main.py and search_engine.py. 
  * main.py: This is where the backend is run with a search_engine instance that utilizes ElasticSearch and searches throught        the query. Takes the requests from the frontend and returns the search results.
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

### Front End Setup

### ElasticSearch Setup





