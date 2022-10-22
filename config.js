let proxies = [
    null,
    'http://127.0.0.1:8888'
];

module.exports = {

    mysql: {
        host: 'https://example.com',
        port: 3306,
        user: 'admin',
        password: 'somePassword',
        database: 'bf-watcher',
        dateStrings: true
    },
    users: [
        {
            name: 'User 1',
            email: 'user1@example.com',
            pNummer: '900101-0001', // personnummer
            auto: {
                hhem: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 12000,
                    minRooms: 3,
                    maxRooms: 5
                },
                vicpark: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 12000,
                    minRooms: 3
                },
                akelius: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 12000,
                    minRooms: 3
                },
                vasbyhem: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 10000,
                    minRooms: 3
                },
                sigtunahem: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 10000,
                    minRooms: 3
                }
            },
            check: true,
            notify: false,
            types: ['normal', 'fast', 'sigtuna'],
            sitesToExclude: [
                'wahlin:normal'
            ]
        },
        {
            name: 'User 2',
            email: 'user2@example.com',
            pNummer: '920101-1001', // personnummer
            auto: {
                hhem: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 12000,
                    minRooms: 3
                },
                vicpark: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 13000,
                    minRooms: 3
                },
                akelius: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 13000,
                    minRooms: 3
                },
                vasbyhem: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 10000,
                    minRooms: 3
                },
                sigtunahem: {
                    active: true,
                    password: 'somePassword',
                    maxPrice: 15000,
                    minRooms: 3
                }
            },
            check: true,
            notify: false,
            types: ['normal', 'fast', 'sigtuna'],
            sitesToExclude: [
                'bf:normal',
                'jfhus',
                'hembla',
                'wahlin:normal',
            ]
        }
    ],
    roomsMaxPrices: {
        1: 4000,
        2: 6000,
        3: 10000,
        4: 12000,
        5: 13000,
        6: 13000
    },
    sitesToExclude: ['wahlin', 'akelius', 'bf'],
    locationsToExclude: {
        bf: [
            'Västerås',
            'Norrtälje',
            'Vallentuna',
            'Österåker',
            'Vaxholm',
            'Värmdö',
            'Tyresö',
            'Haninge',
            'Nynäshamn',
            'Södertälje',
            'Nykvarn',
            'Nacka',
            'Huddinge',
            'Salem',
            'Ekerö',
            'Botkyrka',
            'Lidingö'
        ],
        hembla: [
            'arboga',
            'eskilstuna',
            'katrineholm',
            'jordbro',
            'nynashamn',
            'ronna',
            'sodertalje',
            'valsatra',
            'osmo',
            'vasteras',
            'koping',
            'norrkoping',
            'tranas',
            'strangnas'
        ],
        akelius: [
            'Västerhaninge',
            'Åkersberga',
            'Vaxholm',
            'Tyresö',
            'Salem',
            'Täby',
            'Skogås',
            'Malmö',
            'Kungsbacka',
            'Huddinge',
            'Rönninge'
        ],

    },
    homepagesObj: {
        hhem: 'https://bostad.hasselbyhem.se/HSS/Object/object_list.aspx?objectgroup=1&action=Available',
        vicpark: 'https://minasidor.victoriapark.se/ledigt/sok/objekt', //'https://minasidor.victoriapark.se/ledigt/lagenhet?marketarea=AREA_777&selectedarea=STOCKHOLMORT',
        heimstaden: 'https://mitt.heimstaden.com/HSS/Object/object_list.aspx?objectgroup=1&marketarea=AREA_1345&selectedarea=V%C3%A4llingby',
        wahlin: 'https://wahlinfastigheter.se/lediga-objekt/lagenheter/',
        bf: 'https://bostad.stockholm.se/Lista/',
        jfhus: 'https://marknad.jarfallahus.se/',
        upbrohus: 'https://marknad.upplands-brohus.se/',
        sigtunahem: 'https://sigtunahem.se/sok-ledigt/',
        hembla: 'https://www.hembla.se/bostader/',
        sollentunahem: 'https://minasidor.sollentunahem.se/ledigt/lagenhet',
        vasbyhem: 'https://www.vasbyhem.se/ledigt/lagenhet',
        akelius: 'https://rent.akelius.com/sv/search/sweden/apartment/stockholm',
        telge: 'https://www.telge.se/bostader/hyr-av-oss/'
    },
    debug: false,
    auto: true,
    checkOnInit: true,
    email: 'admin@example.com',
    password: 'somePassword',
    proxies: proxies,
    android_ua: 'Android 8.0.0; O; sdk=26; android-55/5.5',
    chrome_ua: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
    proxy: proxies[0],
    enableServer: true,
    embedEmailImages: false,
    logsPath: './../logs/',
    version: 4.0
};
