from typing import Union
import search_engine 

from fastapi import FastAPI, Query

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

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
def search(query: str=Query(...)):
    print(query)
    return query

