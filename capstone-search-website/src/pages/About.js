import React from 'react';
import '../styles/App.css';

const About = () => (
  <div className="about-container">
    {/* <h1 className="about-text">About</h1> */}
    <div className="about-body">
        <h2>Welcome to Capsonian!</h2>
        <p>This is the 4th Year Data Science Capstone created by Mandy Xu and William Hu. Our domain is Search and our capstone is Colin Jemmott.
        This is a website that can show off all prior DSC capstones and allow everyone whether it be students, mentors, DSC faculty, or anyone to browse the various cool projects that the DSC students have made. In regards to our own domain of Search our website revolves around creating an intuitive and easy search experience. Our project is to create a website with ReactJS frontend and a Python and ElasticSearch Backend.
        We collected the various data from the past capstones and aggregated it into a dataset which is fed into an ElasticSearch instance. Users of the website will be able to search and add some filters to get a better search experience from the capstones.
        </p>

        <h2>Features</h2>
        <p>Search through all the past 4 years of UCSD Capstone Data! There's filters for Year, Domain and Mentor to help narrow your search. Every project has a dedicated page with 
          more detailed information (if it's available). See all 211 projects on the Project page.
        </p>

        <h2>Links</h2>
        <p>Link to our repo: <a href="https://github.com/mxndyxu/DSC180B-Capstone-Search"> Github Repository </a></p>
        <p>Link to our project: </p>
        <p>Link to our poster: </p>

        <div id='about_page_people'>

          <div>
            <h3>Mandy Xu</h3>
            <a href="https://www.linkedin.com/in/mandyxuu/"> LinkedIN </a>
            <p/>
            <a href="https://github.com/mxndyxu"> Github </a>
            <p>Email: gb.mandy.xu@gmail.com</p>
          </div>

          <div>
            <h3>William Hu</h3>
            <a href="https://www.linkedin.com/in/william-hu-a24638220/"> LinkedIN </a>
            <p/>
            <a href="https://github.com/whu769"> Github </a>
            <p>Email: williamyhu30@gmail.com</p>
          </div>

          <div>
            <h3>Colin Jemmot</h3>
            <a href="https://www.linkedin.com/in/cjemmott/"> LinkedIN </a>
            <p/>
            <a href="https://github.com/jemmott"> Github </a>
            <p>Email: cjemmott@gmail.com</p>
          </div>
        </div>

        <h2>Feedback</h2>
        <p>If you have any feedback please fill out this form! We'd love to hear your thoughts and want to improve the site!</p>
        {/* Add link to google form there */}
        <a href='https://forms.gle/aAsSdFRCyuTC93b1A'> 
          Link to Feedback
        </a>

    </div>
  </div>
);

export default About;