import json
import string
import nltk
from scipy.spatial import KDTree
import random

data_json = {
  "last_answer_id": 2,
  "last_question_id": 1,
  "questions": [
    {
      "id": 1,
      "text": "привет",
      "answers": [
        1,
        2
      ]
    }
  ],
  "answers": [
    {
      "id": 1,
      "text": "Здарова!"
    },
    {
      "id": 2,
      "text": "Ку-ку"
    }
  ]
}

def nltk_processing(text):
    tokens = nltk.tokenize.word_tokenize(text)
    tokens = [i for i in tokens if (i not in string.punctuation)]
    stop_words = nltk.corpus.stopwords.words('russian')
    stop_words.extend(
        ['что', 'это', 'так', 'вот', 'быть', 'как', 'в', '—', '–', 'к', 'на', '...', '===', '===='])
    tokens = [i for i in tokens if (i not in stop_words)]
    tokens = [i.replace("«", "").replace("»", "") for i in tokens]
    return tokens

def create_questions_answers():
    data = [
          'data/answer_databse-1.bin'
         , 'data/answer_databse-2.bin'
         , 'data/answer_databse-3.bin'
         , 'data/база_с_командой_прікол.bin'
         , 'data/без мата.bin'
        # , 'data/большой_с_мусором.txt'
    ]

    all_count = 0
    for path in data:
        print('Start working with %s' % path)
        file_count = 0
        with open(path, "r", encoding="utf-8") as data_file:
            count = 0
            for line in data_file.readlines():
                if count >= 10000:
                    print('Processed %s answers' % all_count)
                    count = 0
                all_count += 1
                file_count += 1
                count += 1

                dataset = line.split('\\')

                if len(dataset) < 2:
                    continue

                new_question =  dataset[0].lower()
                new_answer = dataset[1]

                #question
                new_question_index = None
                for index, old_question in enumerate(data_json['questions']):
                    if old_question['text'] == new_question:
                        # print(index, new_question)
                        new_question_index = index
                        break

                if not new_question_index:
                    data_json['last_question_id'] += 1
                    new_question_index = len(data_json['questions'])
                    data_json['questions'].append({
                        "id": new_question_index,
                        'text': new_question,
                        'answers': []#,
                        # 'nltk_tokens': nltk_processing(new_question)
                    })

                #answer
                new_ansver_id = None
                for old_answer in data_json['answers']:
                    if old_answer['text'] == new_answer:
                        new_ansver_id = old_answer['id']
                        break

                if not new_ansver_id:
                    data_json['last_answer_id'] += 1
                    new_ansver_id = len(data_json['answers'])
                    data_json['answers'].append({
                        'id': new_ansver_id,
                        'text': new_answer
                    })

                if new_ansver_id in data_json['questions'][new_question_index]['answers']:
                    continue

                data_json['questions'][new_question_index]['answers'].append(new_ansver_id)

        print('Finish working with %s (%s answers)' % (path, file_count))

    print('FINISH', 'Processed: %s answers' % all_count)

    for question in data_json['questions']:
        question['nltk_token'] = nltk_processing(question['text'])
    print('Finish NLKT tokenize')

create_questions_answers()

from gensim.models import doc2vec
model = doc2vec.Doc2Vec.load('model/bot.doc2vec.v4')

# Create KDTree
i = 0
data = []
for question in data_json['questions']:
    question['KDTree_id'] = None
    if len(question['nltk_token']) > 0:
        data.append(model.infer_vector(question['nltk_token'], steps=20, alpha=0.025))
        question['KDTree_id'] = i
        i += 1
print('Finish creating vectors and data for KDTree')
tree = KDTree(data)

def find_ansver(text):
    text = text.lower()
    nltk_tokens = nltk_processing(text)
    is_find = False
    n_question = None
    KDTree_id = None
    vector = None
    if len(nltk_tokens) == 0:
        for question in data_json['questions']:
            if question['text'] == text:
                is_find = True
                n_question = question
                break
    else:
        is_find = True
        doc2vec = model.infer_vector(nltk_tokens, steps=20, alpha=0.025)
        vector, KDTree_id = tree.query(doc2vec)
        for question in data_json['questions']:
            if question['KDTree_id'] == KDTree_id:
                n_question = question
                break

    if not is_find:
        return 'Вопрос не найден:' + text

    answers = n_question['answers']
    answer_pos = random.randint(0, len(answers)-1)
    answer_id = answers[answer_pos]

    answer_text = 'Не найден ответ, но найден вопрос...'
    for old_answer in data_json['answers']:
        if old_answer['id'] == answer_id:
            answer_text = old_answer['text']
            break
    if not vector:
        return ''


    return text + '|' + answer_text + '|' + n_question['text'] + "|" + str(vector)

