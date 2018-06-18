const consts = {
    table_name: 'articles',
    language: {
        EN : 'en',
        RU : 'ru'
    },
    robots: {
        //robots — мета-тег, который отвечает за настройки индексирования страницы.
        // У мета-тега «robots» могут быть следующие значения:
        INDEX:      'index',    // index — страница индексируется;
        NOINDEX:    'noindex',  // noindex — страница не индексируется;
        FOLLOW:     'follow',   // follow — гиперссылки на странице учитываются;
        NOFOLLOW:   'nofollow', // nofollow — гиперссылки на странице не учитываются
        ALL:        'all',      // all — заменяет «index» и «follow», т.е. страница индексируется и гиперссылки на ней
                                // учитываются (действует по умолчанию);
        NONE:       'none'      // none — заменяет «noindex» и «nofollow», т.е. страница не индексируется и г
                                // иперссылки на ней не учитываются.
    },
    commentStatus: {
        OFF: 0,         // без комментариев
        ON:  1,         // комментарии включены
        ONLY_SHOW: 2    // комментарии видны, но добавление новых запрещено
    },
    publishStatus: {
        PUBLISH: 1,     // опубликовано
        HIDDEN: 0       // скрыто
    },
    type: {
        NONE: 0,        // без категории
        NEWS: 1,        // новости
        GUIDES: 2,      // гайды
        TECHNICALS: 3   // тех. моменты
    }
}

module.exports = consts;

