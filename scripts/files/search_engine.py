from transformers import AutoTokenizer, AutoModel
import torch
import pandas as pd
import numpy as np
from elasticsearch import Elasticsearch, helpers, exceptions
import pickle

# print(torch.backends.cudnn.enabled)
# print(torch.cuda.is_available()) #We have GPU on deck and ready
# print(f"CUDA device: {torch.cuda.get_device_name(torch.cuda.current_device())}")

model_ckpt = "sentence-transformers/multi-qa-mpnet-base-dot-v1"
tokenizer = AutoTokenizer.from_pretrained(model_ckpt)
model = AutoModel.from_pretrained(model_ckpt)

#From Hugging Face Tutorials
def cls_pooling(model_output):
    return model_output.last_hidden_state[:, 0]

def get_embeddings(text_list):
    encoded_input = tokenizer(
        text_list, padding=True, truncation=True, return_tensors="pt"
    )
    encoded_input = {k: v for k, v in encoded_input.items()}
    model_output = model(**encoded_input)
    return cls_pooling(model_output)

class search_engine:
    def __init__(self, connection_string, index_name):
        self.connection_string = connection_string
        self.index_name = index_name

        self.connect_to_es()


    def connect_to_es(self):
        self.es = Elasticsearch(self.connection_string)
        print(self.es.info().body)
    
    def set_mappings(self, mappings: dict):
        self.es.indices.create(index = self.index_name, mappings = mappings) 

    def ingest_data(self):
        es_data_DF = pd.read_pickle("../../data/es_data_DF.pkl")
        for _, row in es_data_DF.iterrows():
            doc = {
                "year_presented": row['year_presented'],
                "domain": row["domain"],
                "project_title": row["project_title"],
                "project_title_vector": row["project_title_vector"],
                "mentors": row["mentors"],
                "industry": row["industries"],
                "members": row["students"],
                "report_text_summarization": row["report_summary"],
                "readme_summarization": row["readme_summary"],
                "readme_vector": row["readme_vector"],
                "report_vector": row["report_vector"]
            }
            self.es.index(index="capstones", id=row["project_id"], document=doc)

        

    def search_query(self, query_str, results = 10, verbose = True):
        resp = self.es.search(
                index="capstones",
                query={
                        "multi_match": {
                            "query": query_str,
                            "type": "phrase",
                            "fields" : ["project_title^2", "domain^2", "year_presented", "industry^2", "mentors^3", "members^3", "readme_summarization"],
                            "fuzziness": "AUTO",
                            # "boost": 0.9
                        },
                        "multi_match": {
                            "query": query_str,
                            "fields" : ["project_title^2", "domain^2", "year_presented", "industry^2", "mentors^3", "members^3", "readme_summarization"],
                            "fuzziness": "AUTO",
                            # "boost": 0.9
                        },
                    },
                knn=[
                    {
                        "field": "project_title_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100,
                        # "boost": 0.1
                    },
                    {
                        "field": "readme_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100,
                        # "boost": 0.1
                    },
                    {
                        "field": "report_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100,
                        # "boost": 0.1
                    } 
                ],
                size=results
            )
        
        hits = resp.body['hits']['hits']
        ids = [hit["_id"] for hit in hits]

        if verbose:
            print(f'Number of hits: {resp.body["hits"]["total"]["value"]}')
            print('----------------')
            for hit in hits:
                print(f'Score: {hit["_id"]}')
                print(f'Score: {hit["_score"]}')
                print(f'Project: {hit["_source"]["project_title"]}')
                print(f'Domain: {hit["_source"]["domain"]}')
                print(f'Students: {hit["_source"]["members"]}')
                print(f'Industry/UCSD: {hit["_source"]["industry"]}')
                print(f'Mentor: {hit["_source"]["mentors"]}')
                print('----------------')
        return ids
