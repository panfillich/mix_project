import re

import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')

import gensim
import string
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

text = open('clear.xml', 'r', encoding='utf-8').read()

def tokenize_ru(file_text):
    # firstly let's apply nltk tokenization
    tokens = word_tokenize(file_text)

    # let's delete punctuation symbols
    tokens = [i for i in tokens if (i not in string.punctuation)]

    # deleting stop_words
    stop_words = stopwords.words('russian')
    stop_words.extend(['что', 'это', 'так', 'вот', 'быть', 'как', 'в', '—', '–', 'к', 'на', '...', '===', '===='])
    tokens = [i for i in tokens if (i not in stop_words)]

    # cleaning words
    tokens = [i.replace("«", "").replace("»", "") for i in tokens]

    return tokens

sentences = [tokenize_ru(sent) for sent in sent_tokenize(text, 'russian')]

print(len(sentences))  # 20024
print(sentences[200:209])  # [['Она', 'чувствовала', 'боится', 'боится', 'предстоящего', 'свидания'],...]

model = gensim.models.Word2Vec(sentences, size=150, window=5, min_count=5, workers=4)

# save model
model.save('lurk.model')
