#!/usr/bin/env python3
# coding: utf-8

import sys
import gensim, logging
import random
import string

# Что вообще происходит?
# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)


# ----------------------------------------------
# Ниже демонстрируется процесс тренировки модели
# ----------------------------------------------
# на вход модели даём текстовый файл, каждое предложение на отдельной строчке
# argument = 'text.txt'

# создаём структуру данных для модели
# data = gensim.models.word2vec.LineSentence(argument)

# инициализируем модель (параметры в скобочках: data - данные, size - размер вектора, window -размер окна наблюдения,
#                                               min_count - мин. частотность слова в корпусе, которое мы берем,
#                                               sg - используемый алгоритм обучение (0 - CBOW, 1 - Skip-gram))
# model = gensim.models.Word2Vec(data, size=500, window=10, min_count=2, sg=0)
# чтобы модель использовала меньше RAM (но теперь её нельзя менять!)
# model.init_sims(replace=True)

# Смотрим, сколько в модели слов
# print(len(model.vocab))

# сохраняем
# model.save('my.model')

# ---------------------------------------------
# Ниже демонстрируется процесс работы с моделью
# ---------------------------------------------
# берём модель
our_model = 'model/lurk.model'

# загружаем модель
if our_model.endswith('.vec.gz'):
    model = gensim.models.Word2Vec.load_word2vec_format(our_model, binary=False)
elif our_model.endswith('.bin.gz'):
    model = gensim.models.Word2Vec.load_word2vec_format(our_model, binary=True)
else:
    model = gensim.models.Word2Vec.load(our_model)
# Чтобы модель требовала меньше RAM
model.init_sims(replace=True)

print('FINISH')

'''
# скажем, нам интересны такие слова (пример для русского языка)
words = ['рациональность']

# играем со словами
for word in words:
    # есть ли слово в модели? Может быть, и нет
    if word in model:
        print(word)
        # смотрим на вектор слова (его размерность 1000, смотрим на первые 10 чисел)
        print(model[word][:10])
        # выдаем 10 ближайших соседей слова:
        for i in model.most_similar(positive=[word], topn=150):
            # слово + коэффициент косинусной близости
            print(i[0], i[1])
        print('\n')
    else:
        # Увы!
        print(word + 'is not present in the model')

# находим косинусную близость пары слов
print(model.similarity('человек', 'космонавт'))

# найди лишнее!
# print(model.doesnt_match('яблоко груша виноград банан лимон картофель'.split()))
print(model.doesnt_match('яблоко груша виноград банан лимон картофель термодинамика'.split()))

# реши пропорцию!
print(model.most_similar(positive=['уксус', 'груша', 'виноград', 'банан', 'лимон', 'картофель','термодинамика']))
# print(model.most_similar(positive=['привет', 'человек', 'забор'], topn=10))
'''

#print(model.most_similar(positive=['в']))

# original_text = "Продолжаем заниматься познавательной физкультурой на примере двух столичных девушек вместе с «PROспорт» и сетью фитнес-клубов «Адреналин». В центре сюжета — по-прежнему тренер Кристина Ладутько и ее подопечная Карина Макоста. Заканчивается адаптационный период. Пока тренировки происходят пару раз в неделю и имеют общий характер. Вскоре их станет три, занятия приобретут узкую направленность. Пока же этого не произошло, разбираемся с рационом Карины. " \
#                 "Простите за патетику посреди выходного, но жизнь — сложная штука. И сколько бы человек ни тренировался, по большей части успех его преображения определяет рацион. Кристина анализировала рацион Карины, выходило примерно 1500 калорий на день. Не худший показатель, но калории были не самые качественные. Тренер докрутила дневной счетчик до 1700 и изменила составляющие. " \
#                 "Нам не нужно много сахара, так что никаких сладких йогуртов и шоколадок. Нам нужны сложные углеводы без перебора и белок, который мышцам строиться и жить помогает. " \
#                 "Погнали в магазин!"

