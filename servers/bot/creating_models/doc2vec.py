from gensim.models import doc2vec
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')
import string
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

text = open('clear.xml', 'r', encoding='utf-8').read()

from collections import namedtuple
analyzedDocument = namedtuple('AnalyzedDocument', 'words tags')

def tokenize_ru(file_text, id):
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

    return analyzedDocument(tokens, [id])


# sentences = [tokenize_ru(sent) for sent in sent_tokenize(text, 'russian')]

sentences = []
id = 1
for sent in sent_tokenize(text, 'russian'):
    sentences.append(tokenize_ru(sent, id))
    id += 1


print(len(sentences))

from gensim.models import doc2vec


# model = doc2vec.Doc2Vec(dm=0, vector_size = 100, window = 500, min_count = 5, workers = 8, dbow_words=0)
# model = doc2vec.Doc2Vec(docs, dm=0, size=100, window=7, min_count=5,	workers=4,	dbow_words=1)
# model = doc2vec.Doc2Vec(dm=0, vector_size = 100, window = 10, min_count = 5, workers = 8, dbow_words=
model = doc2vec.Doc2Vec(min_count=1, window=10, size=200, sample=1e-4, negative=5, workers=8, vector_size=200, epochs=1, dm=1)
model.build_vocab(sentences)

model.train(sentences,  total_examples=model.corpus_count, epochs=model.epochs)
# model.train(sentences,  total_examples=model.corpus_count, epochs=20)

model.save('bot.doc2vec.v4')

