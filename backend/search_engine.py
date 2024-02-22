"""
search_engine.py

Is the class that utilizes ElasticSearch and is a search engine.

Class Functions
---------------
cls_pooling - 
    Helper function to obtain embedding vectors from embedding model (Method obtained from HuggingFace)
get_embeddings - 
    Helper function to create embedding vectors from HuggingFace models (Method obtained from HuggingFace)

Class attributes
---------------
model_ckpt: str
    String that sets which specific huggingFace model to create the embeddings off of
tokenizer: AutoTokenizer
    HuggingFace autotokenizer that is made off the corresponding "model_ckpt"
"""
from transformers import AutoTokenizer, AutoModel
import torch
import pandas as pd
import numpy as np
from elasticsearch import Elasticsearch, helpers, exceptions
import pickle

# docker run --rm -p 9200:9200 -p 9300:9300 -e "xpack.security.enabled=false" -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.11.0

model_ckpt = "sentence-transformers/multi-qa-mpnet-base-dot-v1"
tokenizer = AutoTokenizer.from_pretrained(model_ckpt)
model = AutoModel.from_pretrained(model_ckpt)

#From Hugging Face Tutorials
def cls_pooling(model_output):
    """
    Function that helps in creating the semantic search embeddings
    Code was taken from HuggingFace tutorials

    Parameters
    ----------
    model_output : str
        The file location of the answers csv file
    """
    return model_output.last_hidden_state[:, 0]

def get_embeddings(text_list):
    """
    Function that obtains the semantic search embeddings
    given a list of strings comprising of the tokens

    Parameters
    ----------
    text_list : list
        The list of string tokens to obtain the embeddings
    """
    encoded_input = tokenizer(
        text_list, padding=True, truncation=True, return_tensors="pt"
    )
    encoded_input = {k: v for k, v in encoded_input.items()}
    model_output = model(**encoded_input)
    return cls_pooling(model_output)