def getText(original_text, ton):

    print(ton)

    # original_text = "Во поле береза стояла, " \
    #                 "Во поле кудрявая стояла, " \
    #                 "Люли, люли, стояла. " \
    #                 "Некому березу заломати, " \
    #                 "Некому кудряву заломати, " \
    #                 "Люли, люли, заломати. " \
    #                 "Как пойду я в лес, погуляю, " \
    #                 "Белую березу заломаю, " \
    #                 "Люли, люли, заломаю. " \
    #                 "Срежу я с березы три пруточка, " \
    #                 "Сделаю себе я три гудочка, " \
    #                 "Люли, люли три гудочка. " \
    #                 "Четвертую балалайку, " \
    #                 "Пойду я на новые сени, " \
    #                 "Люли, люли на сени. " \
    #                 "Стану в балалаечку играти, " \
    #                 "Стану я милого будити. " \
    #                 "Люли, люли, будити: " \
    #                 "Встань ты, мой милый, проснися, " \
    #                 "Ты, душа моя, пробудися. " \
    #                 "Люли, люли пробудися. " \
    #                 "Пойдем в терем веселиться. " \
    #                 "Пойдем в терем веселиться, " \
    #                 "Люли, люли, веселиться. "

    # original_text = "Обычно атмосфера в Хогвартсе перед рождественскими праздниками была светлой и радостной. Большой зал уже был убран в зелёный и красный цвета. Эта традиция, древняя, как сам Хогвартс, появилась после свадьбы слизеринки и гриффиндорца, случившейся на святки и ставшей символом дружбы, которая выше предубеждений и разделения на факультеты. Со временем этот обычай распространился даже на магловские страны."

    original_text_list = original_text.split(' ')

    final_text = []

    #окончания

    import pymorphy2
    morph = pymorphy2.MorphAnalyzer()

    def reductionOfWords(master_word, slave_word):
        master_word_analysis = morph.parse(master_word)
        slave_word_analysis = morph.parse(slave_word)

        if len(master_word_analysis) < 1 or len(slave_word_analysis) < 1:
            return False

        slave =  slave_word_analysis[0]

        for master in master_word_analysis:
            required_master_grammers = False
            master_grammers = master.tag._str.split()
            if len(master_grammers) > 1:
                required_master_grammers = master_grammers[1]

            slave_lexems = slave.lexeme
            for slave_lexem in slave_lexems:

                if slave_lexem.tag.POS != master.tag.POS:
                    continue

                slave_grammers = slave_lexem.tag._str.split()

                if len(slave_grammers) <= 1:
                    if slave_lexem.word == master.word:
                        break
                    return slave_lexem.word


                required_slave_grammers = slave_grammers[1]

                if required_master_grammers == required_slave_grammers:
                    if slave_lexem.word == master.word:
                        break
                    return slave_lexem.word

        return False

    for original_world in original_text_list:

        if not original_world:
            continue

        optimise_world_without_mass = original_world.replace("«", "").replace("»", "").replace(".","").replace(",","")
        optimise_world_without_mass_lower = optimise_world_without_mass.lower()
        if optimise_world_without_mass_lower not in model:
            final_text.append(original_world)
            continue

        if ton != '':
            synonyms = model.most_similar(positive=[optimise_world_without_mass_lower, ton], topn=5)
        else:
            synonyms = model.most_similar(positive=[optimise_world_without_mass_lower], topn=5)

        final_synonyms = []
        for _synonym in synonyms:
            synonym = reductionOfWords(optimise_world_without_mass_lower, _synonym[0])
            if synonym:
                final_synonyms.append(synonym)

        if not final_synonyms:
            final_text.append(original_world)
            continue
        synonym = final_synonyms[random.randint(0,(len(final_synonyms)-1))]
        # synonym = model.most_similar(positive=[optimise_world_without_mass_lower], topn=20)[random.randint(0,0)][0]

        if optimise_world_without_mass[0] != optimise_world_without_mass_lower[0]:
             synonym = synonym[0].upper() + synonym[1:]


        final_text.append(str.replace(original_world, optimise_world_without_mass, synonym))

    # print(original_text)
    # print(' '.join(final_text))

    return ' '.join(final_text)





    # Want to know more? Read API docs!
# http://radimrehurek.com/gensim/models/word2vec.html