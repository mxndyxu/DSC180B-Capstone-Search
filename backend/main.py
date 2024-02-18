"""
main.py

The script to run on command line to create the search_engine instance
and runs FastAPI to send information to the Front-End
"""
from typing import Union, Optional
import search_engine 
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

#Creating a FastAPI app instance
app = FastAPI()

# Create the elastic search engine instance
es_instance = search_engine.search_engine("http://localhost:9200", "capstones")

# uvicorn main:app --reload 

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
    Function that searches with the elastic search instance

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
    print(query)
    print(year)
    print(domain)
    print(mentor)
    

    results = es_instance.search(query, year, domain, mentor)
    print(results)
    return {"message" : results}

@app.get("/api/project")
def project(id: int):
    print(id)
    results = es_instance.get_project(id)
    print(results)
    return {"message" : results}
