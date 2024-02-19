"""
dummy_api.py

The script to run on command line as a mock api
Has set responses to test the Front-End
"""
from typing import Union, Optional
import search_engine 
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

#Creating a FastAPI app instance
app = FastAPI()

# Create the elastic search engine instance
# es_instance = search_engine.search_engine("http://localhost:9200", "capstones")

# uvicorn dummy_api:app --reload 

#The two routes.
origins = [
    "http://localhost:8000",  # FastAPI Port (I Think)
    "http://localhost:3000",  # React app port
]

# Got from FastAPI Tutorial
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test route hello
@app.get("/api/hello")
def read_root():
    return {"message": "Hello World"}

# Route for search
@app.get("/api/search")
def search(query: Optional[str] = None, year: Optional[str] = None, domain: Optional[str] = None, mentor: Optional[str] = None):
    """
    Function that searches with the elastic search instance.
    Returns set response as its for testing.

    Parameters
    ----------
    query : str
        The query of the search. It is optional
    year : str
        The year filter of the search. It is optional
    domain : str
        The domain filter of the search. It is optional
    mentor : str
        The mentor filter of the search. It is optional
    """

    return {
        "message": {
                "50": {
                    "proj_title": "ForumRec - A Question Recommender for the Super User Community",
                    "year": 2021,
                    "members": "Jack Lin, Yo Jeremijenko-Conley, Jasraj Johl",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Colin Jemmott",
                    "domain": "Recommender Systems",
                    "summarized": "ForumRec is a recommendation system designed to improve the usability of the Super User forum by suggesting questions that users may be more suitable to answer. The system uses a combination of content-based and collaborative filtering techniques to identify relevant questions for users. Compared to baseline models, ForumRec achieves better performance in terms of precision, recall, and AUC. The system is implemented on a website where users can log in using their Stack Overflow or Super User accounts and receive personalized recommendations. Future plans include updating the model more frequently, gathering user feedback, and focusing on veteran users to improve the efficiency of the forum.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_48",
                    "website_url": "http://www.jackzlin.com/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_48.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "52": {
                    "proj_title": "Bridging the Gap: Solving Music Disputes with Recommendation Systems",
                    "year": 2021,
                    "members": "Sarat Sreepathy, Duncan Carlmark, Nayoung Park",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Colin Jemmott",
                    "domain": "Recommender Systems",
                    "summarized": "The researchers developed a recommendation system to solve music disputes between parents and children. They created two recommendation systems: one that recommends music parents enjoy to their children, and another that recommends music children enjoy to their parents. The systems generate Spotify playlists that aim to bridge the gap between the music tastes of parents and children. User testing showed mixed success in creating playlists that both parties could listen to, with success depending on the similarity of their music tastes. While not perfect, the recommender can successfully bridge the gap in situations where there is overlap between parents and children's music preferences.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_46",
                    "website_url": "http://bridgingthegapwithmusic.com/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_46.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "55": {
                    "proj_title": "Makeup Recommender",
                    "year": 2021,
                    "members": "Justin Lee, Alexandria Kim, Shayal Singh",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Colin Jemmott",
                    "domain": "Recommender Systems",
                    "summarized": "The report discusses the development of a makeup recommender system that provides personalized recommendations for users based on their skin type, skin tone, budget, and ingredient preferences. The system utilizes collaborative filtering to recommend products based on similar users' preferences. The report also includes information about the data collection process, the baseline comparison method used, and the metrics used to evaluate the effectiveness of the recommendations. The results show an AUC score of 0.68 and mention user studies conducted to improve the website's functionality. The report concludes with limitations and future work for improving the recommender system.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_44",
                    "website_url": "https://makeup-recommender.herokuapp.com/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_44.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "53": {
                    "proj_title": "Asnapp - Workout Video Recommender",
                    "year": 2021,
                    "members": "Najeem Kanishka, Peter Peng, Amanda Shu",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Colin Jemmott",
                    "domain": "Recommender Systems",
                    "summarized": "Asnapp is a web application that provides personalized recommendations for workout videos. It solves the problem of finding suitable workout routines for home workouts by offering personalized recommendations based on fitness needs, time constraints, and equipment availability. The application scrapes workout data from Fitness Blender and uses user comments to train recommendation models. Three models are evaluated: random, top popular, and a collaborative filtering model. The web application allows users to login, choose a model, view recommendations, and interact with the workouts. Future improvements include adding more recommender options and enhancing user preferences.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_45",
                    "website_url": "https://workout-recommender.herokuapp.com/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_45.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "51": {
                    "proj_title": "OnSight: Outdoor Rock Climbing Recommendations",
                    "year": 2021,
                    "members": "Brian Cheng, Brent Min, Eric Liu",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Colin Jemmott",
                    "domain": "Recommender Systems",
                    "summarized": "The project \"OnSight: Outdoor Rock Climbing Recommendations\" aims to provide personalized recommendations for outdoor rock climbers. Currently, the lack of good recommendations is hindering the growth of outdoor climbing. The traditional methods of word of mouth, guide books, and online websites have limitations. To address this issue, the project uses data from MountainProject.com and implements a recommender system. The system allows users to input their preferences such as location, difficulty level, and climbing type to receive tailored recommendations. The project includes both a top popular recommender and a personalized recommender based on the user's past climbing history. The website also provides information on data acquisition, creating the product, and the challenges faced during the project. Moving forward, the team plans to incorporate more climbing types and improve the recommendation algorithms.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_47",
                    "website_url": "https://dsc180b-rc-rec.herokuapp.com/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_47.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "54": {
                    "proj_title": "Plates4U",
                    "year": 2021,
                    "members": "Alex Pham, Anthony Fong, Zachary Nguyen",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Colin Jemmott",
                    "domain": "Recommender Systems",
                    "summarized": "The authors of this paper developed a recipe recommendation system hosted on a website called Plates4U. They used recipe data from Food.com and created a classifier to identify cuisines, a popularity-based recommender, and a content-based filtering recommender using cosine similarity. The goal of the project was to develop a user-friendly recipe recommender system that suggests interesting recipes based on user input filters such as ingredients, cook time, and cuisine type. They also discussed the dataset they used and the models they implemented, including a most popular model and a cosine similarity model. The most popular model predicts the most popular recipes for all users, while the cosine similarity model compares user input with existing recipes to provide recommendations. The authors concluded by mentioning future improvements they would like to make to the recommender system.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_43",
                    "website_url": "https://recipe-rec-app.herokuapp.com/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_43.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "184": {
                    "proj_title": "Trustworthy Recommender Systems via Bayesian Bandits",
                    "year": 2023,
                    "members": "Hien Bui, Eric Song, Xiqiang Liu, Vivek Saravanan",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Yuhua Zhu",
                    "domain": "Fairness and Causal Inference",
                    "summarized": "This paper proposes a constrained bandit-based recommender system to address the issue of trust in recommender systems. The model outperforms other popular bandit algorithms in terms of expected regret and does not lose the trust of users. The paper compares different bandit algorithms and discusses the development of fair and trustworthy recommender systems. The experiments show that the Bayesian Optimal Policy performs better than other algorithms, and a constrained variant of the model maintains user trust.",
                    "github_url": "https://github.com/ejsong37/Trustworthy-Recommender-Systems-Capstone",
                    "website_url": "https://hi3nb1.github.io/capstone/Introduction.html",
                    "report_url": "https://drive.google.com/file/d/10VEKJZ_TWxqBKimkeTWUmmYjivagMGZJ/view?usp=drivesdk.pdf",
                    "poster_url": "https://drive.google.com/file/d/1BjS6ZcwmB4TsGctyS56vNxZsTev8F0zF/view?usp=drivesdk",
                    "github_contributors": "{'ejsong37': 'https://github.com/ejsong37'}",
                    "language_breakdown": "{'Jupyter Notebook': 0.77, 'Python': 0.23, 'Dockerfile': 0.0}"
                },
                "23": {
                    "proj_title": "The Food Chain - A Personalized Restaurant Recommender System ",
                    "year": 2020,
                    "members": "David Thierry, Lindsey Doyle, Daniel Hartmann",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Aaron Fraenkel",
                    "domain": "Malware / Graph Learning",
                    "summarized": "Report Summary not available",
                    "github_url": "https://github.com/DSC-Capstone/projects-2019-2020/tree/master/project_24/",
                    "website_url": "http://team05.pythonanywhere.com/",
                    "report_url": "null",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "49": {
                    "proj_title": "Restaurant Recommender System",
                    "year": 2021,
                    "members": "Catherine Hou, Shenghan Liu, Vincent Le",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Jingbo Shang",
                    "domain": "Text Mining and NLP",
                    "summarized": "This paper discusses the use of user review text in recommender systems. The authors propose building a recommender system that analyzes review texts using TF-IDF and AutoPhrase to extract key phrases and sentiments. They also incorporate collaborative filtering techniques. The results show that their system provides relevant and high-quality recommendations compared to Yelp's search results. The authors suggest future work to improve the algorithm and explore the use of negative sentiments in recommendations.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_37",
                    "website_url": "http://vil069.pythonanywhere.com/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_37.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                },
                "62": {
                    "proj_title": "Graph-Based Product Recommendation",
                    "year": 2021,
                    "members": "Abdullatif Jarkas, Nathan Tsai",
                    "ucsd_or_ind": "UCSD",
                    "mentors": "Gal Mishne",
                    "domain": "Graph Data Analysis",
                    "summarized": "This project report explores the use of graph-based learning approaches in recommender systems. Traditional recommender systems use similarity metrics to recommend products, but they do not take into account the graph structure of the relationships between products. Graph-based recommender systems can utilize these relationships to generate more accurate and robust embeddings for product recommendation. The report discusses two unsupervised graph-based approaches, GraphSAGE and PinSage, applied to the Amazon-Electronics dataset. The models utilize graph relationships, product features, and user reviews to generate embeddings for product recommendation. The results show that the GraphSAGE model outperformed the PinSage model in terms of hit rate. Future considerations include incorporating user features and utilizing both product-product and user-product edges in a unified model.",
                    "github_url": "https://github.com/DSC-Capstone/projects-2020-2021/tree/main/projects/project_19",
                    "website_url": "https://nhtsai.github.io/graph-rec/",
                    "report_url": "https://dsc-capstone.org/projects-2020-2021/reports/project_19.pdf",
                    "poster_url": "null",
                    "github_contributors": "null",
                    "language_breakdown": "null"
                }
            }
    }

@app.get("/api/project")
def project(id: int):
    """
    Function that returns the right document with the elastic search instance.
    Returns set response as its for testing.

    Parameters
    ----------
    id : int
        The document id
    """
    # print(id)

    # # print(es_instance.es.exists(index="capstones", id=id))
    # # print(es_instance.es.get(index = "capstones", id = id))
    # results = es_instance.get_project(id)
    # print(results)
    # return {"message" : results}
    return {
        "message": {
            "proj_title": "Racial Bias in Film Awards Shows: Oscars & Golden Globes ",
            "year": 2020,
            "members": "Poonam Varkhedi, Emily Kwan, Rebecca Hu",
            "ucsd_or_ind": "UCSD",
            "mentors": "Molly Roberts",
            "domain": "Wikipedia & Social Analysis",
            "summarized": "Report Summary not available",
            "github_url": "https://github.com/DSC-Capstone/projects-2019-2020/tree/master/project_01/",
            "website_url": "https://mkwan13.github.io/180_final_site/",
            "report_url": "null",
            "poster_url": "null",
            "github_contributors": "null",
            "language_breakdown": "null"
        }
    }