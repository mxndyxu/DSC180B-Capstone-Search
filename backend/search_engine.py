from transformers import AutoTokenizer, AutoModel
import torch
import pandas as pd
import numpy as np
from elasticsearch import Elasticsearch, helpers, exceptions
import pickle

# docker run --rm -p 9200:9200 -p 9300:9300 -e "xpack.security.enabled=false" -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.11.0

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
        
        self.set_mappings({
                "properties": {
                    "year_presented": {"type": "text"},
                    "domain": {"type": "text"},
                    "project_title": {"type": "text"},
                    "project_title_vector": {"type" : "dense_vector", "dims" : 768, "similarity" : "cosine"},
                    "industry": {"type": "text"},
                    "mentors": {"type": "text"},
                    "members": {"type": "text"},
                    "report_text_summarization": {"type": "text"},
                    "readme_summarization": {"type": "text", "analyzer" : "english"},
                    "readme_vector": {"type" : "dense_vector", "dims" : 768, "similarity" : "cosine"},
                    "report_vector": {"type" : "dense_vector", "dims" : 768, "similarity" : "cosine"},
                    "github_url": {"type": "text", "index": False},
                    "website_url": {"type": "text", "index": False},
                    "report_url": {"type": "text", "index": False},
                    "poster_url": {"type": "text", "index": False},
                    "github_contributors": {"type": "text", "index": False},
                    "github_lang_breakdown": {"type": "text", "index": False}}
                })
        print("Mappings Set!")
        self.ingest_data()
        print("Done loading in data!")


    def connect_to_es(self):
        self.es = Elasticsearch(self.connection_string)
        print(self.es.info().body)
    
    def set_mappings(self, mappings: dict):
        try:
            self.es.indices.delete(index=self.index_name)
        except:
            print("No prior indices of type capstone found")
        self.es.indices.create(index = self.index_name, mappings = mappings) 

    def ingest_data(self):
        # es_data_DF = pd.read_pickle("../data/es_data_DF.pkl")
        es_data_DF = pd.read_pickle("../data/es_data.pkl")
        for _, row in es_data_DF.iterrows():
            doc = {
                "year_presented": row['year_presented'],
                "domain": row["domain"],
                "project_title": row["project_title"],
                "project_title_vector": row["project_title_vector"],
                "mentors": row["mentors"],
                "industry": row["industry"],
                "members": row["members"],
                "report_text_summarization": row["report_text_summarization"],
                "readme_summarization": row["readme_summarization"],
                "readme_vector": row["readme_vector"],
                "report_vector": row["report_vector"],
                "github_url": row["github_repo"],
                "website_url": row["website"],
                "report_url": row["report"],
                "poster_url": row["poster"],
                "github_contributors": row["contributors"],
                "github_lang_breakdown": row["language_breakdown"]
            }
            self.es.index(index="capstones", id=row["project_id"], document=doc)
        
    def search_query(self, query_str, results = 10, verbose = True):
        resp = self.es.search(
                index="capstones",
                query={
                        "multi_match": {
                            "query": query_str,
                            "type": "phrase",
                            "fields" : ["project_title^2", "domain^2", "year_presented^3", "industry^2", "mentors^3", "members^3", "readme_summarization"],
                            "fuzziness": "AUTO",
                            # "boost": 0.9
                        },
                        "multi_match": {
                            "query": query_str,
                            "fields" : ["project_title^2", "domain^2", "year_presented^3", "industry^2", "mentors^3", "members^3", "readme_summarization"],
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
        
        print(f'resp.body: {resp.body}')
        hits = resp.body['hits']['hits']
        ids = [hit["_id"] for hit in hits]

        res_dict = {}
        for hit in hits:
            vals = {}

            vals['proj_title'] = hit["_source"]["project_title"]
            vals['year'] = hit["_source"]["year_presented"]
            vals['members'] = hit["_source"]["members"].replace(',', ', ')
            vals['ucsd_or_ind'] = hit["_source"]["industry"].replace(',', ', ')
            vals['mentors'] = hit["_source"]["mentors"].replace(',', ', ')
            # vals['summarized'] = hit["_source"]["report_text_summarization"]
            vals['github_url'] = hit["_source"]["github_url"]
            vals['website_url'] = hit["_source"]["website_url"]
            vals['report_url'] = hit["_source"]["report_url"]
            vals['poster_url'] = hit["_source"]["poster_url"]
            vals['github_contributors'] = hit["_source"]["github_contributors"]
            vals['language_breakdown'] = hit["_source"]["github_lang_breakdown"]

            res_dict[hit['_id']] = vals

        return res_dict
