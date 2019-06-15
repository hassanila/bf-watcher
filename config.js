var proxies = [
    null,
    'http://127.0.0.1:8888',
    'http://***REMOVED******REMOVED***97:***REMOVED******REMOVED******REMOVED***@***REMOVED***:8889',
    'http://***REMOVED******REMOVED***.net:8888'
];


module.exports = {

    mysql: {
        host     : 'localhost',
        port     :  3306, //9000,
        user     : '***REMOVED***',
        password : '***REMOVED***',
        database : 'bf',
        dateStrings : true
    },
    email: '***REMOVED******REMOVED******REMOVED***',
    password: '***REMOVED******REMOVED******REMOVED***',
    forceOfflineDB: false,
    proxies: proxies,
    privacy: false,
    android_ua: 'Android 8.0.0; O; sdk=26; ***REMOVED*** android-55/5.5',
    chrome_ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
    proxy: proxies[0],
    captchaProxy: proxies[0],
    logPrefix: 'name', // cid -- email -- name -- msisdn
    enableServer: false,
    giftcardsLimit: 0,
    enableUpdateLog: true,
    version: 1.0

};