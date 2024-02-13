from typing import Union, Optional
import search_engine 

from fastapi import FastAPI, Query

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

es_instance = search_engine.search_engine("http://localhost:9200", "capstones")

# uvicorn main:app --reload 

origins = [
    "http://localhost:8000",
    "http://localhost:3000",  # React app port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello World"}

@app.get("/api/search")
def search(query: Optional[str] = None, year: Optional[str] = None, domain: Optional[str] = None, mentor: Optional[str] = None):
    print(query)
    print(year)
    print(domain)
    print(mentor)
    # print(filter)
    # query + year, domain, mentor
    final_query = ""
    if query != "undefined": final_query += query
    if year: final_query += " " + year
    if domain: final_query += " " +  domain
    if mentor: final_query += " " + mentor

    print(final_query)
    results = es_instance.search_query(final_query)
    print(results)
    return {"message" : results}

