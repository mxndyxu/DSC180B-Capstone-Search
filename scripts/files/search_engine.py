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