class search_engine:
    """
    search_engine class

    Class Attributes
    ----------
    self.connection_string: string
        The routing string to connect to the Elastic Search instance
    
    self.index_name: string
        The index name in ElasticSearch
    
    self.es: ElasticSearch Instance
        The ElasticSearch Instance
    
    Methods
    ----------
    connect_to_es: 
        Makes the ElasticSearch instance and connects to it with the connection_string
    
    set_mappings:
        Sets the mappings for the ElasticSearch (all the fields that are to be loaded in)

    ingest_data:
        Ingests the information into the ElasticSearch index

    make_filter_list:
        Given filter parameters, create the list of filters to be added into the Elastic Search
        query

    search_filter:
        Searches purely with filters

    search_query:
        Searches ElasticSearch with only a text query.

    search_query_filter:
        Searches with both a text query and some filters.

    search:
        The search function that given the inputs will determine
        which specific search (search_filter, search_query, or search_query_filter)
        to be used.
    
    create_res_dict:
        Given the output of hits for each ElasticSearch query,
        returns it into a dict of the relevant info. This is what is
        returned back to ReactJS.
    """
    def __init__(self, connection_string, index_name):
        """ __init__ method
        Initializes a search_engine object

        Parameters
        ----------
        connection_string: str
            The url string route that is used to connect to the ElasticSearch instance.
    
        index_name: str
            The index name for the ElasticSearch
        """
        self.connection_string = connection_string
        self.index_name = index_name

        self.connect_to_es()
        
        # self.set_mappings({
        #         "properties": {
        #             "year_presented": {"type": "text"},
        #             "domain": {"type": "text"},
        #             "project_title": {"type": "text"},
        #             "project_title_vector": {"type" : "dense_vector", "dims" : 768, "similarity" : "cosine"},
        #             "industry": {"type": "text"},
        #             "mentors": {"type": "text"},
        #             "members": {"type": "text", "analyzer": "pattern"},
        #             "report_text_summarization": {"type": "text"},
        #             "readme_summarization": {"type": "text", "analyzer" : "english"},
        #             "readme_vector": {"type" : "dense_vector", "dims" : 768, "similarity" : "cosine"},
        #             "report_vector": {"type" : "dense_vector", "dims" : 768, "similarity" : "cosine"},
        #             "github_url": {"type": "text", "index": False},
        #             "website_url": {"type": "text", "index": False},
        #             "report_url": {"type": "text", "index": False},
        #             "poster_url": {"type": "text", "index": False},
        #             "github_contributors": {"type": "text", "index": False},
        #             "github_lang_breakdown": {"type": "text", "index": False}}
        #         })

        self.set_mappings({
            "settings": {
                "analysis": {
                    "analyzer": {
                        "comma_analyzer": {
                            "type": "custom",
                            "tokenizer": "comma_tokenizer"  # Custom tokenizer to split on commas
                        }
                    },
                    "tokenizer": {
                        "comma_tokenizer": {
                            "type": "pattern",
                            "pattern": ",\\s*"  # Split on commas and optional whitespace
                        }
                    }
                }
            },
            "mappings": {
                "properties": {
                    "year_presented": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword"
                            }
                        }
                    },
                    "domain": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword"
                            }
                        }
                    },
                    "project_title": {"type": "text"},
                    "project_title_vector": {"type": "dense_vector", "dims": 768, "similarity": "cosine"},
                    "industry": {
                        "type": "text",
                        "analyzer": "comma_analyzer",
                        "fields": {
                            "keyword": {
                                "type": "keyword"
                            }
                        }
                    },
                    "mentors": {
                        "type": "text",
                        "analyzer": "comma_analyzer",
                        "fields": {
                            "keyword": {
                                "type": "keyword"
                            }
                        }
                    },
                    "members": {
                        "type": "text",
                        "analyzer": "comma_analyzer",  # Custom analyzer for members
                        "fields": {
                            "keyword": {
                                "type": "keyword"
                            }
                        }
                    },
                    "report_text_summarization": {"type": "text"},
                    "readme_summarization": {"type": "text", "analyzer": "english"},
                    "readme_vector": {"type": "dense_vector", "dims": 768, "similarity": "cosine"},
                    "report_vector": {"type": "dense_vector", "dims": 768, "similarity": "cosine"},
                    "github_url": {"type": "text", "index": False},
                    "website_url": {"type": "text", "index": False},
                    "report_url": {"type": "text", "index": False},
                    "poster_url": {"type": "text", "index": False},
                    "github_contributors": {"type": "text", "index": False},
                    "github_lang_breakdown": {"type": "text", "index": False}
                }
            }
        })

        print("Mappings Set!")
        self.ingest_data()
        print("Done loading in data!")


    def connect_to_es(self):
        """ connect_to_es method
        Initializes the ElasticSearch object with the connection string
        """
        self.es = Elasticsearch(self.connection_string)
        print(self.es.info().body)
    
    def set_mappings(self, mappings: dict):
        """ set_mappings method
        Sets the mappings for the ElasticSearch instance

        Parameters
        ----------
        mappings: dict
            The mappings structure to be loaded
        """

        # This is testing if the ElasticSearch instance already exists and if so, deletes and reloads
        # Used often when doing the webdev setup
        try:
            self.es.indices.delete(index=self.index_name)
        except:
            print("No prior indices of type capstone found")
        self.es.indices.create(index = self.index_name, body = mappings) 

    def ingest_data(self):
        """ ingest_data method
        Reads the pickle object and loads in the data to the ElasticSearch engine
        """
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

    def make_filter_list(self, mentor = None, domain = None, year_presented = None):
        """ make_filter_list method
        Creates the filter list in a format accepted by the ElasticSearch query

        Parameters
        ----------
        mentor: str (Default = None)
            The mentor string filter
    
        domain: str (Default = None)
            The domain string filter

        year_presented: str (Default = None)
            The year_presented string filter
        """
        res = []
        # if mentor:
        #     res.append({"terms" : {"mentors.keyword" : mentor}})
        if mentor:
            res.append({
                "bool": {
                    "should": [
                        {"term": {"mentors.keyword": mentor}},
                        {"terms": {"mentors": [mentor]}},
                        {"terms": {"industry": [mentor]}}
                    ]
                }
            })
        if domain:
            res.append({"term" : {"domain.keyword" : domain}})
        if year_presented:
            res.append({"terms" : {"year_presented" : [year_presented]}})
        return res

    def create_res_dict(self, hits):
        """create_res_dict method

        Given a hits (list of dictionaries), convert the ElasticSearch response
        into a json format accepted into the ReactJS front-end

        Parameters
        ----------
        hits: dict
            Dictionary format that ElasticSearch sends back
        """
        res_dict = {}
        for hit in hits:
            vals = {}
            vals["score"] = hit["_score"]
            vals['proj_title'] = hit["_source"]["project_title"]
            vals['year'] = hit["_source"]["year_presented"]
            vals['members'] = hit["_source"]["members"].replace(',', ', ')
            vals['ucsd_or_ind'] = hit["_source"]["industry"].replace(',', ', ')
            vals['mentors'] = hit["_source"]["mentors"].replace(',', ', ')
            vals['domain'] = hit["_source"]["domain"]
            vals['summarized'] = hit["_source"]["report_text_summarization"]
            vals['github_url'] = hit["_source"]["github_url"]
            vals['website_url'] = hit["_source"]["website_url"]
            vals['report_url'] = hit["_source"]["report_url"]
            vals['poster_url'] = hit["_source"]["poster_url"]
            vals['github_contributors'] = hit["_source"]["github_contributors"]
            vals['language_breakdown'] = hit["_source"]["github_lang_breakdown"]

            res_dict[hit['_id']] = vals

        return res_dict

    def search_filter(self, filter_lst):
        """search_filter method

        The search where ElasticSearch merely uses filters. (All results that fit the filters
        will be returned)

        Parameters
        ----------
        filter_lst: list
            List object returned from make_filter_list method
        """
        resp = self.es.search(index="capstones", query={
            "bool": {
                "filter": filter_lst
            },
        })

        hits = resp.body['hits']['hits']
        # print(hits)
        return self.create_res_dict(hits)

    def search_query(self, query_str, results=10):
        resp = self.es.search(
            index="capstones",
            body={
                "query": {
                    "function_score": {
                        "query": {
                            "multi_match": {
                                "query": query_str,
                                "fields": ["members.keyword^3", "mentors.keyword^3", "industry.keyword^3", "domain.keyword^3"],
                                "type": "phrase",
                                "boost": 3
                            }
                        },
                        
                        "boost_mode": "sum"
                    }
                },
                "size": results,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "multi_match": {
                                    "query": query_str,
                                    "fields": ["project_title", "report_text_summarization", "readme_summarization",  "year_presented^3", "members^3", "mentors^3", "industry^3", "domain^3"],
                                    "fuzziness": "AUTO"
                                }
                            }
                        ]
                    }
                },
                "knn": [
                    {
                        "field": "project_title_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100
                    },
                    {
                        "field": "readme_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100
                    },
                    {
                        "field": "report_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100
                    }
                ]
            }
        )

        hits = resp.body['hits']['hits']
        return self.create_res_dict(hits)


    def search_query_filter(self, query_str, filter_lst, results = 10):
        """search_query_filter method

        The search where ElasticSearch uses both a string query and a filter. 

        Parameters
        ----------
        query_str: str
            The string query to be searched with
        
        filter_lst: list
            List object returned from make_filter_list method
        
        results: int (Default = 10)
            The number of results to return
        """
        resp = self.es.search(
            index="capstones",
            body={
                "query": {
                    "function_score": {
                        "filter": filter_lst,
                        "query": {
                            "multi_match": {
                                "query": query_str,
                                "fields": ["members.keyword^3", "mentors.keyword^3", "industry.keyword^3", "domain.keyword^3"],
                                "type": "phrase",
                                "boost": 3
                            }
                        },
                        
                        "boost_mode": "sum"
                    }
                },
                "size": results,
                "query": {
                    "bool": {
                        "filter": filter_lst,
                        "should": [
                            {
                                "multi_match": {
                                    "query": query_str,
                                    "fields": ["project_title", "report_text_summarization", "readme_summarization",  "year_presented^3", "members^3", "mentors^3", "industry^3", "domain^3"],
                                    "fuzziness": "AUTO"
                                }
                            }
                        ]
                    }
                },
                "knn": [
                    {
                        "field": "project_title_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100,
                        "filter": filter_lst
                    },
                    {
                        "field": "readme_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100,
                        "filter": filter_lst
                    },
                    {
                        "field": "report_vector",
                        "query_vector": get_embeddings(query_str).detach().numpy()[0],
                        "k": 10,
                        "num_candidates": 100,
                        "filter": filter_lst
                    }
                ]
            }
        )

        hits = resp.body['hits']['hits']
        # print(hits)
        return self.create_res_dict(hits)

    def search(self, query_string, year, domain, mentor):
        """search method
        The search method that the main.py calls. It will then determine
        which specific search function to use.

        Parameters
        ----------
        query_str: str
            The string query to be searched with
            
        mentor: str (Default = None)
            The mentor string filter
    
        domain: str (Default = None)
            The domain string filter

        year_presented: str (Default = None)
            The year_presented string filter
        """
        #Only filter situation
        filter_lst = self.make_filter_list(mentor, domain, year)


        if query_string == "undefined":
            print(f'Query String UNDEFINED')
            return self.search_filter(filter_lst)
        elif len(filter_lst) == 0: # query only string
            return self.search_query(query_string)
        else:
            return self.search_query_filter(query_string, filter_lst)
    
    def get_project(self, id):
        resp = self.es.get(index = self.index_name, id = id)
        # print(resp)
        # hits = resp["_source"]
        
        vals = {}

        vals['proj_title'] = resp["_source"]["project_title"]
        vals['year'] = resp["_source"]["year_presented"]
        vals['members'] = resp["_source"]["members"].replace(',', ', ')
        vals['ucsd_or_ind'] = resp["_source"]["industry"].replace(',', ', ')
        vals['mentors'] = resp["_source"]["mentors"].replace(',', ', ')
        vals['domain'] = resp["_source"]["domain"]
        vals['summarized'] = resp["_source"]["report_text_summarization"]
        vals['github_url'] = resp["_source"]["github_url"]
        vals['website_url'] = resp["_source"]["website_url"]
        vals['report_url'] = resp["_source"]["report_url"]
        vals['poster_url'] = resp["_source"]["poster_url"]
        vals['github_contributors'] = resp["_source"]["github_contributors"]
        vals['language_breakdown'] = resp["_source"]["github_lang_breakdown"]

        

        return vals
            