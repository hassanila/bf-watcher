var proxies = [
    null,
    'http://127.0.0.1:8888',
    'http://***REMOVED******REMOVED***97:***REMOVED******REMOVED******REMOVED***@***REMOVED***:8889',
    'http://***REMOVED******REMOVED***.net:3292'
];


module.exports = {

    mysql: {
        host: '***REMOVED******REMOVED***.net',
        port: 3290, //3306
        user: '***REMOVED***',
        password: '***REMOVED***',
        database: 'bf-watcher',
        dateStrings: true
    },
    users: [
        {
            name: '***REMOVED***',
            email: '***REMOVED******REMOVED***97@gmail.com',
            pNummer: '***REMOVED***',
            auto: {
                hhem: {
                    // 6210kr grundlön från November
                    // max 25% av inkomsten
                    active: true,
                    password: '***REMOVED******REMOVED******REMOVED***',
                    maxPrice: 6779,
                    minRooms: 2,
                    maxRooms: 4
                },
                vicpark: {
                    active: true,
                    password: '***REMOVED******REMOVED******REMOVED***',
                    maxPrice: 10000,
                    minRooms: 2
                },
                akelius: {
                    // fix medsökande
                    active: true,
                    password: '***REMOVED******REMOVED******REMOVED***',
                    maxPrice: 10000,
                    minRooms: 2
                },
                vasbyhem: {
                    active: true,
                    password: '***REMOVED******REMOVED******REMOVED***',
                    // 40%  av inkomsten max
                    maxPrice: 9500,
                    minRooms: 2
                },
                sigtunahem: {
                    active: true,
                    password: '***REMOVED******REMOVED******REMOVED***',
                    // 40%  av inkomsten max
                    maxPrice: 10000,
                    minRooms: 2
                }
            },
            check: true,
            types: ['normal', 'fast', 'sigtuna'],
            sitesToExclude: [
                'wahlin:normal'
            ]
        },
        {
            name: '***REMOVED***',
            email: '***REMOVED***',
            pNummer: '***REMOVED***',
            auto: {
                hhem: {
                    active: true,
                    password: '***REMOVED***',
                    maxPrice: 7000,
                    minRooms: 3
                },
                vicpark: {
                    active: true,
                    password: '***REMOVED***',
                    maxPrice: 13000,
                    minRooms: 3
                },
                akelius: {
                    active: true,
                    password: '***REMOVED***',
                    maxPrice: 13000,
                    minRooms: 3
                },
                vasbyhem: {
                    active: true,
                    password: '***REMOVED***',
                    // 40%  av inkomsten max
                    maxPrice: 10000,
                    minRooms: 3
                },
                sigtunahem: {
                    active: true,
                    password: '***REMOVED***',
                    // 40%  av inkomsten max
                    maxPrice: 15000,
                    minRooms: 3
                }
            },
            check: true,
            types: ['normal', 'fast', 'sigtuna'],
            sitesToExclude: [
                'bf:normal',
                'jfhus',
                'hembla',
                'wahlin:normal',
            ]
        },
        {
            name: '***REMOVED***',
            email: '***REMOVED***',
            pNummer: '***REMOVED***',
            auto: {},
            check: false,
            types: ['normal', 'fast', 'sigtuna'],
            sitesToExclude: [
                'bf:normal',
                'jfhus',
                'hembla',
                'wahlin:normal',
                'akelius'
            ]
        }
    ],
    roomsMaxPrices: {
        1: 4000,
        2: 5500,
        3: 10000,
        4: 12000,
        5: 13000,
        6: 13000
    },
    sitesToExclude: [],
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
        hhem: 'https://bostad.hasselbyhem.se/HSS/Object/object_list.aspx?objectgroup=1&action=Ava***REMOVED***ble',
        vicpark: 'https://minasidor.victoriapark.se/ledigt/lagenhet?marketarea=AREA_777&selectedarea=STOCKHOLMORT',
        heimstaden: 'https://mitt.heimstaden.com/HSS/Object/object_list.aspx?&objectgroup=1&marketarea=AREA_1345&selectedarea=V%C3%A4llingby',
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
    email: '***REMOVED******REMOVED***97@gmail.com',
    password: '***REMOVED******REMOVED******REMOVED***',
    proxies: proxies,
    android_ua: 'Android 8.0.0; O; sdk=26; ***REMOVED*** android-55/5.5',
    chrome_ua: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
    proxy: proxies[0],
    enableServer: true,
    embedEmailImages: false,
    logsPath: './../logs/',
    version: 4.0

};
