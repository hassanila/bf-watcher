process.env.UV_THREADPOOL_SIZE = 128;
NODE_TLS_REJECT_UNAUTHORIZED=0;

// If having problem with encoded response as unicode, use encoding: 'binary',

let config = require('../config.js'),
    https = require('https'),
    http = require('http'),
    request = require('requestretry').defaults({
        maxAttempts: 2,
        retryDelay: 5000,
        proxy: config.proxy,
        strictSSL: false,
        rejectUnauthorized: false,
        timeout: 30000,
        headers: {
            'User-Agent': config.chrome_ua
        }
    }),
    colors = require('colors'),
    mysql = require('mysql'),
    filenamify = require('filenamify'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    CronJob = require('cron').CronJob,
    cheerio = require('cheerio'),
    async = require('async'),
    express = require('express'),
    app = express(),
    timesyncServer = require('timesync/server'),
    mysqlConnection = mysql.createPool(config.mysql),
    getRandomValues = require('get-random-values'),
    CryptoJS = require("crypto-js"),
    publicIp = require('public-ip'),
    readline = require('readline'),
    WebSocket = require('ws'),
    hrstart = process.hrtime(),
    oneDayHasPassed = function () {
        var passedSeconds = process.hrtime(hrstart)[0];

        if (passedSeconds > (60 * 60 * 24) - 60) {
            hrstart = process.hrtime();
        }


        return (passedSeconds > (60 * 60 * 24) - 60 || passedSeconds < 30);
    },
    emailTemplate = fs.readFileSync(__dirname + '/emailTemp.html').toString(),
    htmlTemplate = fs.readFileSync(__dirname + '/index.html').toString(),
    statusHtmlTemplate = fs.readFileSync(__dirname + '/status.html').toString(),
    logFileStream = fs.openSync('../log.txt', 'a'),
    sentErrors = [],
    startDateTime = getDateTime();

let accountSid = '***REMOVED***';
let authToken = '***REMOVED***';
let twilio = require('twilio');
let client = twilio(accountSid, authToken);
let VoiceResponse = twilio.twiml.VoiceResponse;
let bodyParser = require('body-parser');

// 24hrs
setInterval(() => {
    sentErrors = [];
}, 1000 * 60 * 60 * 24);

let trueLog = console.log;
console.log = function (...msg) {
    trueLog(...msg);
    msg = String(msg);

    // remove color from string to log
    fs.writeSync(logFileStream, msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') + '\n');


};
process.on('uncaughtException', function (error) {

    var time = getDateTime();
    console.log((time + '   ERROR: ' + error.stack).red);
    process.exit(1);
});


if (!fs.existsSync(config.logsPath)) {
    fs.mkdirSync(config.logsPath);
}


Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};
Array.prototype.remove = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};
String.prototype.contains = function (...args) {
    return args.some(function (arg) {
        arg = RegExp.escape(arg);
        return this.search(new RegExp(arg, "i")) > -1;
    }, this)
};
RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
Array.prototype.removeDuplicates = function () {
    var m = {}, newarr = [];
    for (var i = 0; i < this.length; i++) {
        var v = this[i];
        if (!m[v]) {
            newarr.push(v);
            m[v] = true;
        }
    }
    return newarr;
};
RegExp.prototype.matchAll = function (string) {
    var matches = [];
    var match = null;

    while ((match = this.exec(string)) !== null) {
        matches.push(match[1] || match[2]);
    }

    return matches.removeDuplicates();
};
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    find = RegExp.escape(find);

    return str.replace(new RegExp(find, 'g'), replace);
};
String.prototype.hashCode = function () {
    var hash = 0, i = 0, len = this.length;
    while (i < len) {
        hash = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
    }
    return hash != 0 ? (hash + 2147483647) + 1 : 0;
};

let permanentlyExcluded = [
    'sollentunahem',
    'telge'
];


let check = {
    errorsObj: {},
    lastCheckedObj: {},
    dbAva***REMOVED***ble: [],
    excludedIDs: [],
    ava***REMOVED***ble: [],
    currentlyRunning: false,
    init: function (cb, toIncludeArr, toExcludeArr, log) {

        toExcludeArr = toExcludeArr || config.sitesToExclude;
        //toIncludeArr = toIncludeArr || [];

        //check.errorsObj = {};
        check.dbAva***REMOVED***ble = [];
        check.excludedIDs = check.excludedIDs || [];
        check.ava***REMOVED***ble = [];

        initDB(function (status, dbAva***REMOVED***ble) {
            check.dbAva***REMOVED***ble = typeof dbAva***REMOVED***ble !== "undefined" ? dbAva***REMOVED***ble : check.dbAva***REMOVED***ble;


            check.dbAva***REMOVED***ble = check.dbAva***REMOVED***ble
                .filter(apartment => !(toExcludeArr.contains(apartment.site)))
                .map(function (apartment) {
                    apartment = Object.assign({}, apartment);
                    apartment.info = JSON.parse(apartment.info);
                    return apartment;
                });

            return typeof cb == "function" ? cb(status) : null;
        }, log);
    },
    all: function (cb, toIncludeArr, toExcludeArr, log) {
        if (typeof cb !== "function") {
            cb = check.process;
        }

        toExcludeArr = toExcludeArr || config.sitesToExclude;
        toIncludeArr = toIncludeArr || [];
        var apartmentsArr = [];
        let allExcludedSites = (permanentlyExcluded.concat(config.sitesToExclude).concat(toExcludeArr)).removeDuplicates();

        if (config.sitesToExclude.contains('*')) {

            for (var prop in check) {

                if (!(['init', 'all', 'done', 'error', 'process', 'errorsObj', 'dbAva***REMOVED***ble', 'excludedIDs', 'ava***REMOVED***ble', 'lastCheckedObj', 'currentlyRunning'].contains(prop))) {
                    check.lastCheckedObj[prop] = check.lastCheckedObj[prop] || {};
                    check.lastCheckedObj[prop]['status'] = 'excluded';
                }
            }
            console.log('all() Excluding all sites!'.red);
            cb(apartmentsArr, null, toIncludeArr, toExcludeArr, log);

            return;
        }

        if (check.currentlyRunning) {
            return cb(apartmentsArr, null, toIncludeArr, toExcludeArr, log, check.currentlyRunning);
        }

        check.currentlyRunning = true;

        toExcludeArr.forEach(site => console.log(('Excluding: ' + site).red));

        var allList = [];
        var hour = (new Date()).getHours();
        var toExclude = ['init', 'all', 'done', 'error', 'process', 'errorsObj', 'dbAva***REMOVED***ble', 'excludedIDs', 'ava***REMOVED***ble', 'lastCheckedObj', 'currentlyRunning'].concat(allExcludedSites);
        for (var prop in check) {

            if (allExcludedSites.contains(prop)) {
                check.lastCheckedObj[prop] = check.lastCheckedObj[prop] || {};
                check.lastCheckedObj[prop]['status'] = 'excluded';
            }

            if (check.hasOwnProperty(prop) && !(toExclude.contains(prop))) {
                if (!(toIncludeArr.length) || toIncludeArr.contains(prop)) {

                    if (toIncludeArr.length || hour == 13 || prop != 'wahlin') {
                        allList.push(check[prop]);
                    }
                }
            }
        }

        check.init(function (status) {
            if (status == true) {
                async.parallel(allList, function (err, resultsArr) {
                    // Process Results

                    resultsArr.forEach(siteArr => {
                        if (typeof siteArr !== "undefined") {
                            apartmentsArr = apartmentsArr.concat(siteArr);
                        }
                    });

                    check.currentlyRunning = false;

                    check.ava***REMOVED***ble = apartmentsArr;
                    cb(apartmentsArr, null, toIncludeArr, toExcludeArr, log);
                });
            } else {
                console.log('SKIPPING CHECK: DB NOT CONNECTED!\n'.red);
                //allJob.stop();
                //wahlinJob.stop();

                check.currentlyRunning = false;
                cb(apartmentsArr, null, toIncludeArr, toExcludeArr, log);
            }
        }, toIncludeArr, toExcludeArr, log);

    },
    done: function (cb, funcName, localApartments, err) {
        localApartments = localApartments === "undefined" ? [] : localApartments;


        if (config.debug) {
            console.log('done: ' + funcName);
        }


        if (!(check.errorsObj.hasOwnProperty(funcName))) {
            check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};

            if (typeof err !== "undefined") {
                check.lastCheckedObj[funcName]['status'] = 'error';
                check.errorsObj[funcName] = err;
            } else {
                check.lastCheckedObj[funcName]['status'] = 'checked';
            }
            return typeof cb == "function" ? cb(null, localApartments) : null;
        }
    },
    error: function (funcName, err, cb) {
        err = typeof err === "undefined" ? " :UNDEFINED: " : err;
        err = getDateTime() + ' ' + err;
        if (config.debug) {
            console.log('error: ' + funcName);
        }
        check.done(cb, funcName, [], err);
        //return check.errorsObj[funcName] = err;
    },
    process: function (ava***REMOVED***ble, cb, toIncludeArr, toExcludeArr, log, currentlyRunning) {
        check.ava***REMOVED***ble = typeof ava***REMOVED***ble === "object" ? ava***REMOVED***ble : check.ava***REMOVED***ble;
        currentlyRunning = typeof currentlyRunning !== "undefined" ? currentlyRunning : check.currentlyRunning;

        toIncludeArr = toIncludeArr || [];
        toExcludeArr = toExcludeArr || config.sitesToExclude;

        if (config.debug) {
            console.log('\nprocess() check.ava***REMOVED***ble = \n');
            console.table(check.ava***REMOVED***ble);
        }

        var processDone = function () {
            if (config.debug) {
                //console.log('\nAll Done!'.cyan);
            }
            return typeof cb == "function" ? cb(ava***REMOVED***ble, currentlyRunning) : null;
        };

        if (currentlyRunning) {
            return processDone();
        }

        if (config.sitesToExclude.contains('*')) {
            processDone();
            return console.log('process() Excluding all sites!'.red)
        }

        // if room price = 0

        for (var site in check.errorsObj) {
            if (check.errorsObj.hasOwnProperty(site) && (!(toIncludeArr.length) || toIncludeArr.contains(site))) {
                check.dbAva***REMOVED***ble = check.dbAva***REMOVED***ble.filter(apartment => !(site == apartment.site));
                check.ava***REMOVED***ble = check.ava***REMOVED***ble.filter(apartment => !(site == apartment.site));

                console.log(('Skipped ' + site + ': ' + check.errorsObj[site]).red);
            }
        }

        var apartmentsToRemove = check.dbAva***REMOVED***ble.filter(function (dbApartment) {

            if (toExcludeArr.contains(dbApartment.site) || (toIncludeArr.length && !(toIncludeArr.contains(dbApartment.site)))) {
                return false;
            } else {
                return !(check.ava***REMOVED***ble.some(apartment => apartment.id === dbApartment.id));
            }
        });

        var newApartments = [];


        check.ava***REMOVED***ble = check.ava***REMOVED***ble
            .filter(apartment => !(check.excludedIDs.contains(apartment.id)))
            .sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


        check.ava***REMOVED***ble.forEach(function (apartment) {
            if (!(check.dbAva***REMOVED***ble.some(e => e.id === apartment.id))) {
                if ((!(toIncludeArr.length) || toIncludeArr.contains(apartment.site)) && !(toExcludeArr.contains(apartment.site))) {
                    newApartments.push(apartment);

                    if (!(apartmentIsInvalid(apartment.id, apartment.price, apartment.rooms, apartment.area))) {
                        check.dbAva***REMOVED***ble.push(apartment);
                    }
                }
            }
        });

        var addmysqlQuery = '';
        var removesqlQuery = '';
        if (newApartments.length > 0) {
            console.log(getDateTime() + '   ' + newApartments.length + ' New Ad' + (newApartments.length > 1 ? 's' : '') + '!' + (apartmentsToRemove.length ? ' & ' + apartmentsToRemove.length + ' Ad' + (apartmentsToRemove.length > 1 ? 's' : '') + ' Removed!' : ''));


            let errorEmailArr = [];

            newApartments = newApartments.filter(function (apartment, i) {
                console.log(getDateTime() + '   NEW: ' + apartment.site + ': ' + apartment.id);

                if (apartmentIsInvalid(apartment.id, apartment.price, apartment.rooms, apartment.area)) {
                    if (apartment.price < 1000 || apartment.price > 30000) {
                        console.log((getDateTime() + ' ' + apartment.site + ' ' + apartment.id + ' Price < 1000kr || Price > 30000kr   .price=' + String(apartment.price)).red);
                        errorEmailArr.push(apartment.site + ' <a href="' + apartment.url + '">' + apartment.id + '</a> Price < 1000kr || Price > 30000kr   .price=' + String(apartment.price));
                    }
                    if (apartment.rooms < 1 || apartment.rooms > 8) {
                        console.log((getDateTime() + ' ' + apartment.site + ' ' + apartment.id + ' Rooms < 1rum || Rooms > 8rum   .rooms=' + String(apartment.rooms)).red);
                        errorEmailArr.push(apartment.site + ' <a href="' + apartment.url + '">' + apartment.id + '</a> Rooms < 1rum || Rooms > 8rum   .rooms=' + String(apartment.rooms));
                    }
                    if (apartment.area < 10 || apartment.area > 200) {
                        console.log((getDateTime() + ' ' + apartment.site + ' ' + apartment.id + ' Area < 10 || Area > 200   .area=' + String(apartment.area)).red);
                        errorEmailArr.push(apartment.site + ' <a href="' + apartment.url + '">' + apartment.id + '</a> Area < 10 || Area > 200   .area=' + String(apartment.area));
                    }

                    return false;
                } else {
                    addmysqlQuery += `('${apartment.id}', '${apartment.site}', '${apartment.price}', '${apartment.rooms}', '${apartment.area}', '${apartment.url}', '${apartment.type}', '${apartment.added}', '${JSON.stringify(apartment.info)}'),`;
                }


                if (i == newApartments.length - 1 && addmysqlQuery.length) {
                    DB("INSERT INTO ava***REMOVED***ble (id, site, price, rooms, area, url, type, added, info) VALUES " + addmysqlQuery.slice(0, -1) + " ON DUPLICATE KEY UPDATE id=id", function (err) {
                        if (err) {
                            console.log("DB ADD ERROR");
                        }
                    });
                    //processDone();
                }

                return true;
            });

            if (errorEmailArr.length > 0) {
                sendErrorEmail(errorEmailArr.join('\n'))
            }

            var userApartmentsObj = {};

            config.users.forEach(function (user, i) {
                if (typeof user.email !== "undefined" && (user.email).length > 0 && user.notify) {
                    userApartmentsObj[user.email] = [];
                    newApartments.forEach(function (apartment) {
                        if (user.check && !(user.sitesToExclude.contains(apartment.site)) && !(user.sitesToExclude.contains(apartment.site + ':' + apartment.type)) && apartment.rooms > user.auto.hhem.minRooms - 1 && user.types.contains(apartment.type) && apartment.price < config.roomsMaxPrices[apartment.rooms] + 1) {
                            userApartmentsObj[user.email].push(apartment);
                        }
                    });
                }


                if (i == config.users.length - 1) {

                    for (var email in userApartmentsObj) {
                        //var htmlLinks = '';

                        if (userApartmentsObj.hasOwnProperty(email) && userApartmentsObj[email].length) {

                            var userApartments = userApartmentsObj[email]
                                .sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));
                            var editedEmailTemp = emailTemplate;

                            var html = '<tbody>';
                            for (var index = 0; index < userApartments.length; index++) {
                                html += '<tr>';
                                html += '<td class="column1"><a draggable="false" ' + (userApartments[index].type == "fast" || userApartments[index].type == "sigtuna" ? 'style="color:red; "' : ' ') + 'href="' + (userApartments[index].info.idUrl || userApartments[index].url) + '" target="_blank">' + userApartments[index].id + '</a></td>';
                                html += '<td class="column2">' + userApartments[index].price + ':-</td>';
                                html += '<td class="column3">' + userApartments[index].rooms + ' Rum</td>';
                                html += '<td class="column4"><a draggable="false" rel="noopener noreferrer" target="_blank" href="' + (config.homepagesObj[userApartments[index].site] || 'https://www.google.com/search?q=' + userApartments[index].site) + '"><img draggable="false" alt="' + userApartments[index].site + '" src="img/png/small/' + userApartments[index].site + '.png"></a></td>';
                                html += '</tr>';

                            }
                            html += '</tbody>';


                            editedEmailTemp = editedEmailTemp.replace('{TBODY}', html);


                            var imgHost = 'https://***REMOVED******REMOVED***.com/bf-watcher/';
                            var regex = /<img.*?src="(.*?)".*?>|<link.*?href="(.*?)".*?>/g;
                            var imgUrlsArr = regex.matchAll(editedEmailTemp);
                            var attachmentsArr = [];

                            imgUrlsArr.forEach(url => {

                                if (config.embedEmailImages) {
                                    editedEmailTemp = editedEmailTemp.replaceAll(url, 'cid:' + url);
                                    if (fs.existsSync(__dirname + '/' + url)) {
                                        attachmentsArr.push({
                                            filename: url,
                                            path: __dirname + '/' + url,
                                            cid: url //same cid value as in the html img src
                                        })
                                    } else {
                                        console.log(('imagefile: ' + __dirname + '/' + url + ' doesn\'t exist').red)
                                    }
                                } else {
                                    editedEmailTemp = editedEmailTemp.replaceAll(url, imgHost + url);
                                }
                            });


                            sendEmail({
                                from: '"BF Watcher" <***REMOVED***acc1@gmail.com>', // sender address
                                to: email, //'***REMOVED******REMOVED***97@gmail.com'
                                subject: 'BF Watcher ✔', // Subject line
                                html: editedEmailTemp, // html body
                                attachments: attachmentsArr
                            }, function (success, emailsArr) {

                                if (!success) {
                                    return console.log('EMAIL ERROR');
                                }

                                if (config.debug) {
                                    console.log('E-mail sent to ' + emailsArr[0] + '\n');
                                }
                            });
                        }
                    }


                }
            });

        } else {
            if (log) {
                console.log(getDateTime() + '   Inga nya lägenheter!');
            }
            if (apartmentsToRemove.length) {
                console.log(getDateTime() + '   ' + apartmentsToRemove.length + ' Ad' + (apartmentsToRemove.length > 1 ? 's' : '') + ' Removed!');
            }
            //processDone();
        }
        if (apartmentsToRemove.length > 0) {
            apartmentsToRemove.forEach(function (apartment, i) {
                console.log(getDateTime() + '   REMOVED: ' + apartment.site + ': ' + apartment.id);
                check.dbAva***REMOVED***ble = check.dbAva***REMOVED***ble.filter(function (dbApartment) {
                    return !(dbApartment.id == apartment.id)
                });

                removesqlQuery += "'" + apartment.id + "',";

                if (i == apartmentsToRemove.length - 1) {


                    DB("INSERT IGNORE INTO removed (id, site, price, rooms, area, url, type, added, removed, info) SELECT id, site, price, rooms, area, url, type, added, '" + getDateTime() + "', info FROM ava***REMOVED***ble WHERE id IN (" + removesqlQuery.slice(0, -1) + ")", function (err) {
                        if (err) {
                            return console.log('DB REMOVE ERROR');
                        }

                        DB("DELETE FROM ava***REMOVED***ble WHERE id IN (" + removesqlQuery.slice(0, -1) + ")");

                    });


                }
            });
        }

        processDone();
    },
    bf: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        delete check.errorsObj[funcName];

        try {

                request({
                uri: 'https://login001.stockholm.se/siteminderagent/forms/login.fcc',
                method: "POST",
                headers: {
                    "Origin": "https://bostad.stockholm.se",
                    "Referer": "https://bostad.stockholm.se/Minasidor/login/",
                },
                jar: cookies,
                form: {
                    "target": "-SM-https://bostad.stockholm.se/secure/login",
                    "smauthreason": 0,
                    "smagentname": "bostad.stockholm.se",
                    "USER": '***REMOVED******REMOVED***97@gmail.com',
                    "PASSWORD": '***REMOVED******REMOVED******REMOVED***'
                },
            }, function (err, res, body) {
                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 302) {
                    let errorText = 'statuscode != 302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (res.statusCode == 200) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                }

                request({
                    uri: 'https://bostad.stockholm.se/Lista/AllaAnnonser',
                    method: "GET",
                    headers: {
                        'Accept-Language': '*'
                    },
                    followRedirect: false,
                    jar: cookies
                }, function (err, res, body) {

                    if (err) {
                        return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                    } else if (res.statusCode != 200) {
                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                        if (isRedirect(res.statusCode)) {
                            sendErrorEmail(funcName + ' \n' + errorText);
                        }
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, errorText, mainCB);
                    } else if (!body) {
                        return check.error(funcName, ' body is empty', mainCB);
                    }

                    try {
                        var ads = JSON.parse(body);
                    } catch (e) {
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                    }

                    if (!(ads.length)) {
                        return check.done(mainCB, funcName, localApartments);
                    }

                    var apartmentsCount = 0;

                    ads.forEach(function (ad) {


                        if (ad['Bostadssnabben'] || (ad['Ungdom'] && ad['KanAnmalaIntresse'] && !(config.locationsToExclude[funcName].contains(ad['Kommun'])) && !(ad['Korttid'])) || (ad['Kommun'] === 'Sigtuna' && !(ad['Korttid']))) {


                            var id = String(ad['AnnonsId']);

                            if (!(check.dbAva***REMOVED***ble.some(apartment => apartment.id == id)) && !(check.excludedIDs.contains(id))) {

                                request({
                                    uri: 'https://bostad.stockholm.se' + ad['Url'],
                                    method: "GET",
                                    headers: {
                                        'Accept-Language': '*'
                                    },
                                    followRedirect: false,
                                    jar: cookies
                                }, function (err, res, body) {

                                    if (err) {
                                        return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return check.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return check.error(funcName, ' body is empty', mainCB);
                                    }

                                    var $ = cheerio.load(body);
                                    // ungdom korttid
                                    var typeTextsArr = $('.mainHeading.object span.m-tag').map(function () {
                                        return $(this).text().toLowerCase().trim();
                                    }).toArray();


                                    if (!(typeTextsArr.contains('ungdom korttid'))) {

                                        var price = !(isNaN(parseInt(ad['Hyra']))) ? parseInt(ad['Hyra']) : parseInt($('#objFacts > div > div:nth-child(5) > div.v').eq(0).text().split('-')[0].replace(/\D/g, ''));
                                        var area = !(isNaN(parseInt(ad['Yta']))) ? parseInt(ad['Yta']) : parseInt($('#objFacts > div > div:nth-child(4) > div.v').eq(0).text().split('-')[0].replace(/\D/g, ''));
                                        var rooms = !(isNaN(parseInt(ad['AntalRum']))) ? parseInt(ad['AntalRum']) : parseInt($('#objFacts > div > div:nth-child(3) > div.v').eq(0).text().split('-')[0].replace(/\D/g, ''));

                                        if (apartmentIsInvalid(id, price, rooms, area)) {
                                            console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        }

                                        localApartments.push({
                                            id: id,
                                            site: funcName,
                                            rooms: rooms || 0,
                                            price: price || 0,
                                            area: area || 0,
                                            url: 'https://bostad.stockholm.se' + ad['Url'],
                                            added: dateTimeCache,
                                            type: ad['Bostadssnabben'] ? 'fast' : (ad['Kommun'] === 'Sigtuna' ? 'sigtuna' : 'normal'),
                                            info: {}
                                        });
                                    } else {
                                        //DB("INSERT INTO excluded (id) VALUES ('" + id + "')");
                                        check.excludedIDs.push(id);
                                    }

                                    if (++apartmentsCount == ads.length) {
                                        return check.done(mainCB, funcName, localApartments);
                                    }


                                });


                            } else {

                                if (!(check.excludedIDs.contains(id))) {

                                    var dbApartment = check.dbAva***REMOVED***ble.find(apartment => apartment.id == id);

                                    if (dbApartment) {
                                        localApartments.push(dbApartment);
                                    }
                                }

                                if (++apartmentsCount == ads.length) {
                                    return check.done(mainCB, funcName, localApartments);
                                }

                            }

                        } else if (++apartmentsCount == ads.length) {
                            return check.done(mainCB, funcName, localApartments);
                        }


                    });
                });

            });
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }
    },
    hhem: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        delete check.errorsObj[funcName];

        // GET https://bostad.hasselbyhem.se/HSS/Object/object_list.aspx?objectgroup=1&action=Ava***REMOVED***ble
        // error on empty, capture it and remove useless get and post

        try {

            /* request({
                 uri: 'https://bostad.hasselbyhem.se/HSS/Default.aspx',
                 method: "GET",
                 headers: {
                     'Origin': 'https://bostad.hasselbyhem.se',
                 },
                 followRedirect: false,
                 jar: cookies,
             }, function (err, res, body) {
                 if (err) {
                     return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                 } else if (res.statusCode != 200) {
                     let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                     if (isRedirect(res.statusCode)) {
                         sendErrorEmail(funcName + ' \n' + errorText);
                     }
                     writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                     return check.error(funcName, errorText, mainCB);
                 } else if (!body) {
                     return check.error(funcName, ' body is empty', mainCB);
                 }


                 if (!(body.contains('$btnAva***REMOVED***bleApartments'))) {

                     if (typeof sent === "undefined") {
                         sendErrorEmail('HHEM EMPTY APARTMENTSLIST');
                         sent = true;
                     }

                     return check.done(mainCB, funcName, localApartments);
                 }

                 var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                 var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                 var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                 if (!(eventvalidation && viewstate && viewstategenerator)) {
                     return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                 }

                 request({
                     uri: 'https://bostad.hasselbyhem.se/HSS/Default.aspx',
                     method: "POST",
                     headers: {
                         'Origin': 'https://bostad.hasselbyhem.se',
                         'Referer': 'https://bostad.hasselbyhem.se/HSS/Default.aspx',
                     },
                     followAllRedirects: true,
                     jar: cookies,
                     form: {
                         '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ListAva***REMOVED***ble1$btnAva***REMOVED***bleApartments',
                         '__EVENTARGUMENT': '',
                         '__VIEWSTATE': viewstate,
                         '__VIEWSTATEGENERATOR': viewstategenerator,
                         '__EVENTVALIDATION': eventvalidation,
                         'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                         'ctl00$ctl01$SearchSimple$txtSearch': '',
                         'ctl00$ctl01$hdnBrowserCheck': ''
                     },
                 }, function (err, res, body) {
                     */

            request({
                uri: 'https://bostad.hasselbyhem.se/HSS/Object/object_list.aspx?&objectgroup=1',
                method: "GET",
                headers: {
                    'Origin': 'https://bostad.hasselbyhem.se',
                    'Referer': 'https://bostad.hasselbyhem.se/HSS/Default.aspx',
                },
                jar: cookies
            }, function (err, res, body) {

                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (res.request._redirect.redirects.length > 1) {
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                if (!(eventvalidation && viewstate && viewstategenerator)) {
                    return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                }

                var $ = cheerio.load(body);

                var noOfPages = parseInt($('div.navbar [id$=_lblNoOfPages]').eq(0).text().replace(/\D/g, '') || 1);
                var bodysArr = [body];
                var functionList = [];


                var processPages = function processPages(bodysArr, cb) {

                    if (typeof bodysArr !== "object" || !bodysArr.length || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    var pageCount = 0;

                    bodysArr.forEach(function (pageBody) {
                        if (check.errorsObj.hasOwnProperty(funcName)) {
                            return;
                        }

                        var ava***REMOVED***bleArr = extractBetweenStrings(pageBody, 'ObjectDetailsTemplateB.aspx?cmguid=', '">');
                        var $ = cheerio.load(pageBody);
                        var apartments = $('.gridlist [class^=listitem]');


                        if (!(apartments.length) && pageCount == bodysArr.length - 1) {
                            return cb();
                        } else if (!(apartments.length)) {
                            return pageCount++;
                        }

                        var apartmentsCount = 0;

                        apartments.each(function (i) {

                            if (check.errorsObj.hasOwnProperty(funcName)) {
                                return false;
                            }

                            var url = 'https://bostad.hasselbyhem.se/HSS/Object/ObjectDetailsTemplateB.aspx?cmguid=' + (ava***REMOVED***bleArr[i].replace(/&amp;/g, '&'));
                            var interestAmount = parseInt(apartments.eq(i).find('[id$=ObjectInterestCount]').eq(0).text()) || 0;

                            var apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                                if (dbApartment.url == url && dbApartment.price > 0) {
                                    dbApartment.interestAmount = interestAmount;
                                    dbApartment.info.idUrl = 'https://bostad.hasselbyhem.se/HSS/Object/ObjectDetailsTemplateB.aspx?id=' + dbApartment.id;
                                    localApartments.push(dbApartment);
                                    return true;
                                }
                                return false;
                            });

                            if (!apartmentinDb) {
                                request({
                                    uri: url,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://bostad.hasselbyhem.se',
                                    },
                                    followRedirect: false,
                                    jar: cookies

                                }, function (err, res, body) {
                                    if (err) {
                                        return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return check.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return check.error(funcName, ' body is empty', mainCB);
                                    }

                                    var $ = cheerio.load(body);


                                    var id = $('[id$="ulObjectID"] > li.right').eq(0).text().trim();

                                    var price = 0;
                                    try {
                                        price = parseInt($('[id$="trCost"]').eq(0).text().replace(/\D/g, '') || $('[id$=Description]').eq(0).text().split('OBS')[1].split('kr')[0].replace(/\D/g, ''));
                                    } catch (e) {

                                        sendErrorEmail(funcName + '  ' + id + ': price invalid')

                                    }


                                    let rooms = parseInt($('[id$="ulFlatNo"]').eq(0).next().text().replace(/\D/g, '')) || 0;
                                    let area = parseInt($('[id$="ulSize"]').eq(0).text().replace(/\D/g, '')) || 0;


// https://bostad.hasselbyhem.se/HSS/Object/ObjectDetailsTemplateB.aspx?id=5019-4934


                                    if (apartmentIsInvalid(id, price, rooms, area)) {
                                        console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    }

                                    localApartments.push({
                                        id: id,
                                        site: funcName,
                                        rooms: rooms,
                                        price: price,
                                        area: area,
                                        url: url,
                                        added: dateTimeCache,
                                        interestAmount: interestAmount,
                                        type: 'normal',
                                        info: {
                                            idUrl: 'https://bostad.hasselbyhem.se/HSS/Object/ObjectDetailsTemplateB.aspx?id=' + id
                                        }
                                    });

                                    if (++apartmentsCount == apartments.length) {

                                        if (pageCount == bodysArr.length - 1) {
                                            return cb();
                                        } else {
                                            pageCount++;
                                        }
                                    }

                                });
                            } else if (++apartmentsCount == apartments.length) {

                                if (pageCount == bodysArr.length - 1) {
                                    return cb();
                                } else {
                                    pageCount++;
                                }
                            }

                        })
                    })

                };
                var getPage = function getPage(pageNr, cb) {

                    if (isNaN(pageNr) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    let index = 0;

                    if (noOfPages < 6 || pageNr < 4) {
                        index = pageNr-1
                    } else if (noOfPages - pageNr === 0) {
                        index = 4;
                    } else {
                        index = 3;
                    }

                    request({
                        uri: 'https://bostad.hasselbyhem.se/HSS/Object/object_list.aspx?objectgroup=1&action=Ava***REMOVED***ble',
                        method: "POST",
                        headers: {
                            'Origin': 'https://bostad.hasselbyhem.se',
                            'Referer': 'https://bostad.hasselbyhem.se/HSS/Object/object_list.aspx?objectgroup=1&action=Ava***REMOVED***ble',
                        },
                        followAllRedirects: true,
                        jar: cookies,
                        form: {
                            '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ucNavBar$rptButtons$ctl' + String((index)).padStart(2, '0') + '$btnPage',
                            '__EVENTARGUMENT': '',
                            '__VIEWSTATE': viewstate,
                            '__VIEWSTATEGENERATOR': viewstategenerator,
                            '__EVENTVALIDATION': eventvalidation,
                            'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                            'ctl00$ctl01$SearchSimple$txtSearch': '',
                            'ctl00$ctl01$hdnBrowserCheck': ''
                        },
                    }, function (err, res, body) {

                        if (err) {
                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                        } else if (res.statusCode != 200) {
                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                            if (isRedirect(res.statusCode)) {
                                sendErrorEmail(funcName + ' \n' + errorText);
                            }
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, errorText, mainCB);
                        } else if (res.request._redirect.redirects.length > 1) {
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                        } else if (!body) {
                            return check.error(funcName, ' body is empty', mainCB);
                        }

                        eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                        viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                        viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                        }

                        bodysArr.push(body);

                        if (bodysArr.length == noOfPages) {
                            return cb();
                        }
                    })
                };


                for (let i = 1; i < noOfPages; i++) {
                    functionList.push(function (cb) {
                        getPage((i + 1), cb);
                    })
                }


                async.series(functionList, function () {
                    processPages(bodysArr, function () {
                        if (!(check.errorsObj.hasOwnProperty(funcName))) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    });
                });


            })
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


    },
    heimstaden: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        //var emailSentNewLocations = [];
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        delete check.errorsObj[funcName];


        try {
            request({
                uri: 'https://mitt.heimstaden.com/HSS/Object/object_list.aspx',
                method: "GET",
                followRedirect: false,
                jar: cookies,
                qs: {
                    objectgroup: 1,
                    marketarea: 'AREA_1345',
                    selectedarea: 'Vällingby'
                },
            }, function (err, res, body) {

                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                let eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0],
                    viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0],
                    viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                if (!(eventvalidation && viewstate && viewstategenerator)) {
                    return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                }

                var $ = cheerio.load(body);

                var noOfPages = parseInt($('div.navbar [id$=_lblNoOfPages]').eq(0).text().replace(/\D/g, '')) || 1;
                var bodysArr = [body];
                var functionList = [];
                var noAdsOnPage = false;


                let processPages = function processPages(bodysArr, cb) {


                    if (typeof bodysArr !== "object" || !(bodysArr.length) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    var pageCount = 0;

                    bodysArr.forEach(function (pageBody, pageIndex) {
                        var $ = cheerio.load(pageBody);
                        var apartments = $('[id$=ObjectList_Container] tr[class^=listitem]:has(.gridcell)');

                        apartments = apartments.filter(function (i) {
                            return true;
                            return apartments.eq(i).find('[id$=_AreaName]').eq(0).text().contains('tensta');
                        });



                        if (!(apartments.length) && pageIndex == bodysArr.length - 1) {
                            return cb();
                        } else if (!(apartments.length)) {
                            return;
                        }

                        var apartmentsCount = 0;

                        apartments.each(function (i) {
                            if (check.errorsObj.hasOwnProperty(funcName)) {
                                return false;
                            }

                            var url = 'https://mitt.heimstaden.com/' + apartments.eq(i).find('[id$="ObjectDetailsUrl"]').eq(0).attr('href').substring(6);
                            var rooms = parseInt(apartments.eq(i).find('[id$="NoOfRooms"]').eq(0).text().replace(/\D/g, '')) || 0;

                            var apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                                if (dbApartment.url == url && dbApartment.price > 0) {
                                    localApartments.push(dbApartment);
                                    return true;
                                }
                                return false;
                            });

                            if (!apartmentinDb) {

                                let id = url.split('/').pop();
                                let price = parseInt(apartments.eq(i).find('.gridcell').eq(5).text().replace(/\D/g, '')) || 0;
                                let area = parseInt(apartments.eq(i).find('.gridcell').eq(4).text().replace(/\D/g, '')) || 0;

                                if (apartmentIsInvalid(id, price, rooms, area)) {
                                    console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                }

                                localApartments.push({
                                    id: id,
                                    site: funcName,
                                    rooms: rooms,
                                    price: price,
                                    area: area,
                                    url: url,
                                    added: dateTimeCache,
                                    type: 'normal',
                                    info: {}
                                });


                                if (++apartmentsCount == apartments.length) {

                                    if (pageCount == bodysArr.length - 1) {
                                        return cb();
                                    } else {
                                        pageCount++;
                                    }
                                }

                            } else if (++apartmentsCount == apartments.length) {

                                if (pageCount == bodysArr.length - 1) {
                                    return cb();
                                } else {
                                    pageCount++;
                                }
                            }

                        })
                    })

                };
                let getPage = function getPage(pageNr, cb) {

                    if (noAdsOnPage || isNaN(pageNr) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    let index = 0;

                    if (noOfPages < 6 || pageNr < 4) {
                        index = pageNr-1
                    } else if (noOfPages - pageNr === 0) {
                        index = 4;
                    } else {
                        index = 3;
                    }





                    request({
                        uri: 'https://mitt.heimstaden.com/HSS/Object/object_list.aspx',
                        method: "POST",
                        headers: {
                            'Referer': 'https://mitt.heimstaden.com/HSS/Object/object_list.aspx',
                            'Origin': 'https://mitt.heimstaden.com/',
                        },
                        qs: {
                            objectgroup: 1,
                            marketarea: 'AREA_1345',
                            selectedarea: 'Vällingby'
                        },
                        followAllRedirects: true,
                        jar: cookies,
                        form: {
                            '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ucNavBar$rptButtons$ctl' + String((index)).padStart(2, '0') + '$btnPage',
                            '__EVENTARGUMENT': '',
                            '__VIEWSTATE': viewstate,
                            '__VIEWSTATEGENERATOR': viewstategenerator,
                            '__EVENTVALIDATION': eventvalidation,
                            /*'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$35': 'AREA_777', // Tensta
                            'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$5': 'AREA_771',
                            'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$28': 'AREA_725',
                            'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$29': 'AREA_776',*/
                            'ctl00$ctl01$hdnRequestVerificationToken': ''
                        },
                    }, function (err, res, body) {

                        if (err) {
                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                        } else if (res.statusCode != 200) {
                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                            if (isRedirect(res.statusCode)) {
                                sendErrorEmail(funcName + ' \n' + errorText);
                            }
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, errorText, mainCB);
                        } else if (res.request._redirect.redirects.length > 1) {
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                        } else if (!body) {
                            return check.error(funcName, ' body is empty', mainCB);
                        }

                        eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                        viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                        viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                        }

                        bodysArr.push(body);

                        // return false if no ads on a page, this to abort async.series getting empty pages
                        var $ = cheerio.load(body);
                        if (!($('[id$="ObjectList_Container"] tr[class^="listitem"]').length)) {
                            console.log((getDateTime() + ' ' + funcName + ': no ads on page ' + pageNr).red);
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            sendErrorEmail(funcName + ': no ads on page ' + pageNr);
                            noAdsOnPage = true;
                            return cb();
                        }

                        return cb();
                    })
                };


                for (let i = 1; i < noOfPages; i++) {
                    functionList.push(function (cb) {
                        getPage((i + 1), cb);
                    })
                }


                async.series(functionList, function () {
                    processPages(bodysArr, function () {
                        if (!(check.errorsObj.hasOwnProperty(funcName))) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    });
                });


            });
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


        /*

                request({
                    uri: 'https://minasidor.victoriapark.se/ledigt/sok/lagenhet',
                    method: "GET",
                    headers: {
                        'Origin': 'https://minasidor.victoriapark.se',
                    },
                    followRedirect: false,
                    jar: cookies,
                }, function (err, res, body) {


                    if (err) {
                        return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                    } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, errorText, mainCB);
                    } else if (!body) {
                        return check.error(funcName, ' body is empty', mainCB);
                    }


                    var $ = cheerio.load(body);
                    var citiesList = $('[id$="cblAreas"] td input');


                    var areasArr = [
                        '756',
                        '742',
                        '766',
                        '760',
                        '772',
                        '738',
                        '768',
                        '747',
                        '764',
                        '753',
                        '749',
                        '757',
                        '783',
                        '758',
                        '754',
                        '775',
                        '769',
                        '759',
                        '755',
                        '777',
                        '771',
                        '762',
                        '761',
                        '751',
                        '773',
                        '770',
                        '767',
                        '752',
                        '774',
                        '779',
                        '725',
                        '765',
                        '781',
                        '750',
                        '776',
                        '748',
                        '741',
                        '782',
                        '778',
                        '780',
                        '763'
                    ];

                    citiesList.each(function (i) {
                        var areaCode = citiesList.eq(i).attr('value').split('_')[1];

                        if (!(areasArr.contains(areaCode) || emailSentNewLocations.contains(areaCode))) {
                            console.log(('NEW VICPARK LOCATION: ' + areaCode + ' ' + citiesList.eq(i).next().text()).red);
                            emailSentNewLocations.push(areaCode);

                            sendEmail({
                                from: '"BF Watcher" <***REMOVED***acc1@gmail.com>', // sender address
                                to: '***REMOVED******REMOVED***97@gmail.com',
                                subject: 'BF Watcher VICPARK ✔', // Subject line
                                text: 'NEW VICPARK LOCATION: ' + areaCode + ' ' + citiesList.eq(i).next().text(), // html body
                            }, function (success, emailsArr) {

                                if (!success) {
                                    return console.log('NEW VICPARK EMAIL ERROR');
                                }

                                if (config.debug) {
                                    console.log('E-mail sent to ' + emailsArr[0] + '\n');
                                }
                            });

                            return false;
                        }

                        if (i == citiesList.length - 1) {
                        }
                    });


                    var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                    var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                    var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                    if (!(eventvalidation && viewstate && viewstategenerator)) {
                        return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                    }




                })
        */

    },
    vasbyhem: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();

        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        delete check.errorsObj[funcName];

        try {
            request({
                uri: 'https://www.vasbyhem.se/ledigt/lagenhet',
                method: "GET",
                headers: {
                    'Origin': 'https://www.vasbyhem.se',
                },
                followRedirect: false,
                jar: cookies,
            }, function (err, res, body) {
                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                var $ = cheerio.load(body);


                if (!($('[id$=ObjectList_Container] [class^=listitem]:has(.gridcell)').length)) {
                    return check.done(mainCB, funcName, localApartments);
                }

                var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                if (!(eventvalidation && viewstate && viewstategenerator)) {
                    return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                }


                var noOfPages = parseInt($('div.navbar [id$=_lblNoOfPages]').eq(0).text().replace(/\D/g, '') || 1);
                var bodysArr = [body];
                var functionList = [];


                var processPages = function processPages(bodysArr, cb) {

                    if (typeof bodysArr !== "object" || !bodysArr.length || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    var pageCount = 0;

                    bodysArr.forEach(function (pageBody) {
                        if (check.errorsObj.hasOwnProperty(funcName)) {
                            return;
                        }

                        var $ = cheerio.load(pageBody);
                        var apartments = $('[id$=ObjectList_Container] [class^=listitem]:has(.gridcell)');


                        if (!(apartments.length) && pageCount == bodysArr.length - 1) {
                            return cb();
                        } else if (!(apartments.length)) {
                            return pageCount++;
                        }


                        //var typesArr = ['allergyfriendly','senior','non_smoking','youth','trygghetsboende','student','newprod','kompisbo','direct'];

                        apartments.each(function (i) {

                            if (check.errorsObj.hasOwnProperty(funcName)) {
                                return false;
                            }

                            var apartment = apartments.eq(i);


                            var typeTextsArr = apartment.find('.gridcell img').map(function () {
                                return $(this).attr('src').toLowerCase().trim();
                            }).toArray();

                            if (typeTextsArr.some(text => text.contains('direct'))) {

                                var url = 'https://www.vasbyhem.se/ledigt/' + (apartment.find('a[id$=ObjectDetailsUrl]').eq(0).attr('href').replace('../', ''));
                                var interestAmount = parseInt(apartment.find('[id$=ObjectInterestCount]').eq(0).text()) || 0;

                                var apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                                    if (dbApartment.url == url && dbApartment.price > 0) {
                                        dbApartment.interestAmount = interestAmount;
                                        localApartments.push(dbApartment);
                                        return true;
                                    }
                                    return false;
                                });

                                // Just for logging in proxy
                                if (!apartmentinDb) {
                                    request({
                                        uri: url,
                                        method: "GET",
                                        headers: {
                                            'Origin': 'https://www.vasbyhem.se',
                                        },
                                        followRedirect: false,
                                        jar: cookies,

                                    }, function (err, res, body) {
                                        if (err) {
                                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                        } else if (res.statusCode != 200) {
                                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                            if (isRedirect(res.statusCode)) {
                                                sendErrorEmail(funcName + ' \n' + errorText);
                                            }
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                            return check.error(funcName, errorText, mainCB);
                                        } else if (!body) {
                                            return check.error(funcName, ' body is empty', mainCB);
                                        }


                                        /*


                                                                    localApartments.push({
                                    id: $('[id$="ulObjectID"] > li.right').eq(0).text(),
                                    site: funcName,
                                    rooms: parseInt($('li.left:contains(Rum)').eq(0).next().text().replace(/\D/g, '')) || 0,
                                    price: parseInt($('[id$="trCost"]').eq(0).text().replace(/\D/g, '')) || 0,
                                    area: parseInt($('[id$="ulSize"]').eq(0).text().replace(/\D/g, '')) || 0,
                                    url: url,
                                    added: dateTimeCache,
                                    interestAmount: interestAmount,
                                    type: 'fast',
                                    info: {}
                                });

                                         */

                                    });
                                }

                                let id = url.split('/').pop();
                                let rooms = parseInt(apartment.find('[id$="NoOfRooms"]').eq(0).text().replace(/\D/g, '')) || 0;
                                let price = parseInt(apartment.find('.gridcell').eq(7).text().replace(/\D/g, '')) || 0;
                                let area = parseInt(apartment.find('[id$="_Size"]').eq(0).text().replace(/\D/g, '')) || 0;


                                if (apartmentIsInvalid(id, price, rooms, area)) {
                                    console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                }


                                localApartments.push({
                                    id: id,
                                    site: funcName,
                                    rooms: rooms,
                                    price: price,
                                    area: area,
                                    url: url,
                                    added: dateTimeCache,
                                    interestAmount: interestAmount,
                                    type: 'fast',
                                    info: {}
                                });

                            }

                        });

                        if (++pageCount == bodysArr.length) {
                            return cb();
                        }
                    })

                };
                var getPage = function getPage(pageNr, cb) {

                    if (isNaN(pageNr) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    let index = 0;

                    if (noOfPages < 6 || pageNr < 4) {
                        index = pageNr-1
                    } else if (noOfPages - pageNr === 0) {
                        index = 4;
                    } else {
                        index = 3;
                    }

                    request({
                        uri: 'https://www.vasbyhem.se/ledigt/lagenhet',
                        method: "POST",
                        headers: {
                            'Origin': 'www.vasbyhem.se',
                            'Referer': 'https://www.vasbyhem.se/ledigt/lagenhet',
                        },
                        jar: cookies,
                        form: {
                            '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ucNavBar$rptButtons$ctl' + String((index)).padStart(2, '0') + '$btnPage',
                            '__EVENTARGUMENT': '',
                            '__VIEWSTATE': viewstate,
                            '__VIEWSTATEGENERATOR': viewstategenerator,
                            '__EVENTVALIDATION': eventvalidation,
                            'ctl00$ctl01$SearchSimple$txtSearch': '',
                            'ctl00$ctl01$hdnBrowserCheck': '',
                            'ctl00$ctl01$hdnRequestVerificationToken': ''
                        },
                    }, function (err, res, body) {

                        if (err) {
                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                        } else if (res.statusCode != 200) {
                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                            if (isRedirect(res.statusCode)) {
                                sendErrorEmail(funcName + ' \n' + errorText);
                            }
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, errorText, mainCB);
                        } else if (!body) {
                            return check.error(funcName, ' body is empty', mainCB);
                        }

                        eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                        viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                        viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                        }

                        bodysArr.push(body);

                        if (bodysArr.length == noOfPages) {
                            return cb();
                        }
                    })
                };


                for (let i = 1; i < noOfPages; i++) {
                    functionList.push(function (cb) {
                        getPage((i + 1), cb);
                    })
                }


                async.series(functionList, function () {
                    processPages(bodysArr, function () {
                        if (!(check.errorsObj.hasOwnProperty(funcName))) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    });
                });


            })
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


    },
    vicpark: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        //var emailSentNewLocations = [];
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        delete check.errorsObj[funcName];


        try {
            request({
                uri: 'https://minasidor.victoriapark.se/ledigt/sok/objekt',
                method: "GET",
                followRedirect: false,
                jar: cookies
            }, function (err, res, body) {

                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                let eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0],
                    viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0],
                    viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                if (!(eventvalidation && viewstate && viewstategenerator)) {
                    return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                }



                var $;

                var noOfPages = 1;
                var bodysArr = [];
                var functionList = [];
                var noAdsOnPage = false;


                let processPages = function processPages(bodysArr, cb) {


                    if (typeof bodysArr !== "object" || !(bodysArr.length) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    var pageCount = 0;

                    bodysArr.forEach(function (pageBody, pageIndex) {
                        var $ = cheerio.load(pageBody);
                        var apartments = $('[id$=ObjectList_Container] tr[class^=listitem]:has(.gridcell)');

                        apartments = apartments.filter(function (i) {
                            return apartments.eq(i).find('[id$=_AreaName]').eq(0).text().contains('tensta');
                        });



                        if (!(apartments.length) && pageIndex == bodysArr.length - 1) {
                            return cb();
                        } else if (!(apartments.length)) {
                            return;
                        }

                        var apartmentsCount = 0;

                        apartments.each(function (i) {
                            if (check.errorsObj.hasOwnProperty(funcName)) {
                                return false;
                            }

                            var url = 'https://minasidor.victoriapark.se/ledigt' + $('[id$="ObjectDetailsUrl"]').eq(i).attr('href').substring(2);
                            var rooms = parseInt($('[id$="NoOfRooms"]').eq(i).text().replace(/\D/g, '')) || 0;

                            var apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                                if (dbApartment.url == url && dbApartment.price > 0) {
                                    localApartments.push(dbApartment);
                                    return true;
                                }
                                return false;
                            });

                            if (!apartmentinDb) {

                                let id = url.split('/').pop();
                                let price = parseInt($('[id$="_Cost"]').eq(i).text().replace(/\D/g, '')) || 0;
                                let area = parseInt($('[id$="_Size"]').eq(i).text().replace(/\D/g, '')) || 0;

                                if (apartmentIsInvalid(id, price, rooms, area)) {
                                    console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                }

                                localApartments.push({
                                    id: id,
                                    site: funcName,
                                    rooms: rooms,
                                    price: price,
                                    area: area,
                                    url: url,
                                    added: dateTimeCache,
                                    type: 'normal',
                                    info: {}
                                });


                                if (++apartmentsCount == apartments.length) {

                                    if (pageCount == bodysArr.length - 1) {
                                        return cb();
                                    } else {
                                        pageCount++;
                                    }
                                }

                            } else if (++apartmentsCount == apartments.length) {

                                if (pageCount == bodysArr.length - 1) {
                                    return cb();
                                } else {
                                    pageCount++;
                                }
                            }

                        })
                    })

                };
                let getPage = function getPage(pageNr, cb) {

                    if (noAdsOnPage || isNaN(pageNr) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    let index = 0;

                    if (noOfPages < 6 || pageNr < 4) {
                        index = pageNr - 1
                    } else if (noOfPages - pageNr === 0) {
                        index = 4;
                    } else {
                        index = 3;
                    }


                   if (pageNr === 1) {
                       request({
                           uri: 'https://minasidor.victoriapark.se/ledigt/sok/objekt',
                           method: "POST",
                           headers: {
                               'Referer': 'https://minasidor.victoriapark.se/ledigt/sok/objekt',
                               'Origin': 'https://minasidor.victoriapark.se'
                           },
                           followAllRedirects: true,
                           jar: cookies,
                           form: {
                               '__EVENTTARGET': '',
                               '__EVENTARGUMENT': '',
                               '__LASTFOCUS': '',
                               '__VIEWSTATE': viewstate,
                               '__VIEWSTATEGENERATOR': viewstategenerator,
                               '__EVENTVALIDATION': eventvalidation,
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$rblObjectGroup': 1,
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$35': 'AREA_777',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$drpMinRooms': 'Min:',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$drpMaxRooms': 'Max:',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$drpMinFloor': 'Min:',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$drpMaxFloor': 'Max:',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$drpMinSize': 'Min:',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$drpMaxSize': 'Max:',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$txtMaxCost': '',
                               'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$btnSearch': 'Sök',
                               'ctl00$ctl01$hdnBrowserCheck': '',
                               'ctl00$ctl01$hdnRequestVerificationToken': ''
                   },
                   },

                       function (err, res, body) {

                           if (err) {
                               return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                           } else if (res.statusCode != 200) {
                               let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                               if (isRedirect(res.statusCode)) {
                                   sendErrorEmail(funcName + ' \n' + errorText);
                               }
                               writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                               return check.error(funcName, errorText, mainCB);
                           } else if (res.request._redirect.redirects.length > 1) {
                               writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                               return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                           }

                               eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                           viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                           viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                           if (!(eventvalidation && viewstate && viewstategenerator)) {
                               return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                           }

                               $ = cheerio.load(body)
                           bodysArr.push(body);
                               noOfPages = parseInt($('div.navbar [id$=_lblNoOfPages]').eq(0).text().replace(/\D/g, '')) || 1


                           return cb();
                       }

                   )
                   } else
                       {

                    request({
                        uri: 'https://minasidor.victoriapark.se/ledigt/sok/lagenhet',
                        method: "POST",
                        headers: {
                            'Referer': 'https://minasidor.victoriapark.se/ledigt/sok/lagenhet',
                            'Origin': 'https://minasidor.victoriapark.se',
                        },
                        followAllRedirects: true,
                        jar: cookies,
                        form: {
                            '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ucNavBar$rptButtons$ctl' + String((index)).padStart(2, '0') + '$btnPage',
                            '__EVENTARGUMENT': '',
                            '__VIEWSTATE': viewstate,
                            '__VIEWSTATEGENERATOR': viewstategenerator,
                            '__EVENTVALIDATION': eventvalidation,
                            'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$35': 'AREA_777', // Tensta
                            /*'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$5': 'AREA_771',
                            'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$28': 'AREA_725',
                            'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$cblAreas$29': 'AREA_776',*/
                            'ctl00$ctl01$hdnRequestVerificationToken': ''
                },
                },

                    function (err, res, body) {

                        if (err) {
                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                        } else if (res.statusCode != 200) {
                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                            if (isRedirect(res.statusCode)) {
                                sendErrorEmail(funcName + ' \n' + errorText);
                            }
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, errorText, mainCB);
                        } else if (res.request._redirect.redirects.length > 1) {
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                        } else if (!body) {
                            return check.error(funcName, ' body is empty', mainCB);
                        }

                        eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                        viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                        viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                        }

                        bodysArr.push(body);

                        // return false if no ads on a page, this to abort async.series getting empty pages
                        var $ = cheerio.load(body);
                        if (!($('[id$="ObjectList_Container"] tr[class^="listitem"]').length)) {
                            console.log((getDateTime() + ' ' + funcName + ': no ads on page ' + pageNr).red);
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            sendErrorEmail(funcName + ': no ads on page ' + pageNr);
                            noAdsOnPage = true;
                            return cb();
                        }

                        return cb();
                    }

                )
                }
                };

                getPage(1, function() {
                   /* for (let i = 1; i < noOfPages; i++) {
                        functionList.push(function (cb) {
                            getPage((i + 1), cb);
                        })
                    } */

                    async.series(functionList, function () {
                        processPages(bodysArr, function () {
                            if (!(check.errorsObj.hasOwnProperty(funcName))) {
                                return check.done(mainCB, funcName, localApartments);
                            }
                        });
                    });
                });

            });
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


        /*

                request({
                    uri: 'https://minasidor.victoriapark.se/ledigt/sok/lagenhet',
                    method: "GET",
                    headers: {
                        'Origin': 'https://minasidor.victoriapark.se',
                    },
                    followRedirect: false,
                    jar: cookies,
                }, function (err, res, body) {


                    if (err) {
                        return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                    } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, errorText, mainCB);
                    } else if (!body) {
                        return check.error(funcName, ' body is empty', mainCB);
                    }


                    var $ = cheerio.load(body);
                    var citiesList = $('[id$="cblAreas"] td input');


                    var areasArr = [
                        '756',
                        '742',
                        '766',
                        '760',
                        '772',
                        '738',
                        '768',
                        '747',
                        '764',
                        '753',
                        '749',
                        '757',
                        '783',
                        '758',
                        '754',
                        '775',
                        '769',
                        '759',
                        '755',
                        '777',
                        '771',
                        '762',
                        '761',
                        '751',
                        '773',
                        '770',
                        '767',
                        '752',
                        '774',
                        '779',
                        '725',
                        '765',
                        '781',
                        '750',
                        '776',
                        '748',
                        '741',
                        '782',
                        '778',
                        '780',
                        '763'
                    ];

                    citiesList.each(function (i) {
                        var areaCode = citiesList.eq(i).attr('value').split('_')[1];

                        if (!(areasArr.contains(areaCode) || emailSentNewLocations.contains(areaCode))) {
                            console.log(('NEW VICPARK LOCATION: ' + areaCode + ' ' + citiesList.eq(i).next().text()).red);
                            emailSentNewLocations.push(areaCode);

                            sendEmail({
                                from: '"BF Watcher" <***REMOVED***acc1@gmail.com>', // sender address
                                to: '***REMOVED******REMOVED***97@gmail.com',
                                subject: 'BF Watcher VICPARK ✔', // Subject line
                                text: 'NEW VICPARK LOCATION: ' + areaCode + ' ' + citiesList.eq(i).next().text(), // html body
                            }, function (success, emailsArr) {

                                if (!success) {
                                    return console.log('NEW VICPARK EMAIL ERROR');
                                }

                                if (config.debug) {
                                    console.log('E-mail sent to ' + emailsArr[0] + '\n');
                                }
                            });

                            return false;
                        }

                        if (i == citiesList.length - 1) {
                        }
                    });


                    var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                    var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                    var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                    if (!(eventvalidation && viewstate && viewstategenerator)) {
                        return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                    }




                })
        */

    },
    upbrohus: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;// Only Ledig Direkt
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        delete check.errorsObj[funcName];

        let postObj = {
            Parm1: {"CompanyNo":0,"SyndicateNo":1,"ObjectMainGroupNo":1,"MarketPlaces":[{"No":101},{"No":100}],"Advertisements":[{"No":0}],"RentLimit":{"Min":0,"Max":15000},"AreaLimit":{"Min":0,"Max":200},"ApplySearchFilter":true,"Page":1,"Take":10,"SortOrder":"SeekAreaDescription ASC, StreetName ASC","ReturnParameters":["ObjectNo","FirstEstateImageUrl","Street","SeekAreaDescription","PlaceName","ObjectSubDescription","ObjectArea","RentPerMonth","MarketPlaceDescription","CountInterest","FirstInfoTextShort","FirstInfoText","EndPeriodMP","FreeFrom","SeekAreaUrl","Latitude","Longitude","BoardNo"]},
            CallbackMethod: "PostObjectSearch",
            CallbackParmCount: 1,
            __WWEVENTCALLBACK: ''
        };
        let postData = `Parm1=${encodeURIComponent(JSON.stringify(postObj.Parm1).replace(/\s/g, '+'))}&CallbackMethod=${encodeURIComponent(postObj.CallbackMethod)}&CallbackParmCount=${encodeURIComponent(postObj.CallbackParmCount)}&__WWEVENTCALLBACK=`.replace(/\s/g, '').replace(/%2B/g, '+');
        let postUrl = 'https://marknad.upplands-brohus.se/API/Service/SearchServiceHandler.ashx';

        try {

            let getAuthorization = function (cb) {


                request({
                    uri: 'https://marknad.upplands-brohus.se/scripts/momentum/momentum.services.js',
                    method: "GET",
                    headers: {
                        Origin: "https://marknad.upplands-brohus.se",
                        Referer: "https://marknad.upplands-brohus.se/pgSearchResult.aspx"
                    },
                    jar: cookies
                }, function (err, res, body) {

                    if (err) {
                        return check.error(funcName, ' JS err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                    } else if (res.statusCode != 200) {
                        let errorText = 'JS statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                        if (isRedirect(res.statusCode)) {
                            sendErrorEmail(funcName + ' \n' + errorText);
                        }
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, errorText, mainCB);
                    } else if (!body) {
                        return check.error(funcName, ' JS body is empty', mainCB);
                    }


                    let apiKey, secret;

                    try {

                        let arr = extractBetweenStrings(body, 'momentum.generateApiToken(', ')')[0].split(',').slice(0, 2);

                        apiKey = arr[0].trim().slice(1, -1);
                        secret = arr[1].trim().slice(1, -1);

                        if (apiKey.length < 10 || secret.length < 10 || !(isBase64(secret))) {
                            console.log((funcName + ': apiKey or secret is invalid').red);
                            throw 'apiKey or secret is invalid';
                        }

                    } catch (e) {
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.js`), body, (new URL(res.request.uri.href)).origin);
                        sendErrorEmail(funcName + ': error when parsing API key from JS file');
                        return check.error(funcName, 'error when parsing API key from JS file', mainCB);
                    }


                    let a = function () {
                        var c = '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, function (a) {
                            return (a ^ getRandomValues(new Uint8Array(1))[0] & 15 >> a / 4).toString(16)
                        });
                        return c.replace(/-/gm, '')
                    };

                    let generateApiToken = function (c, d, e, f, g) {

                        let i = encodeURIComponent(e).toLowerCase()
                            , j = g ? CryptoJS.enc.Base64.stringify(CryptoJS.MD5(g)) : ''
                            , l = a(!0)
                            , k = Math.floor(new Date().getTime() / 1e3)
                            , m = [c, f, i, k, l, j].join('')
                            , n = CryptoJS.enc.Base64.parse(d)
                            , o = CryptoJS.enc.Utf8.parse(m)
                            , p = CryptoJS.HmacSHA256(o, n)
                            , q = CryptoJS.enc.Base64.stringify(p);

                        return [c, q, l, k].join(':');
                    };


                    // 2019-11-14
                    let oldApiKey = '***REMOVED***';
                    let oldSecret = '***REMOVED***';


                    if (apiKey != oldApiKey || secret != oldSecret) {
                        if (sendErrorEmail(funcName + ': APIKEY or SECRET has changed!')) {
                            console.log((funcName + ': APIKEY or SECRET has changed!').red);
                            console.log(('OLD APIKEY: ' + oldApiKey).red);
                            console.log(('OLD SECRET: ' + oldSecret).red);
                            console.log(('NEW APIKEY: ' + apiKey).red);
                            console.log(('NEW SECRET: ' + secret).red);
                        }
                    }


                    let s = generateApiToken(apiKey, secret, postUrl, 'POST', postData);


                    return cb('MOM-API apitoken="' + s + '"');
                });
            };

            getAuthorization(function (authorization) {

                request({
                    uri: postUrl,
                    method: "POST",
                    headers: {
                        Authorization: authorization,
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: 'application/json,text/*',
                        Referer: 'https://marknad.upplands-brohus.se/?mg=1',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: postData,
                    jar: cookies
                }, function (err, res, body) {

                    if (err) {
                        return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                    } else if (res.statusCode != 200) {
                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                        if (isRedirect(res.statusCode)) {
                            sendErrorEmail(funcName + ' \n' + errorText);
                        }
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, errorText, mainCB);
                    } else if (!body) {
                        return check.error(funcName, ' body is empty', mainCB);
                    }

                    try {
                        var apartments = JSON.parse(body)['Result'];
                    } catch (e) {
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                    }

                    if (!apartments.length) {
                        return check.done(mainCB, funcName, localApartments);
                    }

                    apartments.forEach(function (apartment, i) {


                        var type = apartment['MarketPlaceNo'];

                        // Only Ledig Direkt
                        if (type == 100) {
                            let id = apartment['ObjectNo'];
                            let rooms = parseInt(apartment['ObjectSubDescription'].replace(/\D/g, '')) || 0;
                            let price = parseInt(apartment['RentPerMonth'].replace(/\D/g, '')) || 0;
                            let area = apartment['ObjectAreaSort'];

                            if (apartmentIsInvalid(id, price, rooms, area)) {
                                console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            }

                            localApartments.push({
                                id: id,
                                site: funcName,
                                rooms: rooms,
                                price: price,
                                area: area,
                                url: 'https://marknad.upplands-brohus.se/pgObjectInformation.aspx?company=1&obj=' + apartment['ObjectNo'],
                                added: dateTimeCache,
                                type: 'fast',
                                info: {}
                            });
                        }

                        if (i == apartments.length - 1) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    });
                })
            })
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


    },
    sigtunahem: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        let snabbOnly = true;
        delete check.errorsObj[funcName];

        try {
            request({
                uri: 'https://sigtunahem.se/widgets/?omraden=&egenskaper=' + (snabbOnly ? 'SNABB' : '') + '&callback=&widgets%5B%5D=objektlista%40lagenheter',
                method: "GET",
                headers: {
                    /*'Accept-Language': '*'*/
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
'Accept-Encoding': 'gzip, deflate, br',
'Accept-Language': 'en,sv;q=0.9,it;q=0.8'
                },
                followRedirect: false,
                jar: cookies
            }, function (err, res, body) {

                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                try {
                    var apartments = JSON.parse(body.slice(1, -2)).data["objektlista@lagenheter"];
                } catch (e) {
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                }

                if (!apartments.length) {
                    return check.done(mainCB, funcName, localApartments);
                }

                apartments.forEach(function (apartment, i) {

                    var rooms = parseInt(apartment['typ'].replace(/\D/g, '')) || 0,
                        price = parseInt(apartment['hyra'].replace(/\D/g, '')) || 0,
                        area = apartment['yta'],
                        //city = apartment['omrade'],
                        floor = isNaN(apartment['vaning']) ? 0 : apartment['vaning'],
                        refid = apartment['detaljUrl'].split('refid=').pop(),
                        id = price + '-' + floor + '-' + rooms + '-' + area + '-' + apartment['byggAr'] + '-' + apartment['adress'];


                    id = String(id.hashCode());

                    if (apartmentIsInvalid(id, price, rooms, area)) {
                        console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    }


                    let apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                        if (dbApartment.id == id && dbApartment.price > 0) {
                            dbApartment.refid = refid;
                            localApartments.push(dbApartment);
                            return true;
                        }
                        return false;
                    });


                    if (!(apartmentinDb)) {
                        localApartments.push({
                            id: id,
                            refid: refid,
                            site: funcName,
                            rooms: rooms,
                            price: price,
                            area: area,
                            url: apartment['detaljUrl'],
                            added: dateTimeCache,
                            type: 'fast',
                            info: {}
                        });
                    }

                    if (i == apartments.length - 1) {
                        return check.done(mainCB, funcName, localApartments);
                    }
                });

            })
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }
    },
    hembla: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        var emailSentNewLocations = [];
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        delete check.errorsObj[funcName];

        var locationsToInclude = [
            'botkyrka',
            'bro',
            'flemmingsberg',
            'husby',
            'marsta',
            'rinkeby',
            'sollentuna',
            'varberg',
            'varby'
        ];

        var locationsToPost = [];

        try {
            request({
                uri: 'https://www.hembla.se/bostader/',
                method: "GET",
                headers: {
                    'Origin': 'https://www.hembla.se',
                },
                followRedirect: false,
                jar: cookies,
            }, function (err, res, body) {

                if (err || res.statusCode != 200 || !body) {

                    if (!err && isRedirect(res.statusCode)) {
                        let errorText = 'Hembla check new location error: statuscode!=200 ==' + res.statusCode;
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    if (res) {
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    }
                    return check.error(funcName, 'Hembla check new location error', mainCB);
                }

                var $ = cheerio.load(body);
                var citiesList = $('.dropdown-menu-item label');

                citiesList.each(function (i) {
                    var city = citiesList.eq(i).attr('for');


                    if (!(locationsToInclude.contains(city) || config.locationsToExclude[funcName].contains(city) || emailSentNewLocations.contains(city))) {
                        console.log(('NEW HEMBLA LOCATION: ' + city).red);
                        emailSentNewLocations.push(city);

                        sendEmail({
                            from: '"BF Watcher" <***REMOVED***acc1@gmail.com>', // sender address
                            to: '***REMOVED******REMOVED***97@gmail.com',
                            subject: 'BF Watcher HEMBLA ✔', // Subject line
                            text: 'NEW HEMBLA LOCATION: ' + city, // html body
                        }, function (success, emailsArr) {

                            if (!success) {
                                return console.log('NEW HEMBLA EMAIL ERROR');
                            }

                            if (config.debug) {
                                console.log('E-mail sent to ' + emailsArr[0] + '\n');
                            }
                        });

                    } else if (locationsToInclude.contains(city)) {
                        locationsToPost.push(city);
                    }


                });

                if (locationsToPost.length) {

                    request({
                        uri: 'https://www.hembla.se/wp-json/theme/v1/ajax',
                        method: "POST",
                        headers: {
                            'Origin': 'https://www.hembla.se',
                            'Referer': 'https://www.hembla.se/bostader/',
                        },
                        followAllRedirects: true,
                        jar: cookies,
                        form: {
                            'action': 'get_apartments',
                            'areas[]': locationsToPost
                        },
                        qsStringifyOptions: {arrayFormat: 'repeat'}
                    }, function (err, res, body) {

                        if (err) {
                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                        } else if (!(res.statusCode == 404 || res.statusCode == 200)) {
                            let errorText = 'statuscode != 200||404 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];

                            if (isRedirect(res.statusCode)) {
                                sendErrorEmail(funcName + ' \n' + errorText);
                            }
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, errorText, mainCB);
                        } else if (res.request._redirect.redirects.length > 1) {
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                        } else if (!body) {
                            return check.error(funcName, ' body is empty', mainCB);
                        }

                        try {
                            var ads = JSON.parse(body).list;
                        } catch (e) {
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                        }

                        if ((typeof ads == "undefined" && JSON.parse(body).code == 'no_posts_found') || !(ads.length)) {
                            return check.done(mainCB, funcName, localApartments);
                        }

                        ads.forEach(function (ad, i) {
                            var $ = cheerio.load(ad);

                            var url = $('a').eq(0).attr('href');
                            var rawText = $('p.card-text').eq(0).text().split(',');

                            var areaSplit = rawText[3].split('.');
                            var area;
                            if (areaSplit.length == 2) {
                                area = Math.round(parseFloat(areaSplit[0].replace(/\D/g, '') + "." + areaSplit[1].replace(/\D/g, '') || 0));
                            } else {
                                area = parseInt(areaSplit[0].replace(/\D/g, '')) || 0;
                            }

                            var priceSplit = rawText[4].split('.');
                            var price;
                            if (priceSplit.length == 2) {
                                price = Math.round(parseFloat(priceSplit[0].replace(/\D/g, '') + "." + priceSplit[1].replace(/\D/g, '') || 0));
                            } else {
                                price = parseInt(priceSplit[0].replace(/\D/g, '')) || 0;
                            }

                            let id = extractBetweenStrings(url, 'bostad-', '/')[0];
                            let rooms = parseInt(rawText[2].replace(/\D/g, '')) || 0;

                            if (apartmentIsInvalid(id, price, rooms, area)) {
                                console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            }

                            localApartments.push({
                                id: id,
                                site: funcName,
                                rooms: rooms,
                                price: price,
                                area: area,
                                url: url,
                                added: dateTimeCache,
                                type: 'normal',
                                info: {}
                            });


                            if (i == ads.length - 1) {
                                return check.done(mainCB, funcName, localApartments);
                            }
                        })


                    });
                } else {
                    return check.done(mainCB, funcName, localApartments);
                }
            });
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


    },
    jfhus: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        // Only Ungdom


        delete check.errorsObj[funcName];

        let postObj = {
            Parm1: {
                "CompanyNo": -1,
                "SyndicateNo": 1,
                "ObjectMainGroupNo": 4,
                "Advertisements": [
                    {
                        "No": -1
                    }
                ],
                "RentLimit": {
                    "Min": 0,
                    "Max": 15000
                },
                "AreaLimit": {
                    "Min": 0,
                    "Max": 150
                },
                "ApplySearchFilter": true,
                "Page": 1,
                "Take": 10,
                "SortOrder": "FreeFrom asc, SeekAreaDescription asc, StreetName asc",
                "ReturnParameters": [
                    "ObjectNo",
                    "FirstEstateImageUrl",
                    "Street",
                    "SeekAreaDescription",
                    "PlaceName",
                    "ObjectSubDescription",
                    "ObjectArea",
                    "RentPerMonth",
                    "MarketPlaceDescription",
                    "CountInterest",
                    "FirstInfoTextShort",
                    "FirstInfoText",
                    "EndPeriodMP",
                    "FreeFrom",
                    "SeekAreaUrl",
                    "Latitude",
                    "Longitude",
                    "BoardNo"
                ]
            },
            CallbackMethod: "PostObjectSearch",
            CallbackParmCount: 1,
            __WWEVENTCALLBACK: ''
        };
        let postData = `Parm1=${encodeURIComponent(JSON.stringify(postObj.Parm1).replace(/\s/g, '+'))}&CallbackMethod=${encodeURIComponent(postObj.CallbackMethod)}&CallbackParmCount=${encodeURIComponent(postObj.CallbackParmCount)}&__WWEVENTCALLBACK=`.replace(/\s/g, '').replace(/%2B/g, '+');
        let postUrl = 'https://marknad.jarfallahus.se/API/Service/SearchServiceHandler.ashx';

        try {

            let getAuthorization = function (cb) {

                request({
                    uri: 'https://marknad.jarfallahus.se/scripts/momentum/momentum.services.js',
                    method: "GET",
                    headers: {
                        Origin: "https://marknad.jarfallahus.se",
                        Referer: "https://marknad.jarfallahus.se/pgSearchResult.aspx"
                    },
                    jar: cookies
                }, function (err, res, body) {

                    if (err) {
                        return check.error(funcName, ' JS err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                    } else if (res.statusCode != 200) {
                        let errorText = 'JS statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                        if (isRedirect(res.statusCode)) {
                            sendErrorEmail(funcName + ' \n' + errorText);
                        }
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, errorText, mainCB);
                    } else if (!body) {
                        return check.error(funcName, ' JS body is empty', mainCB);
                    }


                    let apiKey, secret;

                    try {

                        let arr = extractBetweenStrings(body, 'momentum.generateApiToken(', ')')[0].split(',').slice(0, 2);

                        apiKey = arr[0].trim().slice(1, -1);
                        secret = arr[1].trim().slice(1, -1);

                        if (apiKey.length < 10 || secret.length < 10 || !(isBase64(secret))) {
                            console.log((funcName + ': apiKey or secret is invalid').red);
                            throw 'apiKey or secret is invalid';
                        }

                    } catch (e) {
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.js`), body, (new URL(res.request.uri.href)).origin);
                        sendErrorEmail(funcName + ': error when parsing API key from JS file');
                        return check.error(funcName, 'error when parsing API key from JS file', mainCB);
                    }


                    let a = function () {
                        var c = '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, function (a) {
                            return (a ^ getRandomValues(new Uint8Array(1))[0] & 15 >> a / 4).toString(16)
                        });
                        return c.replace(/-/gm, '')
                    };

                    let generateApiToken = function (c, d, e, f, g) {

                        let i = encodeURIComponent(e).toLowerCase()
                            , j = g ? CryptoJS.enc.Base64.stringify(CryptoJS.MD5(g)) : ''
                            , l = a(!0)
                            , k = Math.floor(new Date().getTime() / 1e3)
                            , m = [c, f, i, k, l, j].join('')
                            , n = CryptoJS.enc.Base64.parse(d)
                            , o = CryptoJS.enc.Utf8.parse(m)
                            , p = CryptoJS.HmacSHA256(o, n)
                            , q = CryptoJS.enc.Base64.stringify(p);

                        return [c, q, l, k].join(':');
                    };


                    // 2019-11-14
                    let oldApiKey = '***REMOVED***';
                    let oldSecret = '***REMOVED***';


                    if (apiKey != oldApiKey || secret != oldSecret) {
                        if (sendErrorEmail(funcName + ': APIKEY or SECRET has changed!')) {
                            console.log((funcName + ': APIKEY or SECRET has changed!').red);
                            console.log(('OLD APIKEY: ' + oldApiKey).red);
                            console.log(('OLD SECRET: ' + oldSecret).red);
                            console.log(('NEW APIKEY: ' + apiKey).red);
                            console.log(('NEW SECRET: ' + secret).red);
                        }
                    }


                    let s = generateApiToken(apiKey, secret, postUrl, 'POST', postData);


                    return cb('MOM-API apitoken="' + s + '"');
                });
            };

            getAuthorization(function (authorization) {

                //console.log('Authorization: ' + authorization);

                request({
                    uri: postUrl,
                    method: "POST",
                    headers: {
                        Authorization: authorization,
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: 'application/json,text/*',
                        Referer: 'https://marknad.jarfallahus.se/pgSearchResult.aspx?mg=4',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: postData,
                    jar: cookies
                }, function (err, res, body) {

                    if (err) {
                        return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                    } else if (res.statusCode != 200) {
                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                        if (isRedirect(res.statusCode)) {
                            sendErrorEmail(funcName + ' \n' + errorText);
                        }
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, errorText, mainCB);
                    } else if (!body) {
                        return check.error(funcName, ' body is empty', mainCB);
                    }

                    try {
                        var apartments = JSON.parse(body)['Result'];
                    } catch (e) {
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                    }

                    if (!apartments.length) {
                        return check.done(mainCB, funcName, localApartments);
                    }

                    apartments.forEach(function (apartment, i) {

                        let id = apartment['ObjectNo'];
                        let rooms = parseInt(apartment['ObjectSubDescription'].replace(/\D/g, '')) || 0;
                        let price = parseInt(apartment['RentPerMonth'].replace(/\D/g, '')) || 0;
                        let area = apartment['ObjectAreaSort'];


                        if (apartmentIsInvalid(id, price, rooms, area)) {
                            console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                        }

                        localApartments.push({
                            id: id,
                            site: funcName,
                            rooms: rooms,
                            price: price,
                            area: area,
                            url: 'https://marknad.jarfallahus.se/pgObjectInformation.aspx?company=1&obj=' + apartment['ObjectNo'],
                            added: dateTimeCache,
                            type: 'normal',
                            info: {}
                        });

                        if (i == apartments.length - 1) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    });
                });

            });
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }

    },
    akelius: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        var emailSentNewLocations = [];
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';


        delete check.errorsObj[funcName];

        var locationsToInclude = [
            'Bromma',
            'Midsommarkransen',
            'Enskede',
            'Vasastan',
            'Gamla stan',
            'Gärdet',
            'Skärholmen',
            'Visättra',
            'Hägersten',
            'Solna',
            'Högdalen',
            'Stora Essingen',
            'Jakobsberg',
            'Järfälla',
            'Södermalm',
            'Årsta',
            'Älvsjö',
            'Bandhagen',
            'Stockholm',
            'Johanneshov'
        ];

        try {
            request({
                uri: 'https://rent.akelius.com/lettings/marketing/units/?countryCode=SE',
                method: "GET",
                headers: {
                    'Accept-Language': '*'
                },
                followRedirect: false,
                jar: cookies
            }, function (err, res, body) {

                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                try {
                    var ads = JSON.parse(body).data;
                } catch (e) {
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    check.error(funcName, ' couldn\'t parse JSON', mainCB);
                }

                var cities = (ads.map(ad => ad.address.city || ad.address.area)).removeDuplicates();
                cities.forEach(city => {

                    if (!(config.locationsToExclude[funcName].contains(capitalizeFirstLetter(city)) || locationsToInclude.contains(capitalizeFirstLetter(city)) || emailSentNewLocations.contains(city)) && city.trim() !== '') {
                        console.log((getDateTime() + ' NEW AKELIUS LOCATION: ' + city).red);
                        emailSentNewLocations.push(city);

                        sendEmail({
                            from: '"BF Watcher" <***REMOVED***acc1@gmail.com>', // sender address
                            to: '***REMOVED******REMOVED***97@gmail.com',
                            subject: 'BF Watcher AKELIUS ✔', // Subject line
                            text: 'NEW AKELIUS LOCATION: ' + city, // html body
                        }, function (success, emailsArr) {

                            if (!success) {
                                return console.log('NEW AKELIUS EMAIL ERROR');
                            }

                            if (config.debug) {
                                console.log('AKELIUS E-mail sent to ' + emailsArr[0] + '\n');
                            }
                        });
                    }

                });


                ads = ads.filter(function (ad) {
                    ad.address.city = ad.address.city || ad.address.area;
                    return locationsToInclude.contains(capitalizeFirstLetter(ad.address.city));
                });

                if (!(ads.length)) {
                    return check.done(mainCB, funcName, localApartments);
                }


                ads.forEach(function (ad, i) {
                    var id = ad['id'];
                    //var rooms = parseInt(ad['details']["numberOfRooms"], 10) || 0;
                    var rooms = parseInt(ad['keyfacts']["number-of-rooms"], 10) || 0;

                    var apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                        if (dbApartment.id == id && dbApartment.price > 0) {
                            dbApartment.address = ad['keyfacts']['streetname'].trim();
                            localApartments.push(dbApartment);
                            return true;
                        }
                        return false;
                    });


                    var areaSplit = String(ad['keyfacts']["unit-size"]).split('.');
                    var area;
                    if (areaSplit.length == 2) {
                        area = Math.round(parseFloat(areaSplit[0].replace(/\D/g, '') + "." + areaSplit[1].replace(/\D/g, '') || 0));
                    } else {
                        area = parseInt(areaSplit[0].replace(/\D/g, '')) || 0;
                    }

                    var priceSplit = String(ad['keyfacts']['total-rent']).split('.');
                    var price;
                    if (priceSplit.length == 2) {
                        price = Math.round(parseFloat(priceSplit[0].replace(/\D/g, '') + "." + priceSplit[1].replace(/\D/g, '') || 0));
                    } else {
                        price = parseInt(priceSplit[0].replace(/\D/g, '')) || 0;
                    }


                    if (apartmentIsInvalid(id, price, rooms, area)) {
                        console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    }

                    if (!apartmentinDb) {
                        localApartments.push({
                            id: id,
                            site: funcName,
                            rooms: rooms,
                            price: price,
                            area: area,
                            url: 'https://rent.akelius.com/sv/detail/' + id,
                            added: dateTimeCache,
                            address: ad['keyfacts']['streetname'].trim(),
                            type: 'normal',
                            info: {internalId: ad['internalId']}
                        });
                    }


                    if (i == ads.length - 1) {
                        return check.done(mainCB, funcName, localApartments);
                    }

                })
            })
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


    },
    wahlin: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';


        delete check.errorsObj[funcName];

        try {
            request({
                uri: 'https://wahlinfastigheter.se/lediga-objekt/lagenheter/',
                method: "GET",
                headers: {
                    'Referer': 'https://wahlinfastigheter.se/',
                },
                followRedirect: false,
                jar: cookies
            }, function (err, res, body) {

                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                var $ = cheerio.load(body);
                var ads = $('div.posts-wrapper-block .block');

                if (!(ads.length)) {
                    return check.done(mainCB, funcName, localApartments);
                }

                var apartmentsCount = 0;

                ads.each(function (i) {

                    if (check.errorsObj[funcName]) {
                        return false;
                    }

                    var url = ads.eq(i).find('div.link-wrapper a').eq(0).attr('href');

                    var adInDb = check.dbAva***REMOVED***ble.some(function (apartment) {
                        if (apartment.url == url) {
                            localApartments.push(apartment);
                            return true;
                        }
                        return false;
                    });

                    if (typeof url !== "undefined" && url != null) {
                        if (!adInDb) {
                            request({
                                uri: url,
                                method: "GET",
                                headers: {
                                    'Referer': 'https://wahlinfastigheter.se/lediga-objekt/lagenheter/',
                                },
                                followRedirect: false,
                                jar: cookies
                            }, function (err, res, body) {

                                if (err) {
                                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                } else if (res.statusCode != 200) {
                                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                    if (isRedirect(res.statusCode)) {
                                        sendErrorEmail(funcName + ' \n' + errorText);
                                    }
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    return check.error(funcName, errorText, mainCB);
                                } else if (!body) {
                                    return check.error(funcName, ' body is empty', mainCB);
                                }


                                let $ = cheerio.load(body);

                                let korttid = false;
                                let area = 0;
                                let rooms = 0;
                                let price = 0;


                                [
                                    '.banner-title',
                                    '.post-title',
                                    '.banner-description',
                                    '.info-item .data'
                                ].every(selector => {

                                    $(selector).each(function () {
                                        let txt = $(this).text().toLowerCase();
                                        let labelText = $(this).parent().contents().get(0).nodeValue;


                                        if (!(korttid)) {
                                            korttid = txt.contains('korttid') || (txt.contains('kort') && txt.contains('kontrakt'));
                                        }

                                        if (rooms < 1) {
                                            let matches = txt.match(/((\d[.,])?\d)\s*?(rok|rum)/mi);

                                            try {
                                                rooms = parseFloat(matches[1].replace(/(?![,.])\D/g, '').replace(/,/g, '.')) || 0;


                                            } catch (e) {

                                            }

                                            if (rooms < 1 && labelText.contains('Rok', 'Rum')) {
                                                try {
                                                    rooms = parseFloat(txt.replace(/(?![,.])\D/g, '').replace(/,/g, '.')) || 0;
                                                } catch (e) {

                                                }
                                            }
                                        }

                                        if (area < 10) {
                                            let matches = txt.match(/((\d{1,3}[.,])?\d{1,3})\s*?(kvm)/mi);
                                            try {
                                                area = parseFloat(matches[1].replace(/(?![,.])\D/g, '').replace(/,/g, '.')) || 0;

                                            } catch (e) {

                                            }

                                            if (area < 10 && labelText.contains('Area')) {
                                                try {
                                                    area = parseFloat(txt.replace(/(?![,.])\D/g, '').replace(/,/g, '.')) || 0;

                                                } catch (e) {

                                                }
                                            }
                                        }


                                        if (price < 1000) {

                                            let matches;

                                            if (labelText.contains('Hyra')) {
                                                matches = txt.split('krav')[0].match(/((\d{1,2}[., ])?\d*?)\s*?(kr|sek|:-)/mi);
                                            } else {
                                                matches = txt.split('krav')[0].match(/((\d{1,2}[., ])?\d*?)\s*?(kr\s*?\/\s*?mån|sek\s*?\/\s*?mån|:-\s*?\/\s*?mån)/mi);
                                            }

                                            try {
                                                price = parseInt(matches[1].replace(/\D/g, '')) || 0;

                                            } catch (e) {

                                            }

                                            if (price < 1000 && labelText.contains('Hyra')) {
                                                try {
                                                    price = parseFloat(txt.split('krav')[0].replace(/\D/g, '')) || 0;
                                                } catch (e) {

                                                }
                                            }

                                        }


                                    });
                                    return true;
                                });


                                // Cheerio :icontains for case insesitive
                                /*
                                                            let roomsPossibleLocations = [
                                                                '.banner-title',
                                                                '.post-title',
                                                                '.banner-description',
                                                                '.info-item:icontains("Rok") .data',
                                                                '.info-item:icontains("Rum") .data',
                                                                '.info-item:icontains("Area") .data',
                                                                '.info-item:icontains("Om") .data',
                                                                '.info-item:icontains("Övrigt") .data',
                                                                '.info-item:icontains("Kontraktstyp") .data'
                                                            ];


                                                            roomsPossibleLocations.every(selector => {

                                                                let txt = $(selector).eq(0).text().trim().toLowerCase();

                                                                // /[^0-9]*?(\d{1,2})\s*?(rok|rum)/gmi

                                                                let matches = txt.match(/((\d[.,])?\d)\s*?(rok|rum)/mi);

                                                                rooms = matches !== null ? (parseFloat(matches[1].replace(/(?!,)\D/g, '').replace(/,/g, '.')) || 0) : 0;

                                                                return !(rooms > 0)
                                                            });





                                                            let areaPossibleLocations = [
                                                                '.info-item:icontains("Area") .data',
                                                                '.info-item:icontains("Om") .data',
                                                                '.info-item:icontains("Övrigt") .data',
                                                                '.banner-title',
                                                                '.post-title',
                                                                '.banner-description',
                                                                '.info-item:icontains("Rok") .data',
                                                                '.info-item:icontains("Rum") .data',
                                                                '.info-item:icontains("Kontraktstyp") .data'
                                                            ];


                                                            areaPossibleLocations.every(selector => {

                                                                let txt = $(selector).eq(0).text().trim().toLowerCase();

                                                                // /[^0-9]*?(\d{1,2})\s*?(rok|rum)/gmi

                                                                let matches = txt.match(/((\d{1,3}[.,])?\d{1,3})\s*?(kvm)/mi);

                                                                area = matches !== null ? (parseFloat(matches[1].replace(/(?!,)\D/g, '').replace(/,/g, '.')) || 0) : 0;

                                                                return !(area > 0)
                                                            }); */


                                //var price = $('.info-item:icontains("Hyra") .data').eq(0).text().split('krav')[0].split(':-')[0].split('/')[0].trim().replace(/\D/g, '') || parseInt($('.info-item:icontains("Årshyra") .data').eq(0).text().split('krav')[0].split(':-')[0].split('/')[0].replace(/\D/g, '')) || 0;
                                //let id = $('.info-item:icontains("Objektsnummer") .data').eq(0).text().trim();
                                let id = $('.info-item:contains("Objektsnummer") .data').eq(0).text().trim();

                                if (apartmentIsInvalid(id, price, rooms, area)) {
                                    console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                }


                                localApartments.push({
                                    id: id,
                                    site: funcName,
                                    rooms: rooms,
                                    price: price,
                                    area: area,
                                    url: url,
                                    added: dateTimeCache,
                                    type: korttid ? 'normal' : 'fast',
                                    info: {}
                                });


                                if (++apartmentsCount == ads.length) {
                                    return check.done(mainCB, funcName, localApartments);
                                }


                            });
                        } else if (++apartmentsCount == ads.length) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    } else {
                        return check.error(funcName, ' url is undefined or null', mainCB);
                    }
                });
            });
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }
    },
    sollentunahem: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';

        // Kontraktet gick till en annan sökande
        // Du har inte blivit erbjuden visning
        // 40% av inkomsten


        delete check.errorsObj[funcName];

        try {
            request({
                uri: 'https://minasidor.sollentunahem.se/ledigt/lagenhet',
                method: "GET",
                headers: {
                    'Origin': 'https://minasidor.sollentunahem.se',
                },
                followRedirect: false,
                jar: cookies,
            }, function (err, res, body) {
                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                var $ = cheerio.load(body);


                if (!($('[id$=ObjectList_Container] [class^=listitem]:has(.gridcell)').length)) {
                    return check.done(mainCB, funcName, localApartments);
                }

                var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                if (!(eventvalidation && viewstate && viewstategenerator)) {
                    return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                }


                var noOfPages = parseInt($('div.navbar [id$=_lblNoOfPages]').eq(0).text().replace(/\D/g, '') || 1);
                var bodysArr = [body];
                var functionList = [];


                var processPages = function processPages(bodysArr, cb) {

                    if (typeof bodysArr !== "object" || !bodysArr.length || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    var pageCount = 0;

                    bodysArr.forEach(function (pageBody) {
                        if (check.errorsObj.hasOwnProperty(funcName)) {
                            return;
                        }

                        var $ = cheerio.load(pageBody);
                        var apartments = $('[id$=ObjectList_Container] [class^=listitem]:has(.gridcell)');


                        if (!(apartments.length) && pageCount == bodysArr.length - 1) {
                            return cb();
                        } else if (!(apartments.length)) {
                            return pageCount++;
                        }


                        apartments.each(function (i) {

                            if (check.errorsObj.hasOwnProperty(funcName)) {
                                return false;
                            }

                            var apartment = apartments.eq(i);

                            // || type == 'junior'
                            // https://minasidor.sollentunahem.se/Res/Themes/Sollentunahem/Img/ico_directsearch.gif

                            var typeTextsArr = apartment.find('.gridcell img').map(function () {
                                return $(this).attr('src').toLowerCase().trim();
                            }).toArray();

                            if (typeTextsArr.some(text => text.contains('direct'))) {

                                var url = 'https://minasidor.sollentunahem.se/ledigt/' + apartment.find('a[id$=ObjectDetailsUrl]').eq(0).attr('href');
                                var interestAmount = parseInt(apartment.find('[id$=ObjectInterestCount]').eq(0).text()) || 0;

                                var apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                                    if (dbApartment.url == url && dbApartment.price > 0) {
                                        dbApartment.interestAmount = interestAmount;
                                        localApartments.push(dbApartment);
                                        return true;
                                    }
                                    return false;
                                });

                                // Just for logging in proxy
                                if (!apartmentinDb) {
                                    request({
                                        uri: url,
                                        method: "GET",
                                        headers: {
                                            'Origin': 'https://minasidor.sollentunahem.se',
                                        },
                                        followRedirect: false,
                                        jar: cookies,

                                    }, function (err, res, body) {
                                        if (err) {
                                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                        } else if (res.statusCode != 200) {
                                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                            if (isRedirect(res.statusCode)) {
                                                sendErrorEmail(funcName + ' \n' + errorText);
                                            }
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                            return check.error(funcName, errorText, mainCB);
                                        } else if (!body) {
                                            return check.error(funcName, ' body is empty', mainCB);
                                        }

                                    });
                                }

                                let id = url.split('/').pop();
                                let rooms = parseInt(apartment.find('[id$="NoOfRooms"]').eq(0).text().replace(/\D/g, '')) || 0;
                                let price = parseInt(apartment.find('.gridcell').eq(6).text().replace(/\D/g, '')) || 0;
                                let area = parseInt(apartment.find('[id$="_Size"]').eq(0).text().replace(/\D/g, '')) || 0;


                                if (apartmentIsInvalid(id, price, rooms, area)) {
                                    console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                }


                                localApartments.push({
                                    id: id,
                                    site: funcName,
                                    rooms: rooms,
                                    price: price,
                                    area: area,
                                    url: url,
                                    added: dateTimeCache,
                                    interestAmount: interestAmount,
                                    type: 'fast',
                                    info: {}
                                });

                            }

                        });

                        if (++pageCount == bodysArr.length) {
                            return cb();
                        }
                    })

                };
                var getPage = function getPage(pageNr, cb) {

                    if (isNaN(pageNr) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    let index = 0;

                    if (noOfPages < 6 || pageNr < 4) {
                        index = pageNr-1
                    } else if (noOfPages - pageNr === 0) {
                        index = 4;
                    } else {
                        index = 3;
                    }

                    request({
                        uri: 'https://minasidor.sollentunahem.se/ledigt/lagenhet',
                        method: "POST",
                        headers: {
                            'Origin': 'https://minasidor.sollentunahem.se',
                            'Referer': 'https://minasidor.sollentunahem.se/ledigt/lagenhet',
                        },
                        jar: cookies,
                        form: {
                            '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ucNavBar$rptButtons$ctl' + String((index)).padStart(2, '0') + '$btnPage',
                            '__EVENTARGUMENT': '',
                            '__VIEWSTATE': viewstate,
                            '__VIEWSTATEGENERATOR': viewstategenerator,
                            '__EVENTVALIDATION': eventvalidation,
                            'ctl00$ctl01$hdnBrowserCheck': '',
                            'ctl00$ctl01$hdnRequestVerificationToken': ''
                        },
                    }, function (err, res, body) {

                        if (err) {
                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                        } else if (res.statusCode != 200) {
                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                            if (isRedirect(res.statusCode)) {
                                sendErrorEmail(funcName + ' \n' + errorText);
                            }
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, errorText, mainCB);
                        } else if (!body) {
                            return check.error(funcName, ' body is empty', mainCB);
                        }

                        eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                        viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                        viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];
                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                        }


                        bodysArr.push(body);

                        if (bodysArr.length == noOfPages) {
                            return cb();
                        }
                    })
                };


                for (let i = 1; i < noOfPages; i++) {
                    functionList.push(function (cb) {
                        getPage((i + 1), cb);
                    })
                }


                async.series(functionList, function () {
                    processPages(bodysArr, function () {
                        if (!(check.errorsObj.hasOwnProperty(funcName))) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    });
                });


            })
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }


    },
    telge: function (cb) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var localApartments = [];
        var cookies = request.jar();
        var dateTimeCache = getDateTime();
        check.lastCheckedObj[funcName] = check.lastCheckedObj[funcName] || {};
        check.lastCheckedObj[funcName]['lastChecked'] = dateTimeCache;
        check.lastCheckedObj[funcName]['status'] = 'checking';


        delete check.errorsObj[funcName];

        try {
            request({
                //uri: 'https://hyresborsen.telge.se/Res/Themes/Telgebostader/Pages/HSS/Object/ObjectListB.aspx?objectgroup=1&action=Ava***REMOVED***ble',
                uri: 'https://hyresborsen.telge.se/res/themes/telgebostader/pages/public/objectlistpublicb.aspx?objectgroup=1',
                method: "GET",
                headers: {
                    'Origin': 'https://hyresborsen.telge.se',
                },
                followRedirect: false,
                jar: cookies,
            }, function (err, res, body) {
                if (err) {
                    return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                } else if (res.statusCode != 200) {
                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                    sendErrorEmail(funcName + ': list is empty? statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode]);
                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                    return check.error(funcName, errorText, mainCB);
                } else if (!body) {
                    return check.error(funcName, ' body is empty', mainCB);
                }

                var $ = cheerio.load(body);


                if (!($('[id$=_grdList] tr[class^=listitem]:has(td.gridcell)').length)) {
                    return check.done(mainCB, funcName, localApartments);
                }

                var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                if (!(eventvalidation && viewstate && viewstategenerator)) {
                    return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                }


                var noOfPages = parseInt($('div.navbar [id$=_lblNoOfPages]').eq(0).text().replace(/\D/g, '') || 1);
                var bodysArr = [body];
                var functionList = [];


                var processPages = function processPages(bodysArr, cb) {

                    if (typeof bodysArr !== "object" || !bodysArr.length || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    var pageCount = 0;

                    bodysArr.forEach(function (pageBody) {
                        if (check.errorsObj.hasOwnProperty(funcName)) {
                            return;
                        }

                        var $ = cheerio.load(pageBody);
                        var ads = $('[id$=_grdList] tr[class^=listitem]:has(td.gridcell)');
                        var apartmentsCount = 0;


                        if (!(ads.length) && pageCount == bodysArr.length - 1) {
                            return cb();
                        } else if (!(ads.length)) {
                            return pageCount++;
                        }


                        ads.each(function (i) {

                            if (check.errorsObj.hasOwnProperty(funcName)) {
                                return false;
                            }

                            var apartment = ads.eq(i);

                            // || type == 'junior'
                            // https://hyresborsen.telge.se/res/themes/telgebostader/Img/ico_direct.png

                            var typeTextsArr = apartment.find('.gridcell img').map(function () {
                                return $(this).attr('src').toLowerCase().trim();
                            }).toArray();

                            if (typeTextsArr.some(text => text.contains('direct'))) {

                                var url = 'https://hyresborsen.telge.se/res/themes/telgebostader/pages/public/' + apartment.find('a[id*="_hlDetails"]').eq(0).attr('href').replace(/(\.\.\/)|(cmguid=.+?&)/gi, '');

                                var apartmentinDb = check.dbAva***REMOVED***ble.some(function (dbApartment) {
                                    if (dbApartment.url == url && dbApartment.price > 0) {
                                        dbApartment.info.idUrl = 'https://hyresborsen.telge.se/HSS/Object/ObjectDetailsTemplateB.aspx?id=' + dbApartment.id;
                                        localApartments.push(dbApartment);
                                        return true;
                                    }
                                    return false;
                                });

                                // Just for logging in proxy
                                if (!apartmentinDb) {
                                    request({
                                        uri: url,
                                        method: "GET",
                                        headers: {
                                            'Origin': 'https://hyresborsen.telge.se',
                                        },
                                        followRedirect: false,
                                        jar: cookies,

                                    }, function (err, res, body) {
                                        if (err) {
                                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                        } else if (res.statusCode != 200) {
                                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                            if (isRedirect(res.statusCode)) {
                                                sendErrorEmail(funcName + ' \n' + errorText);
                                            }
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                            return check.error(funcName, errorText, mainCB);
                                        } else if (!body) {
                                            return check.error(funcName, ' body is empty', mainCB);
                                        }

                                        let $ = cheerio.load(body);


                                        let id = $('[id$="ulObjectID"] > li.right').eq(0).text().trim();
                                        let rooms = parseInt($('.grid .left:contains("Rum:")').next().eq(0).text().replace(/\D/g, '')) || 0;
                                        let price = parseInt($('[id$="trCost"] > li.right').eq(0).text().replace(/\D/g, '')) || 0;
                                        let area = parseInt($('[id$="ulSize"]').eq(0).text().replace(/\D/g, '')) || 0;


                                        if (apartmentIsInvalid(id, price, rooms, area)) {
                                            console.log(`Invalid ${funcName} apartment with ID: ${id}`.red);
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        }


                                        localApartments.push({
                                            id: id,
                                            site: funcName,
                                            rooms: rooms,
                                            price: price,
                                            area: area,
                                            url: url,
                                            added: dateTimeCache,
                                            type: 'fast',
                                            info: {
                                                idUrl: 'https://hyresborsen.telge.se/HSS/Object/ObjectDetailsTemplateB.aspx?id=' + id
                                            }
                                        });

                                        if (++apartmentsCount == ads.length) {

                                            if (pageCount == bodysArr.length - 1) {
                                                return cb();
                                            } else {
                                                pageCount++;
                                            }
                                        }


                                    });
                                } else if (++apartmentsCount == ads.length) {

                                    if (pageCount == bodysArr.length - 1) {
                                        return cb();
                                    } else {
                                        pageCount++;
                                    }
                                }

                            } else if (++apartmentsCount == ads.length) {

                                if (pageCount == bodysArr.length - 1) {
                                    return cb();
                                } else {
                                    pageCount++;
                                }
                            }
                        });
                    })

                };
                var getPage = function getPage(pageNr, cb) {

                    if (isNaN(pageNr) || check.errorsObj.hasOwnProperty(funcName)) {
                        return cb();
                    }

                    let index = 0;

                    if (noOfPages < 6 || pageNr < 4) {
                        index = pageNr-1
                    } else if (noOfPages - pageNr === 0) {
                        index = 4;
                    } else {
                        index = 3;
                    }

                    request({
                        uri: 'https://hyresborsen.telge.se/res/themes/telgebostader/pages/public/objectlistpublicb.aspx?objectgroup=1&action=Ava***REMOVED***ble',
                        method: "POST",
                        headers: {
                            'Origin': 'https://hyresborsen.telge.se',
                            'Referer': 'https://hyresborsen.telge.se/res/themes/telgebostader/pages/public/objectlistpublicb.aspx?objectgroup=1&action=Ava***REMOVED***ble',
                        },
                        jar: cookies,
                        form: {
                            '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ctl00$rptButtons$ctl' + String((index)).padStart(2, '0') + '$btnPage',
                            '__EVENTARGUMENT': '',
                            '__VIEWSTATE': viewstate,
                            '__VIEWSTATEGENERATOR': viewstategenerator,
                            '__EVENTVALIDATION': eventvalidation,
                            'ctl00$ctl01$hdnBrowserCheck': '',
                            'ctl00$ctl01$hdnRequestVerificationToken': ''
                        },
                    }, function (err, res, body) {

                        if (err) {
                            return check.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                        } else if (res.statusCode != 200) {
                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                            if (isRedirect(res.statusCode)) {
                                sendErrorEmail(funcName + ' \n' + errorText);
                            }
                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                            return check.error(funcName, errorText, mainCB);
                        } else if (!body) {
                            return check.error(funcName, ' body is empty', mainCB);
                        }

                        eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                        viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                        viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];
                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                        }


                        bodysArr.push(body);

                        if (bodysArr.length == noOfPages) {
                            return cb();
                        }
                    })
                };


                for (let i = 1; i < noOfPages; i++) {
                    functionList.push(function (cb) {
                        getPage((i + 1), cb);
                    })
                }


                async.series(functionList, function () {
                    processPages(bodysArr, function () {
                        if (!(check.errorsObj.hasOwnProperty(funcName))) {
                            return check.done(mainCB, funcName, localApartments);
                        }
                    });
                });


            })
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail(funcName + ' \n' + errorText);
            return check.error(funcName, errorText, mainCB);
        }

    },
};

let auto = {
    errorsObj: {},
    currentlyRunning: false,
    all: function (cb, toExcludeArr) {
        if (typeof cb !== "function") {
            cb = function () {
            };
        }
        toExcludeArr = toExcludeArr || [];

        if (auto.currentlyRunning) {
            return cb();
        }

        toExcludeArr.forEach(site => console.log(('AUTO Excluding: ' + site).red));

        var allList = [];
        var toExclude = ['all', 'done', 'error', 'errorsObj', 'currentlyRunning'].concat(permanentlyExcluded).concat(toExcludeArr);
        for (var prop in auto) {
            if (auto.hasOwnProperty(prop) && !(toExclude.contains(prop))) {
                allList.push(auto[prop]);
            }
        }

        async.parallel(allList, function () {
            auto.currentlyRunning = false;
            cb();
        });

    },
    done: function (cb, funcName, err) {
        if (!(auto.errorsObj.hasOwnProperty(funcName))) {
            if (typeof err !== "undefined") {
                auto.errorsObj[funcName] = err;
            }
            return typeof cb == "function" ? cb(null) : null;
        }
    },
    error: function (funcName, err, cb) {
        err = (getDateTime() + ' AUTO ' + funcName + ': ' + err).red;
        if (config.debug) {
            console.log('error: AUTO ' + funcName);
        }
        console.log(err);
        auto.done(cb, funcName, err);
        //return auto.errorsObj[funcName] = err;
    },
    hhem: function (cb, apartmentsArr) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var cookiesArr = [];
        var usersFilteredApartmentsArr = [];

        var maxInterestList = 3;
        var urlsObj = {
            loginPage: 'https://bostad.hasselbyhem.se/User/MyPagesLogin.aspx',
            interestList: 'https://bostad.hasselbyhem.se/HSS/ObjectInterest/ListInterest.aspx',
            ava***REMOVED***bleList: 'https://bostad.hasselbyhem.se/HSS/Object/object_list.aspx?objectgroup=1&action=Ava***REMOVED***ble',
            addApartmentButtonText: 'Anmäl intresse',
            loginButtonText: 'OK',
            interestListRemoveText: 'Du har inte blivit erbjuden visning',
            interestListRemoveText2: 'till en annan sökande',
            origin: 'https://bostad.hasselbyhem.se'
        };

        /*var request = request.defaults(
            {
                headers: {
                    'Origin': urlsObj.origin,
                }
            }
        );*/

        delete auto.errorsObj[funcName];

        try {


            apartmentsArr = typeof apartmentsArr !== "object" ? check.ava***REMOVED***ble : apartmentsArr;


            apartmentsArr = apartmentsArr.filter(apartment => apartment.site == funcName);
            if (!apartmentsArr.length || config.users.length < 1) {
                return auto.done(mainCB, funcName);
            }

            async.eachOfSeries(config.users, function (user, userIndex, cb) {

                var listInterestIDs = [];

                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {


                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];

                        var ava***REMOVED***bleApartmentsInInterestlist = 0;

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1)
                                && apartment.rooms > user.auto[funcName].minRooms - 1
                                && apartment.price - 1 < user.auto[funcName].maxPrice
                                && !(apartment.info.hasOwnProperty('interestList')
                                    && apartment.info.interestList.contains(user.name.toLowerCase()))
                                && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))
                                && !(apartment.interestAmount > 999)) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                            if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {
                                ava***REMOVED***bleApartmentsInInterestlist++;
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {
                            return cb();
                        }

                        // Sorted by rooms and then by interestAmount
                        var minValueOfInterestAmount = Math.min(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));
                        var maxValueOfInterestAmount = Math.max(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));

                        if (maxValueOfInterestAmount - minValueOfInterestAmount > 400) {
                            usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.rooms > b.rooms ? 1 : (a.rooms === b.rooms ? (a.interestAmount > b.interestAmount ? 1 : -1) : -1));
                        } else {
                            usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));

                        }


                        var removeAds = function (apartmentsToRemove, cb, removeAmount) {

                            removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                            if (!apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var remove = function (apartment, cb) {
                                request({
                                    uri: apartment.deleteUrl,
                                    method: "GET",
                                    headers: {
                                        'Referer': urlsObj.interestList,
                                        'Origin': urlsObj.origin,
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when deleting ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText + ' when deleting ad ' + apartment.id, mainCB);
                                    }

                                    console.log(getDateTime() + '  [' + user.name + '] Removed AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');


                                    return typeof cb === "function" ? cb() : null;
                                });
                            };


                            var functionList = [];
                            for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                functionList.push(function (cb) {
                                    remove(apartmentsToRemove[i], cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };
                        var addAds = function (addAmount, cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!(apartment.interestAmount > 999) && !addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next ' + funcName.toUpperCase() + ' Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (apartment.interestAmount > 999) {
                                    console.log(getDateTime() + '  [' + user.name + '] [' + apartment.id + '] max1000' + funcName);

                                    return tryNext();
                                } else if (addedIDs.contains(apartment.id) || listInterestIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);

                                request({
                                    uri: apartment.url,
                                    method: "GET",
                                    headers: {
                                        'Referer': urlsObj.ava***REMOVED***bleList,
                                        'Origin': urlsObj.origin,
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex]

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when  adding 1/2 ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    }


                                    var $ = cheerio.load(body);


                                    if (!$('[id$=btnRegister].btn_interest').length) {
                                        console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                        return tryNext();

                                    } else {
                                        //var objNr = $('[id$="ulObjectID"] > li.right').eq(0).text();

                                        var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                        var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                        var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                                        }


                                        request({
                                            uri: apartment.url,
                                            method: "POST",
                                            headers: {
                                                'Referer': apartment.url,
                                                'Origin': urlsObj.origin,
                                            },
                                            jar: cookiesArr[userIndex],
                                            encoding: 'binary',
                                            form: {
                                                '__EVENTTARGET': '',
                                                '__EVENTARGUMENT': '',
                                                '__VIEWSTATE': viewstate,
                                                '__VIEWSTATEGENERATOR': viewstategenerator,
                                                '__EVENTVALIDATION': eventvalidation,
                                                'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                                'ctl00$ctl01$SearchSimple$txtSearch': '',
                                                'ctl00$ctl01$hdnBrowserCheck': '',
                                                'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$btnRegister': 'Anmäl intresse'
                                            },
                                        }, function (err, res, body) {

                                            if (err) {
                                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when  adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                return auto.error(funcName, 'statuscode != 200||302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!body) {
                                                return auto.error(funcName, ' body is empty', mainCB);
                                            }


                                            var $ = cheerio.load(body);
                                            var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                            if (errorElement.length) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorElement.eq(0).text() + '!').red);

                                                return tryNext();

                                            } else {

                                                console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');

                                                apartment.info.interestList = apartment.info.interestList || [];

                                                apartment.info.interestList.push(user.name.toLowerCase());

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                cb();
                                            }

                                        });
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: urlsObj.loginPage,
                            method: "GET",
                            followRedirect: false,
                            headers: {
                                'Origin': urlsObj.origin,
                            },
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 200) {
                                let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (isRedirect(res.statusCode)) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, errorText, mainCB);
                            } else if (!body) {
                                return auto.error(funcName, ' body is empty', mainCB);
                            }

                            var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                            var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                            var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                            if (!(eventvalidation && viewstate && viewstategenerator)) {
                                return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                            }

                            request({
                                uri: res.request.uri.href,
                                method: "POST",
                                headers: {
                                    'Referer': urlsObj.loginPage,
                                    'Origin': urlsObj.origin,
                                },
                                jar: cookiesArr[userIndex],
                                encoding: 'binary',
                                form: {
                                    '__LASTFOCUS': '',
                                    '__EVENTTARGET': '',
                                    '__EVENTARGUMENT': '',
                                    '__VIEWSTATE': viewstate,
                                    '__VIEWSTATEGENERATOR': viewstategenerator,
                                    '__EVENTVALIDATION': eventvalidation,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtUserID': user.pNummer.replace(/-/g, ''),
                                    "ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPassword": user.auto[funcName].password,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$btnLogin': 'OK',
                                    'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                    'ctl00$ctl01$SearchSimple$txtSearch': '',
                                    'ctl00$ctl01$hdnBrowserCheck': ''
                                },
                            }, function (err, res, body) {

                                if (err) {
                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                } else if (!body) {
                                    return auto.error(funcName, ' body is empty', mainCB);
                                }


                                var $ = cheerio.load(body);
                                var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                if (errorElement.length) {
                                    var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';

                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                    console.log((errorText).red);

                                    sendErrorEmail(errorText);

                                    return cb();

                                }


                                request({
                                    uri: urlsObj.interestList,
                                    method: "GET",
                                    headers: {
                                        'Referer': urlsObj.loginPage,
                                        'Origin': urlsObj.origin,
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }

                                    var $ = cheerio.load(body);
                                    var interestListAds = $('tr > td:has(.interest-footer p)');

                                    var apartmentsToRemove = [];

                                    interestListAds.each(function (i) {
                                        var ad = interestListAds.eq(i);
                                        var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                        //price could be 0 if price is in details text
                                        var price = parseInt(ad.find('ul li:has([id$=lblCostApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var rum = parseInt(ad.find('ul li:has([id$=lblNoOfRoomsApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var deleteUrlPath = ad.find('[id$=_hlDeleteTxtApartment]').eq(0).attr('href') || '';
                                        var statusText = ad.find('.interest-footer p').eq(0).text().trim();
                                        var adUrl = urlsObj.origin + ad.find('[id$=DetailsTxtApartment]').eq(0).attr('href');

                                        // Remove IDs that are already in interest list
                                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment => apartment.id != id);

                                        if ((statusText.contains(urlsObj.interestListRemoveText) || statusText.contains(urlsObj.interestListRemoveText2)) && deleteUrlPath.length) {
                                            apartmentsToRemove.push({
                                                id: id,
                                                price: price,
                                                rooms: rum,
                                                url: adUrl,
                                                deleteUrl: urlsObj.origin + deleteUrlPath
                                            })
                                        } else {


                                            listInterestIDs.push(id);
                                        }

                                    });


                                    check.dbAva***REMOVED***ble
                                        .filter(dbApartment => dbApartment.site == funcName)
                                        .forEach(function (apartment) {

                                            if (listInterestIDs.contains(apartment.id) && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {

                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());


                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                            } else if (!(listInterestIDs.contains(apartment.id)) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                if ((apartment.info.interestList).length < 1) {
                                                    delete apartment.info.interestList;
                                                }

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                        });


                                    var emptySlotsAmount = maxInterestList - interestListAds.length;
                                    var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                        (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                            apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;


                                    var addAmount = emptySlotsAmount + removeAmount;


                                    removeAds(apartmentsToRemove, function () {
                                        addAds(addAmount, function () {
                                            return cb();
                                        });
                                    }, removeAmount);

                                })

                            })
                        });
                    } else {
                        // Skip user
                        return cb();
                    }
                } else {
                    return cb();
                }
            }, function (err) {
                return auto.done(mainCB, funcName);
            });


            /* var doneCount = 0;
             config.users.forEach(function (user, userIndex) {

                 var listInterestIDs = [];

                 if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                     if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {


                         cookiesArr[userIndex] = request.jar();
                         usersFilteredApartmentsArr[userIndex] = [];

                         var ava***REMOVED***bleApartmentsInInterestlist = 0;

                         apartmentsArr.forEach(function (apartment) {
                             if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1)
                                 && apartment.rooms > user.auto[funcName].minRooms - 1
                                 && apartment.price - 1 < user.auto[funcName].maxPrice
                                 && !(apartment.info.hasOwnProperty('interestList')
                                     && apartment.info.interestList.contains(user.name.toLowerCase()))
                                 && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))
                                 && !(apartment.interestAmount > 999)) {
                                 usersFilteredApartmentsArr[userIndex].push(apartment);
                             }
                             if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {
                                 ava***REMOVED***bleApartmentsInInterestlist++;
                             }
                         });

                         if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {
                             if (++doneCount == config.users.length) {
                                 return auto.done(mainCB, funcName);
                             }
                             return;
                         }

                         // Sorted by rooms and then by interestAmount
                         var minValueOfInterestAmount = Math.min(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));
                         var maxValueOfInterestAmount = Math.max(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));

                         if (maxValueOfInterestAmount - minValueOfInterestAmount > 400) {
                             usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.rooms > b.rooms ? 1 : (a.rooms === b.rooms ? (a.interestAmount > b.interestAmount ? 1 : -1) : -1));
                         } else {
                             usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));

                         }


                         var removeAds = function (apartmentsToRemove, cb, removeAmount) {

                             removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                             if (!apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                 return typeof cb === "function" ? cb() : null;
                             }

                             var remove = function (apartment, cb) {
                                 request({
                                     uri: apartment.deleteUrl,
                                     method: "GET",
                                     headers: {
                                         'Referer': urlsObj.interestList,
                                         'Origin': urlsObj.origin,
                                     },
                                     followRedirect: false,
                                     jar: cookiesArr[userIndex],

                                 }, function (err, res, body) {

                                     if (err) {
                                         return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when deleting ad ' + apartment.id, mainCB);
                                     } else if (res.statusCode != 200) {
                                         let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                         if (isRedirect(res.statusCode)) {
                                             sendErrorEmail(funcName + ' \n' + errorText);
                                         }
                                         writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                         return auto.error(funcName, errorText + ' when deleting ad ' + apartment.id, mainCB);
                                     }

                                     console.log(getDateTime() + '  [' + user.name + '] Removed AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');


                                     return typeof cb === "function" ? cb() : null;
                                 });
                             };


                             var functionList = [];
                             for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                 functionList.push(function (cb) {
                                     remove(apartmentsToRemove[i], cb);
                                 })
                             }

                             async.series(functionList, function () {
                                 return typeof cb === "function" ? cb() : null;
                             });


                         };
                         var addAds = function (addAmount, cb) {
                             if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                 return typeof cb === "function" ? cb() : null;
                             }

                             var addedIDs = [];

                             var add = function (apartment, cb) {

                                 var tryNext = function () {
                                     var nextApartment = {};
                                     usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                         if (!(apartment.interestAmount > 999) && !addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                             nextApartment = apartment;
                                         }
                                     });

                                     if (Object.keys(nextApartment).length) {
                                         console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next ' + funcName.toUpperCase() + ' Apartment ' + nextApartment.id + '!');
                                         return add(nextApartment, cb);
                                     } else {
                                         return cb();
                                     }
                                 };


                                 if (!apartment.url) {
                                     return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                 }


                                 if (apartment.interestAmount > 999) {
                                     console.log(getDateTime() + '  [' + user.name + '] [' + apartment.id + '] max1000' + funcName);

                                     return tryNext();
                                 } else if (addedIDs.contains(apartment.id) || listInterestIDs.contains(apartment.id)) {
                                     return tryNext();
                                 }


                                 addedIDs.push(apartment.id);

                                 request({
                                     uri: apartment.url,
                                     method: "GET",
                                     headers: {
                                         'Referer': urlsObj.ava***REMOVED***bleList,
                                         'Origin': urlsObj.origin,
                                     },
                                     followRedirect: false,
                                     jar: cookiesArr[userIndex]

                                 }, function (err, res, body) {

                                     if (err) {
                                         return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when  adding 1/2 ad ' + apartment.id, mainCB);
                                     } else if (res.statusCode != 200) {
                                         let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                         if (isRedirect(res.statusCode)) {
                                             sendErrorEmail(funcName + ' \n' + errorText);
                                         }
                                         writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                         return auto.error(funcName, errorText + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                     }


                                     var $ = cheerio.load(body);


                                     if (!$('[id$=btnRegister].btn_interest').length) {
                                         console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                         return tryNext();

                                     } else {
                                         //var objNr = $('[id$="ulObjectID"] > li.right').eq(0).text();

                                         var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                         var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                         var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                         if (!(eventvalidation && viewstate && viewstategenerator)) {
                                             return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                                         }


                                         request({
                                             uri: apartment.url,
                                             method: "POST",
                                             headers: {
                                                 'Referer': apartment.url,
                                                 'Origin': urlsObj.origin,
                                             },
                                             jar: cookiesArr[userIndex],
                                             encoding: 'binary',
                                             form: {
                                                 '__EVENTTARGET': '',
                                                 '__EVENTARGUMENT': '',
                                                 '__VIEWSTATE': viewstate,
                                                 '__VIEWSTATEGENERATOR': viewstategenerator,
                                                 '__EVENTVALIDATION': eventvalidation,
                                                 'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                                 'ctl00$ctl01$SearchSimple$txtSearch': '',
                                                 'ctl00$ctl01$hdnBrowserCheck': '',
                                                 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$btnRegister': 'Anmäl intresse'
                                             },
                                         }, function (err, res, body) {

                                             if (err) {
                                                 return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when  adding 2/2 ad ' + apartment.id, mainCB);
                                             } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                 writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                 return auto.error(funcName, 'statuscode != 200||302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                             } else if (!body) {
                                                 return auto.error(funcName, ' body is empty', mainCB);
                                             }


                                             var $ = cheerio.load(body);
                                             var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                             if (errorElement.length) {
                                                 writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                 console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorElement.eq(0).text() + '!').red);

                                                 return tryNext();

                                             } else {

                                                 console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');

                                                 apartment.info.interestList = apartment.info.interestList || [];

                                                 apartment.info.interestList.push(user.name.toLowerCase());

                                                 DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                 cb();
                                             }

                                         });
                                     }


                                 });

                             };


                             var functionList = [];

                             for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                 functionList.push(function (cb) {
                                     add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                 })
                             }

                             async.series(functionList, function () {
                                 return typeof cb === "function" ? cb() : null;
                             });


                         };

                         request({
                             uri: urlsObj.loginPage,
                             method: "GET",
                             followRedirect: false,
                             headers: {
                                 'Origin': urlsObj.origin,
                             },
                             jar: cookiesArr[userIndex]
                         }, function (err, res, body) {

                             if (err) {
                                 return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                             } else if (res.statusCode != 200) {
                                 let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                 if (isRedirect(res.statusCode)) {
                                     sendErrorEmail(funcName + ' \n' + errorText);
                                 }
                                 writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                 return auto.error(funcName, errorText, mainCB);
                             } else if (!body) {
                                 return auto.error(funcName, ' body is empty', mainCB);
                             }

                             var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                             var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                             var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                             if (!(eventvalidation && viewstate && viewstategenerator)) {
                                 return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                             }

                             request({
                                 uri: res.request.uri.href,
                                 method: "POST",
                                 headers: {
                                     'Referer': urlsObj.loginPage,
                                     'Origin': urlsObj.origin,
                                 },
                                 jar: cookiesArr[userIndex],
                                 encoding: 'binary',
                                 form: {
                                     '__LASTFOCUS': '',
                                     '__EVENTTARGET': '',
                                     '__EVENTARGUMENT': '',
                                     '__VIEWSTATE': viewstate,
                                     '__VIEWSTATEGENERATOR': viewstategenerator,
                                     '__EVENTVALIDATION': eventvalidation,
                                     'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtUserID': user.pNummer.replace(/-/g, ''),
                                     "ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPassword": user.auto[funcName].password,
                                     'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$btnLogin': 'OK',
                                     'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                     'ctl00$ctl01$SearchSimple$txtSearch': '',
                                     'ctl00$ctl01$hdnBrowserCheck': ''
                                 },
                             }, function (err, res, body) {

                                 if (err) {
                                     return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                 } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                     writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                     return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                 } else if (!body) {
                                     return auto.error(funcName, ' body is empty', mainCB);
                                 }


                                 var $ = cheerio.load(body);
                                 var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                 if (errorElement.length) {
                                     var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';

                                     writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                     console.log((errorText).red);

                                     sendErrorEmail(errorText);

                                     if (++doneCount == config.users.length) {
                                         return auto.done(mainCB, funcName);
                                     }

                                     return;

                                 }


                                 request({
                                     uri: urlsObj.interestList,
                                     method: "GET",
                                     headers: {
                                         'Referer': urlsObj.loginPage,
                                         'Origin': urlsObj.origin,
                                     },
                                     followRedirect: false,
                                     jar: cookiesArr[userIndex],

                                 }, function (err, res, body) {

                                     if (err) {
                                         return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                     } else if (res.statusCode != 200) {
                                         let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                         if (isRedirect(res.statusCode)) {
                                             sendErrorEmail(funcName + ' \n' + errorText);
                                         }
                                         writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                         return auto.error(funcName, errorText, mainCB);
                                     } else if (!body) {
                                         return auto.error(funcName, ' body is empty', mainCB);
                                     }

                                     var $ = cheerio.load(body);
                                     var interestListAds = $('tr > td:has(.interest-footer p)');

                                     var apartmentsToRemove = [];

                                     interestListAds.each(function (i) {
                                         var ad = interestListAds.eq(i);
                                         var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                         //price could be 0 if price is in details text
                                         var price = parseInt(ad.find('ul li:has([id$=lblCostApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                         var rum = parseInt(ad.find('ul li:has([id$=lblNoOfRoomsApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                         var deleteUrlPath = ad.find('[id$=_hlDeleteTxtApartment]').eq(0).attr('href') || '';
                                         var statusText = ad.find('.interest-footer p').eq(0).text().trim();
                                         var adUrl = urlsObj.origin + ad.find('[id$=DetailsTxtApartment]').eq(0).attr('href');

                                         // Remove IDs that are already in interest list
                                         usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment => apartment.id != id);

                                         if (statusText.contains(urlsObj.interestListRemoveText) && deleteUrlPath.length) {
                                             apartmentsToRemove.push({
                                                 id: id,
                                                 price: price,
                                                 rooms: rum,
                                                 url: adUrl,
                                                 deleteUrl: urlsObj.origin + deleteUrlPath
                                             })
                                         } else {


                                             listInterestIDs.push(id);
                                         }

                                     });


                                     check.dbAva***REMOVED***ble
                                         .filter(dbApartment => dbApartment.site == funcName)
                                         .forEach(function (apartment) {

                                             if (listInterestIDs.contains(apartment.id) && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {

                                                 apartment.info.interestList = apartment.info.interestList || [];
                                                 apartment.info.interestList.push(user.name.toLowerCase());


                                                 DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                             } else if (!(listInterestIDs.contains(apartment.id)) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                 apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                 if ((apartment.info.interestList).length < 1) {
                                                     delete apartment.info.interestList;
                                                 }

                                                 DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                             }
                                         });


                                     var emptySlotsAmount = maxInterestList - interestListAds.length;
                                     var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                         (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                             apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;


                                     var addAmount = emptySlotsAmount + removeAmount;


                                     removeAds(apartmentsToRemove, function () {
                                         addAds(addAmount, function () {
                                             if (++doneCount == config.users.length) {
                                                 return auto.done(mainCB, funcName);
                                             }
                                         });
                                     }, removeAmount);

                                 })

                             })
                         });
                     } else {
                         // Skip user
                         if (++doneCount == config.users.length) {
                             return auto.done(mainCB, funcName);
                         }
                     }
                 } else {
                     return auto.done(mainCB, funcName);
                 }
             });*/
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail('AUTO' + funcName + ' \n' + errorText);
            return auto.error(funcName, errorText, mainCB);
        }

    },
    vasbyhem: function (cb, apartmentsArr) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var cookiesArr = [];
        var usersFilteredApartmentsArr = [];

        var maxInterestList = 10;
        delete auto.errorsObj[funcName];

        try {
            apartmentsArr = typeof apartmentsArr !== "object" ? check.ava***REMOVED***ble : apartmentsArr;


            apartmentsArr = apartmentsArr.filter(apartment => apartment.site == funcName);
            if (!apartmentsArr.length || config.users.length < 1) {
                return auto.done(mainCB, funcName);
            }


            async.eachOfSeries(config.users, function (user, userIndex, cb) {


                var listInterestIDs = [];

                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];


                        var ava***REMOVED***bleApartmentsInInterestlist = 0;

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1)
                                && apartment.rooms > user.auto[funcName].minRooms - 1
                                && apartment.price - 1 < user.auto[funcName].maxPrice
                                && !(apartment.info.hasOwnProperty('interestList')
                                    && apartment.info.interestList.contains(user.name.toLowerCase()))
                                && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                            if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {
                                ava***REMOVED***bleApartmentsInInterestlist++;
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {

                            return cb();
                        }

                        // Sorted by rooms and then by interestAmount
                        var minValueOfInterestAmount = Math.min(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));
                        var maxValueOfInterestAmount = Math.max(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));

                        if (maxValueOfInterestAmount - minValueOfInterestAmount > 400) {
                            usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.rooms > b.rooms ? 1 : (a.rooms === b.rooms ? (a.interestAmount > b.interestAmount ? 1 : -1) : -1));
                        } else {
                            usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));

                        }


                        var removeAds = function (apartmentsToRemove, cb, removeAmount) {

                            removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                            if (!apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var remove = function (apartment, cb) {
                                request({
                                    uri: apartment.deleteUrl,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://www.vasbyhem.se',
                                        'Referer': 'https://www.vasbyhem.se/mina-sidor/intresseanmalningar',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when deleting ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText + ' when deleting ad ' + apartment.id, mainCB);
                                    }

                                    console.log(getDateTime() + '  [' + user.name + '] Removed AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                    return typeof cb === "function" ? cb() : null;
                                });
                            };

                            var functionList = [];
                            for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                functionList.push(function (cb) {
                                    remove(apartmentsToRemove[i], cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });

                        };
                        var addAds = function (addAmount, cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next VASBYHEM Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (addedIDs.contains(apartment.id) || listInterestIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);

                                request({
                                    uri: apartment.url,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://www.vasbyhem.se',
                                        'Referer': 'https://www.vasbyhem.se/ledigt/lagenhet',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex]

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    }


                                    var $ = cheerio.load(body);


                                    if (!$('[id$=btnRegister].btn_interest').length) {
                                        console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                        return tryNext();

                                    } else {
                                        //var objNr = $('[id$="ulObjectID"] > li.right').eq(0).text();

                                        var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                        var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                        var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                                        }


                                        request({
                                            uri: apartment.url,
                                            method: "POST",
                                            headers: {
                                                'Origin': 'https://www.vasbyhem.se',
                                                'Referer': apartment.url,
                                            },
                                            jar: cookiesArr[userIndex],
                                            encoding: 'binary',
                                            form: {
                                                '__EVENTTARGET': '',
                                                '__EVENTARGUMENT': '',
                                                '__VIEWSTATE': viewstate,
                                                '__VIEWSTATEGENERATOR': viewstategenerator,
                                                '__EVENTVALIDATION': eventvalidation,
                                                'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                                'ctl00$ctl01$SearchSimple$txtSearch': '',
                                                'ctl00$ctl01$hdnBrowserCheck': '',
                                                'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$btnRegister': 'Anmäl intresse'
                                            },
                                        }, function (err, res, body) {

                                            if (err) {
                                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                return auto.error(funcName, 'statuscode != 200||302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!body) {
                                                return auto.error(funcName, ' body is empty', mainCB);
                                            }


                                            var $ = cheerio.load(body);
                                            var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                            if (errorElement.length) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorElement.eq(0).text() + '!').red);

                                                return tryNext();

                                            } else {

                                                console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');

                                                apartment.info.interestList = apartment.info.interestList || [];

                                                apartment.info.interestList.push(user.name.toLowerCase());

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                cb();
                                            }

                                        });
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: 'https://www.vasbyhem.se/mina-sidor/logga-in',
                            method: "GET",
                            headers: {
                                'Origin': 'https://www.vasbyhem.se',
                            },
                            followRedirect: false,
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 200) {
                                let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (isRedirect(res.statusCode)) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, errorText, mainCB);
                            } else if (!body) {
                                return auto.error(funcName, ' body is empty', mainCB);
                            }

                            var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                            var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                            var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                            if (!(eventvalidation && viewstate && viewstategenerator)) {
                                return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                            }

                            request({
                                uri: res.request.uri.href,
                                method: "POST",
                                headers: {
                                    'Origin': 'https://www.vasbyhem.se',
                                    'Referer': 'https://www.vasbyhem.se/mina-sidor/logga-in',
                                },
                                jar: cookiesArr[userIndex],
                                encoding: 'binary',
                                form: {
                                    '__LASTFOCUS': '',
                                    '__EVENTTARGET': '',
                                    '__EVENTARGUMENT': '',
                                    '__VIEWSTATE': viewstate,
                                    '__VIEWSTATEGENERATOR': viewstategenerator,
                                    '__EVENTVALIDATION': eventvalidation,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtUserID': user.pNummer,
                                    "ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPassword": user.auto[funcName].password,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$btnLogin': 'Logga in',
                                    'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                    'ctl00$ctl01$SearchSimple$txtSearch': '',
                                    'ctl00$ctl01$hdnBrowserCheck': '',
                                    'ctl00$ctl01$hdnRequestVerificationToken': ''
                                },
                            }, function (err, res, body) {

                                if (err) {
                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                } else if (!body) {
                                    return auto.error(funcName, ' body is empty', mainCB);
                                }


                                var $ = cheerio.load(body);
                                var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                if (errorElement.length) {
                                    var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                    console.log((errorText).red);

                                    sendErrorEmail(errorText);

                                    return cb();

                                }


                                request({
                                    uri: 'https://www.vasbyhem.se/mina-sidor/intresseanmalningar',
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://www.vasbyhem.se',
                                        'Referer': 'https://www.vasbyhem.se/mina-sidor',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }

                                    var $ = cheerio.load(body);
                                    var ads = $('tr > td:has(.interest-footer p)');

                                    var apartmentsToRemove = [];

                                    ads.each(function (i) {
                                        var ad = ads.eq(i);
                                        var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                        //price could be 0 if price is in details text
                                        var price = parseInt(ad.find('ul li:has([id$=lblCostApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var rum = parseInt(ad.find('ul li:has([id$=lblNoOfRoomsApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var deleteUrlPath = ad.find('[id$=_hlDeleteTxtApartment]').eq(0).attr('href') || '';
                                        var statusText = ad.find('.interest-footer p').eq(0).text().trim();
                                        var adUrl = 'https://www.vasbyhem.se' + ad.find('[id$=DetailsTxtApartment]').eq(0).attr('href');

                                        // Remove IDs that are already in interest list
                                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment => apartment.id != id);

                                        if (statusText.contains('Du har inte blivit erbjuden visning') && deleteUrlPath.length) {
                                            apartmentsToRemove.push({
                                                id: id,
                                                price: price,
                                                rooms: rum,
                                                url: adUrl,
                                                deleteUrl: 'https://www.vasbyhem.se' + deleteUrlPath
                                            })
                                        } else {


                                            listInterestIDs.push(id);
                                        }

                                    });


                                    check.dbAva***REMOVED***ble
                                        .filter(dbApartment => dbApartment.site == funcName)
                                        .forEach(function (apartment) {

                                            if (listInterestIDs.contains(apartment.id) && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {

                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());


                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                            } else if (!(listInterestIDs.contains(apartment.id)) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                if ((apartment.info.interestList).length < 1) {
                                                    delete apartment.info.interestList;
                                                }


                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                        });


                                    var emptySlotsAmount = maxInterestList - ads.length;
                                    var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                        (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                            apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;

                                    var addAmount = emptySlotsAmount + removeAmount;


                                    removeAds(apartmentsToRemove, function () {
                                        addAds(addAmount, function () {
                                            return cb();
                                        });
                                    }, removeAmount);

                                })

                            })
                        });
                    } else {
                        // Skip user
                        return cb();
                    }
                } else {
                    return cb();
                }
            }, function (err) {
                return auto.done(mainCB, funcName);
            });

            /*var doneCount = 0;
            config.users.forEach(function (user, userIndex) {

                var listInterestIDs = [];

                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];


                        var ava***REMOVED***bleApartmentsInInterestlist = 0;

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1)
                                && apartment.rooms > user.auto[funcName].minRooms - 1
                                && apartment.price - 1 < user.auto[funcName].maxPrice
                                && !(apartment.info.hasOwnProperty('interestList')
                                    && apartment.info.interestList.contains(user.name.toLowerCase()))
                                && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                            if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {
                                ava***REMOVED***bleApartmentsInInterestlist++;
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {
                            if (++doneCount == config.users.length) {
                                return auto.done(mainCB, funcName);
                            }
                            return;
                        }

                        // Sorted by rooms and then by interestAmount
                        var minValueOfInterestAmount = Math.min(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));
                        var maxValueOfInterestAmount = Math.max(...usersFilteredApartmentsArr[userIndex].map(o => o.interestAmount));

                        if (maxValueOfInterestAmount - minValueOfInterestAmount > 400) {
                            usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.rooms > b.rooms ? 1 : (a.rooms === b.rooms ? (a.interestAmount > b.interestAmount ? 1 : -1) : -1));
                        } else {
                            usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));

                        }


                        var removeAds = function (apartmentsToRemove, cb, removeAmount) {

                            removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                            if (!apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var remove = function (apartment, cb) {
                                request({
                                    uri: apartment.deleteUrl,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://www.vasbyhem.se',
                                        'Referer': 'https://www.vasbyhem.se/mina-sidor/intresseanmalningar',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when deleting ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText + ' when deleting ad ' + apartment.id, mainCB);
                                    }

                                    console.log(getDateTime() + '  [' + user.name + '] Removed AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                    return typeof cb === "function" ? cb() : null;
                                });
                            };

                            var functionList = [];
                            for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                functionList.push(function (cb) {
                                    remove(apartmentsToRemove[i], cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });

                        };
                        var addAds = function (addAmount, cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next VASBYHEM Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (addedIDs.contains(apartment.id) || listInterestIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);

                                request({
                                    uri: apartment.url,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://www.vasbyhem.se',
                                        'Referer': 'https://www.vasbyhem.se/ledigt/lagenhet',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex]

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    }


                                    var $ = cheerio.load(body);


                                    if (!$('[id$=btnRegister].btn_interest').length) {
                                        console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                        return tryNext();

                                    } else {
                                        //var objNr = $('[id$="ulObjectID"] > li.right').eq(0).text();

                                        var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                        var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                        var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                                        }


                                        request({
                                            uri: apartment.url,
                                            method: "POST",
                                            headers: {
                                                'Origin': 'https://www.vasbyhem.se',
                                                'Referer': apartment.url,
                                            },
                                            jar: cookiesArr[userIndex],
                                            encoding: 'binary',
                                            form: {
                                                '__EVENTTARGET': '',
                                                '__EVENTARGUMENT': '',
                                                '__VIEWSTATE': viewstate,
                                                '__VIEWSTATEGENERATOR': viewstategenerator,
                                                '__EVENTVALIDATION': eventvalidation,
                                                'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                                'ctl00$ctl01$SearchSimple$txtSearch': '',
                                                'ctl00$ctl01$hdnBrowserCheck': '',
                                                'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$btnRegister': 'Anmäl intresse'
                                            },
                                        }, function (err, res, body) {

                                            if (err) {
                                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                return auto.error(funcName, 'statuscode != 200||302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!body) {
                                                return auto.error(funcName, ' body is empty', mainCB);
                                            }


                                            var $ = cheerio.load(body);
                                            var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                            if (errorElement.length) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorElement.eq(0).text() + '!').red);

                                                return tryNext();

                                            } else {

                                                console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');

                                                apartment.info.interestList = apartment.info.interestList || [];

                                                apartment.info.interestList.push(user.name.toLowerCase());

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                cb();
                                            }

                                        });
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: 'https://www.vasbyhem.se/mina-sidor/logga-in',
                            method: "GET",
                            headers: {
                                'Origin': 'https://www.vasbyhem.se',
                            },
                            followRedirect: false,
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 200) {
                                let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (isRedirect(res.statusCode)) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, errorText, mainCB);
                            } else if (!body) {
                                return auto.error(funcName, ' body is empty', mainCB);
                            }

                            var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                            var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                            var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                            if (!(eventvalidation && viewstate && viewstategenerator)) {
                                return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                            }

                            request({
                                uri: res.request.uri.href,
                                method: "POST",
                                headers: {
                                    'Origin': 'https://www.vasbyhem.se',
                                    'Referer': 'https://www.vasbyhem.se/mina-sidor/logga-in',
                                },
                                jar: cookiesArr[userIndex],
                                encoding: 'binary',
                                form: {
                                    '__LASTFOCUS': '',
                                    '__EVENTTARGET': '',
                                    '__EVENTARGUMENT': '',
                                    '__VIEWSTATE': viewstate,
                                    '__VIEWSTATEGENERATOR': viewstategenerator,
                                    '__EVENTVALIDATION': eventvalidation,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtUserID': user.pNummer,
                                    "ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPassword": user.auto[funcName].password,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$btnLogin': 'Logga in',
                                    'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                    'ctl00$ctl01$SearchSimple$txtSearch': '',
                                    'ctl00$ctl01$hdnBrowserCheck': '',
                                    'ctl00$ctl01$hdnRequestVerificationToken': ''
                                },
                            }, function (err, res, body) {

                                if (err) {
                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                } else if (!body) {
                                    return auto.error(funcName, ' body is empty', mainCB);
                                }


                                var $ = cheerio.load(body);
                                var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                if (errorElement.length) {
                                    var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                    console.log((errorText).red);

                                    sendErrorEmail(errorText);

                                    if (++doneCount == config.users.length) {
                                        return auto.done(mainCB, funcName);
                                    }

                                    return;

                                }


                                request({
                                    uri: 'https://www.vasbyhem.se/mina-sidor/intresseanmalningar',
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://www.vasbyhem.se',
                                        'Referer': 'https://www.vasbyhem.se/mina-sidor',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }

                                    var $ = cheerio.load(body);
                                    var ads = $('tr > td:has(.interest-footer p)');

                                    var apartmentsToRemove = [];

                                    ads.each(function (i) {
                                        var ad = ads.eq(i);
                                        var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                        //price could be 0 if price is in details text
                                        var price = parseInt(ad.find('ul li:has([id$=lblCostApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var rum = parseInt(ad.find('ul li:has([id$=lblNoOfRoomsApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var deleteUrlPath = ad.find('[id$=_hlDeleteTxtApartment]').eq(0).attr('href') || '';
                                        var statusText = ad.find('.interest-footer p').eq(0).text().trim();
                                        var adUrl = 'https://www.vasbyhem.se' + ad.find('[id$=DetailsTxtApartment]').eq(0).attr('href');

                                        // Remove IDs that are already in interest list
                                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment => apartment.id != id);

                                        if (statusText.contains('Du har inte blivit erbjuden visning') && deleteUrlPath.length) {
                                            apartmentsToRemove.push({
                                                id: id,
                                                price: price,
                                                rooms: rum,
                                                url: adUrl,
                                                deleteUrl: 'https://www.vasbyhem.se' + deleteUrlPath
                                            })
                                        } else {


                                            listInterestIDs.push(id);
                                        }

                                    });


                                    check.dbAva***REMOVED***ble
                                        .filter(dbApartment => dbApartment.site == funcName)
                                        .forEach(function (apartment) {

                                            if (listInterestIDs.contains(apartment.id) && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {

                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());


                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                            } else if (!(listInterestIDs.contains(apartment.id)) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                if ((apartment.info.interestList).length < 1) {
                                                    delete apartment.info.interestList;
                                                }


                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                        });


                                    var emptySlotsAmount = maxInterestList - ads.length;
                                    var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                        (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                            apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;

                                    var addAmount = emptySlotsAmount + removeAmount;


                                    removeAds(apartmentsToRemove, function () {
                                        addAds(addAmount, function () {
                                            if (++doneCount == config.users.length) {
                                                return auto.done(mainCB, funcName);
                                            }
                                        });
                                    }, removeAmount);

                                })

                            })
                        });
                    } else {
                        // Skip user
                        if (++doneCount == config.users.length) {
                            return auto.done(mainCB, funcName);
                        }
                    }
                } else {
                    return auto.done(mainCB, funcName);
                }
            });*/
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail('AUTO' + funcName + ' \n' + errorText);
            return auto.error(funcName, errorText, mainCB);
        }

    },
    vicpark: function (cb, apartmentsArr) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var cookiesArr = [];
        var usersFilteredApartmentsArr = [];

        var maxInterestList = 5;
        delete auto.errorsObj[funcName];

        try {
            apartmentsArr = typeof apartmentsArr !== "object" ? check.ava***REMOVED***ble : apartmentsArr;


            apartmentsArr = apartmentsArr.filter(apartment => apartment.site == funcName);
            if (!apartmentsArr.length || config.users.length < 1) {
                return auto.done(mainCB, funcName);
            }


            async.eachOfSeries(config.users, function (user, userIndex, cb) {

                var listInterestIDs = [];

                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];

                        var ava***REMOVED***bleApartmentsInInterestlist = 0;

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1) && apartment.rooms > user.auto[funcName].minRooms - 1 && apartment.price - 1 < user.auto[funcName].maxPrice && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                            if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {
                                ava***REMOVED***bleApartmentsInInterestlist++;
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {
                            return cb();
                        }

                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


                        var removeAds = function (apartmentsToRemove, cb, removeAmount) {

                            removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                            if (!apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var remove = function (apartment, cb) {
                                request({
                                    uri: apartment.deleteUrl,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://minasidor.victoriapark.se',
                                        'Referer': 'https://minasidor.victoriapark.se/mina-sidor/intresseanmalningar',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {
                                    if (err || res.statusCode != 200) {
                                        if (!err && isRedirect(res.statusCode)) {
                                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when deleting ad: ' + apartment.id;
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }

                                        if (res) {
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        }
                                        return auto.error(funcName, ' err or statuscode != 200 when deleting ad; ' + apartment.id, mainCB);
                                    }

                                    console.log(getDateTime() + '  [' + user.name + '] Removed AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');


                                    return typeof cb === "function" ? cb() : null;
                                });
                            };

                            var functionList = [];
                            for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                functionList.push(function (cb) {
                                    remove(apartmentsToRemove[i], cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });

                        };
                        var addAds = function (addAmount, cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next Vicpark Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (addedIDs.contains(apartment.id) || listInterestIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);

                                request({
                                    uri: apartment.url,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://minasidor.victoriapark.se',
                                        'Referer': 'https://minasidor.victoriapark.se/ledigt/lagenhet',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex]

                                }, function (err, res, body) {

                                    if (err || res.statusCode != 200) {
                                        if (!err && isRedirect(res.statusCode)) {
                                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 1/2 ad: ' + apartment.id;
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        if (res) {
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                        }
                                        return auto.error(funcName, ' err or statuscode != 200 when adding 1/2 ad ' + apartment.id, mainCB);
                                    }


                                    var $ = cheerio.load(body);


                                    if (!$('[id$=btnRegister].btn_interest').length) {
                                        console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                        return tryNext();

                                    } else {
                                        //var objNr = $('[id$="ulObjectID"] > li.right').eq(0).text();

                                        var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                        var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                        var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];
                                        var reqVerificationToken = extractBetweenStrings(body, 'hdnRequestVerificationToken" value="', '" />')[0] || '';


                                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                                        }


                                        request({
                                            uri: apartment.url,
                                            method: "POST",
                                            headers: {
                                                'Origin': 'https://minasidor.victoriapark.se',
                                                'Referer': apartment.url,
                                            },
                                            jar: cookiesArr[userIndex],
                                            form: {
                                                '__EVENTTARGET': '',
                                                '__EVENTARGUMENT': '',
                                                '__VIEWSTATE': viewstate,
                                                '__VIEWSTATEGENERATOR': viewstategenerator,
                                                '__EVENTVALIDATION': eventvalidation,
                                                'ctl00$ctl01$hdnBrowserCheck': '',
                                                'ctl00$ctl01$hdnRequestVerificationToken': reqVerificationToken,
                                                'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$btnRegister': 'Anmäl intresse'
                                            },
                                        }, function (err, res, body) {
                                            if (err) {
                                                return auto.error(funcName, ' err or statuscode != 302 when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                return auto.error(funcName, ' err or statuscode != 302 when adding 2/2 ad ' + apartment.id, mainCB);
                                            }

                                            var $ = cheerio.load(body);
                                            var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                            if (errorElement.length) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorElement.eq(0).text() + '!').red);

                                                return tryNext();

                                            } else {

                                                apartment.info.interestList = apartment.info.interestList || [];
                                                console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                                apartment.info.interestList.push(user.name.toLowerCase());
                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                                cb();
                                            }

                                        });
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: 'https://minasidor.victoriapark.se/mina-sidor/logga-in',
                            method: "GET",
                            headers: {
                                'Origin': 'https://minasidor.victoriapark.se',
                            },
                            followRedirect: false,
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 200) {
                                let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (isRedirect(res.statusCode)) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, errorText, mainCB);
                            } else if (!body) {
                                return auto.error(funcName, ' body is empty', mainCB);
                            }

                            var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                            var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                            var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];
                            var reqVerificationToken = extractBetweenStrings(body, 'hdnRequestVerificationToken" value="', '" />')[0] || '';

                            if (!(eventvalidation && viewstate && viewstategenerator)) {
                                return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                            }


                            request({
                                uri: res.request.uri.href,
                                method: "POST",
                                headers: {
                                    'Origin': 'https://minasidor.victoriapark.se',
                                    'Referer': 'https://minasidor.victoriapark.se/mina-sidor/logga-in',
                                },
                                jar: cookiesArr[userIndex],
                                form: {
                                    '__LASTFOCUS': '',
                                    '__EVENTTARGET': '',
                                    '__EVENTARGUMENT': '',
                                    '__VIEWSTATE': viewstate,
                                    '__VIEWSTATEGENERATOR': viewstategenerator,
                                    '__EVENTVALIDATION': eventvalidation,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtUserID': user.pNummer,
                                    "ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPassword": user.auto[funcName].password,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$btnLogin': 'Logga in',
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPersno': '',
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$hdnToken': '',
                                    'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                    'ctl00$ctl01$SearchSimple$txtSearch': '',
                                    'ctl00$ctl01$hdnBrowserCheck': '',
                                    'ctl00$ctl01$hdnRequestVerificationToken': reqVerificationToken
                                },
                            }, function (err, res, body) {

                                if (err) {
                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                } else if (!body) {
                                    return auto.error(funcName, ' body is empty', mainCB);
                                }

                                var $ = cheerio.load(body);
                                var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                if (errorElement.length) {
                                    var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                    console.log((errorText).red);

                                    sendErrorEmail(errorText);

                                    return cb();

                                }

                                request({
                                    uri: 'https://minasidor.victoriapark.se/mina-sidor/intresseanmalningar',
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://minasidor.victoriapark.se',
                                        'Referer': 'https://minasidor.victoriapark.se/mina-sidor/logga-in',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }

                                    var $ = cheerio.load(body);
                                    var ads = $('tr > td:has(.interest-footer p)');

                                    var apartmentsToRemove = [];

                                    ads.each(function (i) {
                                        var ad = ads.eq(i);
                                        var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                        //price could be 0 if price is in details text
                                        var price = parseInt(ad.find('ul li:has([id$=lblCostApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var rum = parseInt(ad.find('ul li:has([id$=lblNoOfRoomsApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var deleteUrlPath = ad.find('[id$=_hlDeleteTxtApartment]').eq(0).attr('href') || '';
                                        var statusText = ad.find('.interest-footer p').eq(0).text().trim();
                                        var adUrl = 'https://minasidor.victoriapark.se' + ad.find('[id$=DetailsTxtApartment]').eq(0).attr('href');

                                        // Remove IDs that are already in interest list
                                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment => apartment.id != id);

                                        if (statusText.indexOf('Du har inte blivit erbjuden visning') > -1 && deleteUrlPath.length) {
                                            apartmentsToRemove.push({
                                                id: id,
                                                price: price,
                                                rooms: rum,
                                                url: adUrl,
                                                deleteUrl: 'https://minasidor.victoriapark.se' + deleteUrlPath
                                            })
                                        } else {


                                            listInterestIDs.push(id);
                                        }

                                    });


                                    check.dbAva***REMOVED***ble
                                        .filter(dbApartment => dbApartment.site == funcName)
                                        .forEach(function (apartment) {

                                            if (listInterestIDs.contains(apartment.id) && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {


                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                            } else if (!(listInterestIDs.contains(apartment.id)) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                if ((apartment.info.interestList).length < 1) {
                                                    delete apartment.info.interestList;
                                                }

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                        });


                                    var emptySlotsAmount = maxInterestList - ads.length;
                                    var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                        (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                            apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;

                                    var addAmount = emptySlotsAmount + removeAmount;


                                    removeAds(apartmentsToRemove, function () {
                                        addAds(addAmount, function () {
                                            return cb();
                                        });
                                    }, removeAmount);

                                })

                            })
                        });
                    } else {
                        // Skip user
                        return cb();
                    }
                } else {
                    return cb();
                }
            }, function (err) {
                return auto.done(mainCB, funcName);
            });

            /*var doneCount = 0;
            config.users.forEach(function (user, userIndex) {

                var listInterestIDs = [];

                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];

                        var ava***REMOVED***bleApartmentsInInterestlist = 0;

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1) && apartment.rooms > user.auto[funcName].minRooms - 1 && apartment.price - 1 < user.auto[funcName].maxPrice && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                            if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {
                                ava***REMOVED***bleApartmentsInInterestlist++;
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {
                            if (++doneCount == config.users.length) {
                                return auto.done(mainCB, funcName);
                            }
                            return;
                        }

                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


                        var removeAds = function (apartmentsToRemove, cb, removeAmount) {

                            removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                            if (!apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var remove = function (apartment, cb) {
                                request({
                                    uri: apartment.deleteUrl,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://minasidor.victoriapark.se',
                                        'Referer': 'https://minasidor.victoriapark.se/mina-sidor/intresseanmalningar',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {
                                    if (err || res.statusCode != 200) {
                                        if (!err && isRedirect(res.statusCode)) {
                                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when deleting ad: ' + apartment.id;
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }

                                        if (res) {
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        }
                                        return auto.error(funcName, ' err or statuscode != 200 when deleting ad; ' + apartment.id, mainCB);
                                    }

                                    console.log(getDateTime() + '  [' + user.name + '] Removed AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');


                                    return typeof cb === "function" ? cb() : null;
                                });
                            };

                            var functionList = [];
                            for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                functionList.push(function (cb) {
                                    remove(apartmentsToRemove[i], cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });

                        };
                        var addAds = function (addAmount, cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next Vicpark Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (addedIDs.contains(apartment.id) || listInterestIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);

                                request({
                                    uri: apartment.url,
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://minasidor.victoriapark.se',
                                        'Referer': 'https://minasidor.victoriapark.se/ledigt/lagenhet',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex]

                                }, function (err, res, body) {

                                    if (err || res.statusCode != 200) {
                                        if (!err && isRedirect(res.statusCode)) {
                                            let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 1/2 ad: ' + apartment.id;
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        if (res) {
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                        } return auto.error(funcName, ' err or statuscode != 200 when adding 1/2 ad ' + apartment.id, mainCB);
                                    }


                                    var $ = cheerio.load(body);


                                    if (!$('[id$=btnRegister].btn_interest').length) {
                                        console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                        return tryNext();

                                    } else {
                                        //var objNr = $('[id$="ulObjectID"] > li.right').eq(0).text();

                                        var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                        var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                        var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];
                                        var reqVerificationToken = extractBetweenStrings(body, 'hdnRequestVerificationToken" value="', '" />')[0] || '';


                                        if (!(eventvalidation && viewstate && viewstategenerator)) {
                                            return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                                        }


                                        request({
                                            uri: apartment.url,
                                            method: "POST",
                                            headers: {
                                                'Origin': 'https://minasidor.victoriapark.se',
                                                'Referer': apartment.url,
                                            },
                                            jar: cookiesArr[userIndex],
                                            form: {
                                                '__EVENTTARGET': '',
                                                '__EVENTARGUMENT': '',
                                                '__VIEWSTATE': viewstate,
                                                '__VIEWSTATEGENERATOR': viewstategenerator,
                                                '__EVENTVALIDATION': eventvalidation,
                                                'ctl00$ctl01$hdnBrowserCheck': '',
                                                'ctl00$ctl01$hdnRequestVerificationToken': reqVerificationToken,
                                                'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$btnRegister': 'Anmäl intresse'
                                            },
                                        }, function (err, res, body) {
                                            if (err) {
                                                return auto.error(funcName, ' err or statuscode != 302 when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                return auto.error(funcName, ' err or statuscode != 302 when adding 2/2 ad ' + apartment.id, mainCB);
                                            }

                                            var $ = cheerio.load(body);
                                            var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                            if (errorElement.length) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorElement.eq(0).text() + '!').red);

                                                return tryNext();

                                            } else {

                                                apartment.info.interestList = apartment.info.interestList || [];
                                                console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                                apartment.info.interestList.push(user.name.toLowerCase());
                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                                cb();
                                            }

                                        });
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: 'https://minasidor.victoriapark.se/mina-sidor/logga-in',
                            method: "GET",
                            headers: {
                                'Origin': 'https://minasidor.victoriapark.se',
                            },
                            followRedirect: false,
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 200) {
                                let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (isRedirect(res.statusCode)) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, errorText, mainCB);
                            } else if (!body) {
                                return auto.error(funcName, ' body is empty', mainCB);
                            }

                            var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                            var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                            var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];
                            var reqVerificationToken = extractBetweenStrings(body, 'hdnRequestVerificationToken" value="', '" />')[0] || '';

                            if (!(eventvalidation && viewstate && viewstategenerator)) {
                                return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                            }


                            request({
                                uri: res.request.uri.href,
                                method: "POST",
                                headers: {
                                    'Origin': 'https://minasidor.victoriapark.se',
                                    'Referer': 'https://minasidor.victoriapark.se/mina-sidor/logga-in',
                                },
                                jar: cookiesArr[userIndex],
                                form: {
                                    '__LASTFOCUS': '',
                                    '__EVENTTARGET': '',
                                    '__EVENTARGUMENT': '',
                                    '__VIEWSTATE': viewstate,
                                    '__VIEWSTATEGENERATOR': viewstategenerator,
                                    '__EVENTVALIDATION': eventvalidation,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtUserID': user.pNummer,
                                    "ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPassword": user.auto[funcName].password,
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$btnLogin': 'Logga in',
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPersno': '',
                                    'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$hdnToken': '',
                                    'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                    'ctl00$ctl01$SearchSimple$txtSearch': '',
                                    'ctl00$ctl01$hdnBrowserCheck': '',
                                    'ctl00$ctl01$hdnRequestVerificationToken': reqVerificationToken
                                },
                            }, function (err, res, body) {

                                if (err) {
                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                } else if (!body) {
                                    return auto.error(funcName, ' body is empty', mainCB);
                                }

                                var $ = cheerio.load(body);
                                var errorElement = $('[id$="ErrorMessage_lblMessage"]');
                                if (errorElement.length) {
                                    var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                    console.log((errorText).red);

                                    sendErrorEmail(errorText);

                                    if (++doneCount == config.users.length) {
                                        return auto.done(mainCB, funcName);
                                    }

                                    return;

                                }

                                request({
                                    uri: 'https://minasidor.victoriapark.se/mina-sidor/intresseanmalningar',
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://minasidor.victoriapark.se',
                                        'Referer': 'https://minasidor.victoriapark.se/mina-sidor/logga-in',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }

                                    var $ = cheerio.load(body);
                                    var ads = $('tr > td:has(.interest-footer p)');

                                    var apartmentsToRemove = [];

                                    ads.each(function (i) {
                                        var ad = ads.eq(i);
                                        var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                        //price could be 0 if price is in details text
                                        var price = parseInt(ad.find('ul li:has([id$=lblCostApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var rum = parseInt(ad.find('ul li:has([id$=lblNoOfRoomsApartment])').eq(0).next().text().replace(/\D/g, ''), 10) || 0;
                                        var deleteUrlPath = ad.find('[id$=_hlDeleteTxtApartment]').eq(0).attr('href') || '';
                                        var statusText = ad.find('.interest-footer p').eq(0).text().trim();
                                        var adUrl = 'https://minasidor.victoriapark.se' + ad.find('[id$=DetailsTxtApartment]').eq(0).attr('href');

                                        // Remove IDs that are already in interest list
                                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment => apartment.id != id);

                                        if (statusText.indexOf('Du har inte blivit erbjuden visning') > -1 && deleteUrlPath.length) {
                                            apartmentsToRemove.push({
                                                id: id,
                                                price: price,
                                                rooms: rum,
                                                url: adUrl,
                                                deleteUrl: 'https://minasidor.victoriapark.se' + deleteUrlPath
                                            })
                                        } else {


                                            listInterestIDs.push(id);
                                        }

                                    });


                                    check.dbAva***REMOVED***ble
                                        .filter(dbApartment => dbApartment.site == funcName)
                                        .forEach(function (apartment) {

                                            if (listInterestIDs.contains(apartment.id) && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {


                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                            } else if (!(listInterestIDs.contains(apartment.id)) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                if ((apartment.info.interestList).length < 1) {
                                                    delete apartment.info.interestList;
                                                }

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                        });


                                    var emptySlotsAmount = maxInterestList - ads.length;
                                    var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                        (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                            apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;

                                    var addAmount = emptySlotsAmount + removeAmount;


                                    removeAds(apartmentsToRemove, function () {
                                        addAds(addAmount, function () {
                                            if (++doneCount == config.users.length) {
                                                return auto.done(mainCB, funcName);
                                            }
                                        });
                                    }, removeAmount);

                                })

                            })
                        });
                    } else {
                        // Skip user
                        if (++doneCount == config.users.length) {
                            return auto.done(mainCB, funcName);
                        }
                    }
                } else {
                    return auto.done(mainCB, funcName);
                }
            });*/
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail('AUTO' + funcName + ' \n' + errorText);
            return auto.error(funcName, errorText, mainCB);
        }

    },
    akelius: function (cb, apartmentsArr) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var cookiesArr = [];
        var usersFilteredApartmentsArr = [];

        var maxInterestList = 3;
        delete auto.errorsObj[funcName];

        try {

            apartmentsArr = typeof apartmentsArr !== "object" ? check.ava***REMOVED***ble : apartmentsArr;


            apartmentsArr = apartmentsArr.filter(apartment => apartment.site == [funcName]);
            if (!apartmentsArr.length || config.users.length < 1) {
                return auto.done(mainCB, funcName);
            }

            async.eachOfSeries(config.users, function (user, userIndex, cb) {


                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];

                        var ava***REMOVED***bleApartmentsInInterestlist = 0;

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1) && apartment.rooms > user.auto[funcName].minRooms - 1 && apartment.price - 1 < user.auto[funcName].maxPrice && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) && !(apartment.info['unpublished']) && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                            if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()) && !(apartment.info['unpublished'])) {
                                ava***REMOVED***bleApartmentsInInterestlist++;
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {

                            return cb();
                        }


                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


                        var removeAds = function (apartmentsToRemove, cb, interestListBody, removeAmount) {

                            removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                            if (!interestListBody || !apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var remove = function (apartment, cb) {

                                return typeof cb === "function" ? cb() : null;

                                /*

                                var eventvalidation = extractBetweenStrings(interestListBody, 'EVENTVALIDATION" value="', '" />')[0];
                                var viewstate = extractBetweenStrings(interestListBody, 'VIEWSTATE" value="', '" />')[0];
                                var viewstategenerator = extractBetweenStrings(interestListBody, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                if (!(eventvalidation && viewstate && viewstategenerator)) {
                                    return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                                }


                                request({
                                    uri: 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Bk/InterestReport.aspx',
                                    method: "POST",
                                    headers: {
                                        'Origin': 'https://xpdapi.akelius.se',
                                        'Referer': 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Bk/Interestreport.aspx',
                                    },
                                    jar: cookiesArr[userIndex],
                                    form: {

                                        ctl00$ToolkitScriptManager1: 'ctl00$cphRightFrame$updPanel1|' + apartment.deleteQuery,
                                        ctl00_ToolkitScriptManager1_HiddenField: extractBetweenStrings(unescape(interestListBody), '_TSM_CombinedScripts_=', '" ')[0],
                                        __EVENTTARGET: apartment.deleteQuery,
                                        __EVENTARGUMENT: '',
                                        '__VIEWSTATE': viewstate,
                                        '__VIEWSTATEGENERATOR': viewstategenerator,
                                        '__EVENTVALIDATION': eventvalidation,
                                        __VIEWSTATEENCRYPTED: '',
                                        ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$hfSelectedPrimaryKey: '',
                                        ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$hfContentElementID: '',
                                        __ASYNCPOST: true
                                    }

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when deleting ad with price' + apartment.price + ':- !', mainCB);
                                    } else if (res.statusCode != 200) {
                                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when deleting ad with price' + apartment.price + ':- !';
                    if (isRedirect(res.statusCode)) {
                        sendErrorEmail(funcName + ' \n' + errorText);
                    }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when deleting ad with price' + apartment.price + ':- !', mainCB);
                                    }

                                    console.log(getDateTime() + '  [' + user.name + '] Removed AUTO' + funcName.toUpperCase() + ' Ad with price' + apartment.price + ':- !');

                                    interestListBody = body;

                                    return typeof cb === "function" ? cb() : null;
                                });

                                 */
                            };


                            var functionList = [];
                            for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                functionList.push(function (cb) {
                                    remove(apartmentsToRemove[i], cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };
                        var addAds = function (addAmount, cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next AKELIUS Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (addedIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);

                                request({
                                    uri: apartment.url,
                                    method: "GET",
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex]
                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 1/2 ad ' + apartment.id;
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    }


                                    var $ = cheerio.load(body);
                                    var listInterestButton = $('.detail-main-buttons a.ng-star-inserted');

                                    if (!(listInterestButton).length) {
                                        console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                        return tryNext();

                                    } else {

                                        request({
                                            uri: listInterestButton.eq(0).attr('href'),
                                            method: "GET",
                                            headers: {
                                                'Origin': 'https://xpdapi.akelius.se',
                                                'Referer': apartment.url,
                                            },
                                            jar: cookiesArr[userIndex],
                                        }, function (err, res, body) {

                                            if (err) {
                                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                return auto.error(funcName, 'statuscode != 200||302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                            } else if (res.request._redirect.redirects.length > 1) {
                                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                                            } else if (!body) {
                                                return auto.error(funcName, ' body is empty', mainCB);
                                            }


                                            var $ = cheerio.load(body);
                                            var errorElement = $('span.ErrorText');
                                            var errorText = errorElement.eq(0).text();
                                            if (errorElement.length) {

                                                if (errorText.contains('Hyresobjektet har avpublicerats')) {

                                                    apartment.info.unpublished = true;
                                                    DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                                } else if (errorText.contains('Du har redan en intresseanmälan registrerad på det önskade hyresobjektet')) {
                                                    apartment.info.interestList = apartment.info.interestList || [];
                                                    apartment.info.interestList.push(user.name.toLowerCase());

                                                    DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                                } else if (errorText.contains('du har uppnått det maximala antalet')) {
                                                    console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorText + '!').red);
                                                    usersFilteredApartmentsArr[userIndex] = [];
                                                } else {
                                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                    console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorText + '!').red);
                                                }

                                                return tryNext();

                                            } else {

                                                console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());
                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                cb();
                                            }

                                        });
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Cm/Logon.aspx',
                            method: "GET",
                            headers: {
                                'Origin': 'https://xpdapi.akelius.se',
                            },
                            followRedirect: false,
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 200) {
                                let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (isRedirect(res.statusCode)) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, errorText, mainCB);
                            } else if (!body) {
                                return auto.error(funcName, ' body is empty', mainCB);
                            }

                            var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                            var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                            var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                            if (!(eventvalidation && viewstate && viewstategenerator)) {
                                return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                            }


                            request({
                                uri: res.request.uri.href,
                                method: "POST",
                                headers: {
                                    'Origin': 'https://xpdapi.akelius.se',
                                    'Referer': 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Cm/Logon.aspx',
                                },
                                jar: cookiesArr[userIndex],
                                encoding: 'binary',
                                form: {
                                    '__LASTFOCUS': '',
                                    '__EVENTTARGET': '',
                                    '__EVENTARGUMENT': '',
                                    '__VIEWSTATE': viewstate,
                                    '__VIEWSTATEGENERATOR': viewstategenerator,
                                    '__EVENTVALIDATION': eventvalidation,
                                    'ctl00$cphRightFrame$LogonBox1$txtUserName': user.pNummer.replace(/-/g, ''),
                                    'ctl00$cphRightFrame$LogonBox1$ctl00_cphRightFrame_LogonBox1_ctl06': user.auto[funcName].password,
                                    'ctl00$cphRightFrame$LogonBox1$btnLogon': 'Logga in',
                                    'ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$fuUploadImage': '',
                                    'ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$hfSelectedPrimaryKey': '',
                                    'ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$hfContentElementID': ''
                                },
                            }, function (err, res, body) {

                                if (err) {
                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                    return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                } else if (!body) {
                                    return auto.error(funcName, ' body is empty', mainCB);
                                }


                                var $ = cheerio.load(body);
                                var errorElement = $('span.ErrorText');
                                if (errorElement.length) {
                                    var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';
                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                    console.log((errorText).red);

                                    sendErrorEmail(errorText);

                                    return cb();

                                }


                                request({
                                    uri: 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Bk/Interestreport.aspx',
                                    method: "GET",
                                    headers: {
                                        'Origin': 'https://xpdapi.akelius.se',
                                        'Referer': 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Cm/StartLoggedOn.aspx',
                                    },
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],

                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }


                                    var $ = cheerio.load(body);
                                    var ads = $('[id$=InterestReport] [class^=Grid][class$=Item]');

                                    var apartmentsToRemove = [];
                                    var interestListAds = [];

                                    ads.each(function (i) {
                                        var ad = ads.eq(i);
                                        //var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                        //price could be 0 if price is in details text
                                        var price = parseInt(ad.find('[id$=lblRent]').eq(0).text().replace(/\D/g, ''), 10) || 0;
                                        var rum = parseInt(ad.find('[id$=lblNrOfRooms]').eq(0).text().replace(/\D/g, ''), 10) || 0;
                                        var area = parseInt(ad.find('[id$=lblSurface]').eq(0).text().replace(/\D/g, ''), 10) || 0;
                                        var address = ad.find('[id$="lblAddress1"]').eq(0).text().trim();
                                        //var deleteQuery = extractBetweenStrings(ad.find('[id$=lbtDelete]').eq(0).attr('href') || '', '(\'', '\',')[0] || '';
                                        //var statusText = ad.find('[id$=lblProcessing]').eq(0).text().trim() || '';

                                        if (!(address.length || rum.length || price.length || area.length)) {
                                            return console.log('AKELIUS !(address.length || rum.length || price.length || area.length)'.red);
                                        }

                                        interestListAds.push({
                                            price: price,
                                            rooms: rum,
                                            area: area,
                                            address: address
                                        });

                                        //Remove IDs that are already in interest list
                                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment =>
                                            apartment.rooms != rum || apartment.address != address || apartment.price != price || apartment.area != area
                                        );

                                    });


                                    check.dbAva***REMOVED***ble
                                        .filter(dbApartment => dbApartment.site == funcName)
                                        .forEach(function (apartment) {


                                            var inDB = interestListAds.some(function (element) {
                                                return apartment.price == element.price && apartment.area == element.area && apartment.address == element.address && apartment.rooms == element.rooms;
                                            });


                                            if (inDB && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {


                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());


                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                            } else if (!(inDB) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                if ((apartment.info.interestList).length < 1) {
                                                    delete apartment.info.interestList;
                                                }

                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                        });


                                    var emptySlotsAmount = maxInterestList - ads.length;
                                    var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                        (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                            apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;

                                    var addAmount = emptySlotsAmount + removeAmount;


                                    removeAds(apartmentsToRemove, function () {
                                        addAds(addAmount, function () {
                                            return cb();
                                        });
                                    }, body, removeAmount);

                                })

                            })
                        });
                    } else {
                        // Skip user
                        return cb();
                    }
                } else {
                    return cb();
                }
            }, function (err) {
                return auto.done(mainCB, funcName);
            });

            async.eachOfSeries(config.users, function (user, userIndex, cb) {
            }, function (err) {
                return auto.done(mainCB, funcName);
            });


            /* var doneCount = 0;
             config.users.forEach(function (user, userIndex) {


                 if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                     if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                         cookiesArr[userIndex] = request.jar();
                         usersFilteredApartmentsArr[userIndex] = [];

                         var ava***REMOVED***bleApartmentsInInterestlist = 0;

                         apartmentsArr.forEach(function (apartment) {
                             if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1) && apartment.rooms > user.auto[funcName].minRooms - 1 && apartment.price - 1 < user.auto[funcName].maxPrice && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) && !(apartment.info['unpublished']) && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                 usersFilteredApartmentsArr[userIndex].push(apartment);
                             }
                             if (apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()) && !(apartment.info['unpublished'])) {
                                 ava***REMOVED***bleApartmentsInInterestlist++;
                             }
                         });

                         if (!(usersFilteredApartmentsArr[userIndex].length) || ava***REMOVED***bleApartmentsInInterestlist > maxInterestList - 1) {
                             if (++doneCount == config.users.length) {
                                 return auto.done(mainCB, funcName);
                             }
                             return;
                         }


                         usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


                         var removeAds = function (apartmentsToRemove, cb, interestListBody, removeAmount) {

                             removeAmount = typeof removeAmount !== "undefined" ? removeAmount : apartmentsToRemove.length;

                             if (!interestListBody || !apartmentsToRemove.length || !usersFilteredApartmentsArr[userIndex].length || removeAmount < 1) {
                                 return typeof cb === "function" ? cb() : null;
                             }

                             var remove = function (apartment, cb) {

                                 return typeof cb === "function" ? cb() : null;


                             };


                             var functionList = [];
                             for (let i = 0; i < apartmentsToRemove.length && i < removeAmount; i++) {
                                 functionList.push(function (cb) {
                                     remove(apartmentsToRemove[i], cb);
                                 })
                             }

                             async.series(functionList, function () {
                                 return typeof cb === "function" ? cb() : null;
                             });


                         };
                         var addAds = function (addAmount, cb) {
                             if (!usersFilteredApartmentsArr[userIndex].length || addAmount < 1) {
                                 return typeof cb === "function" ? cb() : null;
                             }

                             var addedIDs = [];

                             var add = function (apartment, cb) {

                                 var tryNext = function () {
                                     var nextApartment = {};
                                     usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                         if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                             nextApartment = apartment;
                                         }
                                     });

                                     if (Object.keys(nextApartment).length) {
                                         console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next AKELIUS Apartment ' + nextApartment.id + '!');
                                         return add(nextApartment, cb);
                                     } else {
                                         return cb();
                                     }
                                 };


                                 if (!apartment.url) {
                                     return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                 }


                                 if (addedIDs.contains(apartment.id)) {
                                     return tryNext();
                                 }


                                 addedIDs.push(apartment.id);

                                 request({
                                     uri: apartment.url,
                                     method: "GET",
                                     followRedirect: false,
                                     jar: cookiesArr[userIndex]
                                 }, function (err, res, body) {

                                     if (err) {
                                         return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                     } else if (res.statusCode != 200) {
                                         let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 1/2 ad ' + apartment.id;
                                         if (isRedirect(res.statusCode)) {
                                             sendErrorEmail(funcName + ' \n' + errorText);
                                         }
                                         writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                         return auto.error(funcName, errorText, mainCB);
                                     }


                                     var $ = cheerio.load(body);
                                     var listInterestButton = $('.detail-main-buttons a.ng-star-inserted');

                                     if (!(listInterestButton).length) {
                                         console.log((getDateTime() + '  [' + user.name + '] [' + apartment.id + '] AUTO' + funcName.toUpperCase() + ': Du har sökt denna bostad!').red);

                                         return tryNext();

                                     } else {

                                         request({
                                             uri: listInterestButton.eq(0).attr('href').replace('xpdapi', 'xpdapi'),
                                             method: "GET",
                                             headers: {
                                                 'Origin': 'https://xpdapi.akelius.se',
                                                 'Referer': apartment.url,
                                             },
                                             jar: cookiesArr[userIndex],
                                         }, function (err, res, body) {

                                             if (err) {
                                                 return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                             } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                                 writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                 return auto.error(funcName, 'statuscode != 200||302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                             } else if (res.request._redirect.redirects.length > 1) {
                                                 writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                 return check.error(funcName, ' redirects Length > 1 ==' + res.request._redirect.redirects.length, mainCB);
                                             } else if (!body) {
                                                 return auto.error(funcName, ' body is empty', mainCB);
                                             }


                                             var $ = cheerio.load(body);
                                             var errorElement = $('span.ErrorText');
                                             var errorText = errorElement.eq(0).text();
                                             if (errorElement.length) {

                                                 if (errorText.contains('Hyresobjektet har avpublicerats')) {

                                                     apartment.info.unpublished = true;
                                                     DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                                 } else if (errorText.contains('Du har redan en intresseanmälan registrerad på det önskade hyresobjektet')) {
                                                     apartment.info.interestList = apartment.info.interestList || [];
                                                     apartment.info.interestList.push(user.name.toLowerCase());

                                                     DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                                 } else if (errorText.contains('du har uppnått det maximala antalet')) {
                                                     console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorText + '!').red);
                                                     usersFilteredApartmentsArr[userIndex] = [];
                                                 } else {
                                                     writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                                     console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + errorText + '!').red);
                                                 }

                                                 return tryNext();

                                             } else {

                                                 console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                                 apartment.info.interestList = apartment.info.interestList || [];
                                                 apartment.info.interestList.push(user.name.toLowerCase());
                                                 DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                 cb();
                                             }

                                         });
                                     }


                                 });

                             };


                             var functionList = [];

                             for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i && addAmount > i; i++) {
                                 functionList.push(function (cb) {
                                     add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                 })
                             }

                             async.series(functionList, function () {
                                 return typeof cb === "function" ? cb() : null;
                             });


                         };

                         request({
                             uri: 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Cm/Logon.aspx',
                             method: "GET",
                             headers: {
                                 'Origin': 'https://xpdapi.akelius.se',
                             },
                             followRedirect: false,
                             jar: cookiesArr[userIndex]
                         }, function (err, res, body) {

                             if (err) {
                                 return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                             } else if (res.statusCode != 200) {
                                 let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                 if (isRedirect(res.statusCode)) {
                                     sendErrorEmail(funcName + ' \n' + errorText);
                                 }
                                 writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                 return auto.error(funcName, errorText, mainCB);
                             } else if (!body) {
                                 return auto.error(funcName, ' body is empty', mainCB);
                             }

                             var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                             var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                             var viewstategenerator = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                             if (!(eventvalidation && viewstate && viewstategenerator)) {
                                 return auto.error(funcName, 'eventvalidation||viewstate||... is invalid', mainCB);
                             }


                             request({
                                 uri: res.request.uri.href,
                                 method: "POST",
                                 headers: {
                                     'Origin': 'https://xpdapi.akelius.se',
                                     'Referer': 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Cm/Logon.aspx',
                                 },
                                 jar: cookiesArr[userIndex],
                                 encoding: 'binary',
                                 form: {
                                     '__LASTFOCUS': '',
                                     '__EVENTTARGET': '',
                                     '__EVENTARGUMENT': '',
                                     '__VIEWSTATE': viewstate,
                                     '__VIEWSTATEGENERATOR': viewstategenerator,
                                     '__EVENTVALIDATION': eventvalidation,
                                     'ctl00$cphRightFrame$LogonBox1$txtUserName': user.pNummer.replace(/-/g, ''),
                                     'ctl00$cphRightFrame$LogonBox1$ctl00_cphRightFrame_LogonBox1_ctl06': user.auto[funcName].password,
                                     'ctl00$cphRightFrame$LogonBox1$btnLogon': 'Logga in',
                                     'ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$fuUploadImage': '',
                                     'ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$hfSelectedPrimaryKey': '',
                                     'ctl00$cphRightFrame$ContentManagementControl1$ImageExplorerUC$hfContentElementID': ''
                                 },
                             }, function (err, res, body) {

                                 if (err) {
                                     return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                 } else if (!(res.statusCode == 302 || res.statusCode == 200)) {
                                     writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                     return auto.error(funcName, 'statuscode != 302||200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                                 } else if (!body) {
                                     return auto.error(funcName, ' body is empty', mainCB);
                                 }


                                 var $ = cheerio.load(body);
                                 var errorElement = $('span.ErrorText');
                                 if (errorElement.length) {
                                     var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ' + errorElement.eq(0).text() + '!';
                                     writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                     console.log((errorText).red);

                                     sendErrorEmail(errorText);

                                     if (++doneCount == config.users.length) {
                                         return auto.done(mainCB, funcName);
                                     }

                                     return;

                                 }


                                 request({
                                     uri: 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Bk/Interestreport.aspx',
                                     method: "GET",
                                     headers: {
                                         'Origin': 'https://xpdapi.akelius.se',
                                         'Referer': 'https://xpdapi.akelius.se/IncitXpandWeb07038_1/Internet/Cm/StartLoggedOn.aspx',
                                     },
                                     followRedirect: false,
                                     jar: cookiesArr[userIndex],

                                 }, function (err, res, body) {

                                     if (err) {
                                         return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                                     } else if (res.statusCode != 200) {
                                         let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                         if (isRedirect(res.statusCode)) {
                                             sendErrorEmail(funcName + ' \n' + errorText);
                                         }
                                         writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                         return auto.error(funcName, errorText, mainCB);
                                     } else if (!body) {
                                         return auto.error(funcName, ' body is empty', mainCB);
                                     }


                                     var $ = cheerio.load(body);
                                     var ads = $('[id$=InterestReport] [class^=Grid][class$=Item]');

                                     var apartmentsToRemove = [];
                                     var interestListAds = [];

                                     ads.each(function (i) {
                                         var ad = ads.eq(i);
                                         //var id = ad.find('[id$="_lblHobj_ID"]').eq(0).text().trim();
                                         //price could be 0 if price is in details text
                                         var price = parseInt(ad.find('[id$=lblRent]').eq(0).text().replace(/\D/g, ''), 10) || 0;
                                         var rum = parseInt(ad.find('[id$=lblNrOfRooms]').eq(0).text().replace(/\D/g, ''), 10) || 0;
                                         var area = parseInt(ad.find('[id$=lblSurface]').eq(0).text().replace(/\D/g, ''), 10) || 0;
                                         var address = ad.find('[id$="lblAddress1"]').eq(0).text().trim();
                                         //var deleteQuery = extractBetweenStrings(ad.find('[id$=lbtDelete]').eq(0).attr('href') || '', '(\'', '\',')[0] || '';
                                         //var statusText = ad.find('[id$=lblProcessing]').eq(0).text().trim() || '';

                                         if (!(address.length || rum.length || price.length || area.length)) {
                                             return console.log('AKELIUS !(address.length || rum.length || price.length || area.length)'.red);
                                         }

                                         interestListAds.push({
                                             price: price,
                                             rooms: rum,
                                             area: area,
                                             address: address
                                         });

                                         //Remove IDs that are already in interest list
                                         usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].filter(apartment =>
                                             apartment.rooms != rum || apartment.address != address || apartment.price != price || apartment.area != area
                                         );

                                     });


                                     check.dbAva***REMOVED***ble
                                         .filter(dbApartment => dbApartment.site == funcName)
                                         .forEach(function (apartment) {


                                             var inDB = interestListAds.some(function (element) {
                                                 return apartment.price == element.price && apartment.area == element.area && apartment.address == element.address && apartment.rooms == element.rooms;
                                             });


                                             if (inDB && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase()))) {


                                                 apartment.info.interestList = apartment.info.interestList || [];
                                                 apartment.info.interestList.push(user.name.toLowerCase());


                                                 DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");


                                             } else if (!(inDB) && apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) {

                                                 apartment.info.interestList.splice(apartment.info.interestList.indexOf(user.name.toLowerCase()), 1);

                                                 if ((apartment.info.interestList).length < 1) {
                                                     delete apartment.info.interestList;
                                                 }

                                                 DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                             }
                                         });


                                     var emptySlotsAmount = maxInterestList - ads.length;
                                     var removeAmount = usersFilteredApartmentsArr[userIndex].length > emptySlotsAmount ?
                                         (usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount > apartmentsToRemove.length ?
                                             apartmentsToRemove.length : usersFilteredApartmentsArr[userIndex].length - emptySlotsAmount) : 0;

                                     var addAmount = emptySlotsAmount + removeAmount;


                                     removeAds(apartmentsToRemove, function () {
                                         addAds(addAmount, function () {
                                             if (++doneCount == config.users.length) {
                                                 return auto.done(mainCB, funcName);
                                             }
                                         });
                                     }, body, removeAmount);

                                 })

                             })
                         });
                     } else {
                         // Skip user
                         if (++doneCount == config.users.length) {
                             return auto.done(mainCB, funcName);
                         }
                     }
                 } else {
                     return auto.done(mainCB, funcName);
                 }
             });*/
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail('AUTO' + funcName + ' \n' + errorText);
            return auto.error(funcName, errorText, mainCB);
        }

    },
    sigtunahem: function (cb, apartmentsArr) {
        var funcName = arguments.callee.name;
        var mainCB = cb;
        var cookiesArr = [];
        var usersFilteredApartmentsArr = [];

        //var maxInterestList = 3;
        delete auto.errorsObj[funcName];

        try {

            apartmentsArr = typeof apartmentsArr !== "object" ? check.ava***REMOVED***ble : apartmentsArr;


            apartmentsArr = apartmentsArr.filter(apartment => apartment.site == [funcName]);
            if (!apartmentsArr.length || config.users.length < 1) {
                return auto.done(mainCB, funcName);
            }


            async.eachOfSeries(config.users, function (user, userIndex, cb) {

                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1) && apartment.rooms > user.auto[funcName].minRooms - 1 && apartment.price - 1 < user.auto[funcName].maxPrice && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length)) {
                            return cb();
                        }


                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


                        var addAds = function (cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next SigtunaHem Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (addedIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);


                                let widgets = [
                                    'objektinformation@lagenheter',
                                    'objektdokument',
                                    'objektmarknadegenskaper',
                                    'alert',
                                    'objektintresse',
                                    'objektintressestatus',
                                    'objektbilder'
                                ];

                                request({
                                    uri: 'https://sigtunahem.se/widgets/',
                                    method: "GET",
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],
                                    headers: {
                                        Referer: apartment.url,
                                        'Origin': 'https://sigtunahem.se',
                                        'X-Requested-With': 'XMLHttpRequest'
                                    },
                                    qs: {
                                        refid: apartment.refid,
                                        callback: '',
                                        'widgets[]': widgets
                                    },
                                    qsStringifyOptions: {arrayFormat: 'repeat'}
                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 1/2 ad ' + apartment.id;
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }


                                    let responseObj;

                                    try {
                                        responseObj = JSON.parse(body.slice(1, -2));
                                    } catch (e) {
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                                    }


                                    if (responseObj.hasOwnProperty('messages') && responseObj.messages.length > 0 && responseObj.messages.some(function (messageObj) {
                                        if (messageObj.type == 'Error') {
                                            console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + messageObj.message + '!').red);
                                            return true;
                                        }
                                    })) {
                                        return tryNext();
                                    } else {

                                        var $ = cheerio.load(responseObj.html['objektintresse']);
                                        let infoText = $('[data-action="intresse.skapa"]').eq(0).text();
                                        let refidIntresse = $('form input[name="intresse.refid"]').eq(0).attr('value');

                                        if (!(refidIntresse && infoText)) {
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                            sendErrorEmail(funcName + ': refidIntresse || infoText is invalid! infoText==' + infoText + ' refidIntresse ==' + refidIntresse);
                                            return auto.error(funcName, 'refidIntresse || infoText is invalid! infoText==' + infoText + ' refidIntresse ==' + refidIntresse, mainCB);
                                        }

                                        infoText = infoText.trim()
                                        refidIntresse = refidIntresse.trim()

                                        if (infoText.contains('Anmäl intresse')) {

                                            request({
                                                uri: 'https://sigtunahem.se/widgets/',
                                                method: "POST",
                                                jar: cookiesArr[userIndex],
                                                headers: {
                                                    Referer: 'https://sigtunahem.se/sok-ledigt/ledig-lagenhet/?refid=' + apartment.refid,
                                                    'Origin': 'https://sigtunahem.se',
                                                    'X-Requested-With': 'XMLHttpRequest'
                                                },
                                                qs: {
                                                    refid: apartment.refid,
                                                    callback: ''
                                                },
                                                form: {
                                                    'intresse.refid': refidIntresse,
                                                    actionId: 'intresse.skapa',
                                                    'widgets[]': 'objektintresse'
                                                }
                                            }, function (err, res, body) {

                                                if (err) {
                                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                                } else if (res.statusCode != 200) {
                                                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id;
                                                    if (isRedirect(res.statusCode)) {
                                                        sendErrorEmail(funcName + ' \n' + errorText);
                                                    }
                                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                    return auto.error(funcName, errorText, mainCB);
                                                } else if (!body) {
                                                    return auto.error(funcName, ' body is empty', mainCB);
                                                }


                                                let responseObj;

                                                try {
                                                    responseObj = JSON.parse(body.slice(1, -2));
                                                } catch (e) {
                                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                    return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                                                }

                                                let statusText = responseObj.html['objektintresse'];

                                                if (!(statusText.contains('Du har gjort en intresseanmälan'))) {
                                                    console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': statusText != "Du har gjort en intresseanmälan" ==' + statusText + '!').red);
                                                    return tryNext();
                                                }


                                                if (responseObj.hasOwnProperty('messages') && responseObj.messages.length > 0 && responseObj.messages.some(function (messageObj) {
                                                    if (messageObj.type == 'Error') {
                                                        console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + messageObj.message + '!').red);
                                                        return true;
                                                    }
                                                })) {
                                                    return tryNext();
                                                } else {

                                                    console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                                    apartment.info.interestList = apartment.info.interestList || [];
                                                    apartment.info.interestList.push(user.name.toLowerCase());
                                                    DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                    cb();
                                                }

                                            });
                                        } else {
                                            if (responseObj.html['objektintresse'].trim().contains('Du har gjort en intresseanmälan') || $('[data-action="intresse.radera"]').eq(0).text().trim().contains('Ångra intresseanmälan')) {
                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());
                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                            cb();
                                        }
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: 'https://sigtunahem.se/wp-login.php',
                            method: "POST",
                            headers: {
                                'Referer': 'https://sigtunahem.se/logga-in/',
                                'Origin': 'https://sigtunahem.se',
                            },
                            form: {
                                log: user.pNummer.substr(2).replace(/-/g, ''),
                                pwd: user.auto[funcName].password,
                                redirect_to: 'https://sigtunahem.se/mina-sidor'
                            },
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 302) {
                                let errorText = 'statuscode != 302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (res.statusCode == 200) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, 'statuscode != 302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                            } else if (res.headers.location.contains('error=login') || !(res.headers.location.contains('sigtunahem.se/mina-sidor'))) {
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ERROR!';
                                console.log((errorText).red);

                                sendErrorEmail(errorText);

                                return cb();

                            }

                            addAds(function () {
                                return cb();
                            });
                        });
                    } else {
                        // Skip user
                        return cb();
                    }
                } else {
                    return cb();
                }
            }, function (err) {
                return auto.done(mainCB, funcName);
            });

            /*var doneCount = 0;
            config.users.forEach(function (user, userIndex) {

                if (!auto.errorsObj[funcName] && !check.errorsObj[funcName]) {
                    if (typeof user.auto !== "undefined" && typeof user.auto[funcName] !== "undefined" && user.pNummer && user.auto[funcName].password && user.auto[funcName].active) {

                        cookiesArr[userIndex] = request.jar();
                        usersFilteredApartmentsArr[userIndex] = [];

                        apartmentsArr.forEach(function (apartment) {
                            if ((typeof user.auto[funcName].maxRooms === "undefined" || apartment.rooms < user.auto[funcName].maxRooms + 1) && apartment.rooms > user.auto[funcName].minRooms - 1 && apartment.price - 1 < user.auto[funcName].maxPrice && !(apartment.info.hasOwnProperty('interestList') && apartment.info.interestList.contains(user.name.toLowerCase())) && (typeof config.roomsMaxPrices[apartment.rooms] === "undefined" || (apartment.price < config.roomsMaxPrices[apartment.rooms] + 1))) {
                                usersFilteredApartmentsArr[userIndex].push(apartment);
                            }
                        });

                        if (!(usersFilteredApartmentsArr[userIndex].length)) {
                            if (++doneCount == config.users.length) {
                                return auto.done(mainCB, funcName);
                            }
                            return;
                        }


                        usersFilteredApartmentsArr[userIndex] = usersFilteredApartmentsArr[userIndex].sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


                        var addAds = function (cb) {
                            if (!usersFilteredApartmentsArr[userIndex].length) {
                                return typeof cb === "function" ? cb() : null;
                            }

                            var addedIDs = [];

                            var add = function (apartment, cb) {

                                var tryNext = function () {
                                    var nextApartment = {};
                                    usersFilteredApartmentsArr[userIndex].forEach(function (apartment) {
                                        if (!addedIDs.contains(apartment.id) && Object.keys(nextApartment).length === 0) {
                                            nextApartment = apartment;
                                        }
                                    });

                                    if (Object.keys(nextApartment).length) {
                                        console.log(getDateTime() + '  [' + user.name + '] Trying to Add Next SigtunaHem Apartment ' + nextApartment.id + '!');
                                        return add(nextApartment, cb);
                                    } else {
                                        return cb();
                                    }
                                };


                                if (!apartment.url) {
                                    return auto.error(funcName, ' err apartment.url not valid', mainCB);
                                }


                                if (addedIDs.contains(apartment.id)) {
                                    return tryNext();
                                }


                                addedIDs.push(apartment.id);


                                let widgets = [
                                    'objektinformation@lagenheter',
                                    'objektdokument',
                                    'objektmarknadegenskaper',
                                    'alert',
                                    'objektintresse',
                                    'objektintressestatus',
                                    'objektbilder'
                                ];

                                request({
                                    uri: 'https://sigtunahem.se/widgets/',
                                    method: "GET",
                                    followRedirect: false,
                                    jar: cookiesArr[userIndex],
                                    headers: {
                                        Referer: apartment.url,
                                        'Origin': 'https://sigtunahem.se',
                                        'X-Requested-With': 'XMLHttpRequest'
                                    },
                                    qs: {
                                        refid: apartment.refid,
                                        callback: '',
                                        'widgets[]': widgets
                                    },
                                    qsStringifyOptions: {arrayFormat: 'repeat'}
                                }, function (err, res, body) {

                                    if (err) {
                                        return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 1/2 ad ' + apartment.id, mainCB);
                                    } else if (res.statusCode != 200) {
                                        let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 1/2 ad ' + apartment.id;
                                        if (isRedirect(res.statusCode)) {
                                            sendErrorEmail(funcName + ' \n' + errorText);
                                        }
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return auto.error(funcName, errorText, mainCB);
                                    } else if (!body) {
                                        return auto.error(funcName, ' body is empty', mainCB);
                                    }


                                    let responseObj;

                                    try {
                                        responseObj = JSON.parse(body.slice(1, -2));
                                    } catch (e) {
                                        writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                        return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                                    }


                                    if (responseObj.hasOwnProperty('messages') && responseObj.messages.length > 0 && responseObj.messages.some(function (messageObj) {
                                        if (messageObj.type == 'Error') {
                                            console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + messageObj.message + '!').red);
                                            return true;
                                        }
                                    })) {
                                        return tryNext();
                                    } else {

                                        var $ = cheerio.load(responseObj.html['objektintresse']);
                                        let infoText = $('[data-action="intresse.skapa"]').eq(0).text().trim();
                                        let refidIntresse = $('form input[name="intresse.refid"]').eq(0).attr('value').trim();

                                        if (!(refidIntresse && infoText)) {
                                            writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                            sendErrorEmail(funcName + ': refidIntresse || infoText is invalid! infoText==' + infoText + ' refidIntresse ==' + refidIntresse);
                                            return auto.error(funcName, 'refidIntresse || infoText is invalid! infoText==' + infoText + ' refidIntresse ==' + refidIntresse, mainCB);
                                        }

                                        if (infoText.contains('Anmäl intresse')) {

                                            request({
                                                uri: 'https://sigtunahem.se/widgets/',
                                                method: "POST",
                                                jar: cookiesArr[userIndex],
                                                headers: {
                                                    Referer: 'https://sigtunahem.se/sok-ledigt/ledig-lagenhet/?refid=' + apartment.refid,
                                                    'Origin': 'https://sigtunahem.se',
                                                    'X-Requested-With': 'XMLHttpRequest'
                                                },
                                                qs: {
                                                    refid: apartment.refid,
                                                    callback: ''
                                                },
                                                form: {
                                                    'intresse.refid': refidIntresse,
                                                    actionId: 'intresse.skapa',
                                                    'widgets[]': 'objektintresse'
                                                }
                                            }, function (err, res, body) {

                                                if (err) {
                                                    return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : '') + ' when adding 2/2 ad ' + apartment.id, mainCB);
                                                } else if (res.statusCode != 200) {
                                                    let errorText = 'statuscode != 200 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] + ' when adding 2/2 ad ' + apartment.id;
                                                    if (isRedirect(res.statusCode)) {
                                                        sendErrorEmail(funcName + ' \n' + errorText);
                                                    }
                                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                    return auto.error(funcName, errorText, mainCB);
                                                } else if (!body) {
                                                    return auto.error(funcName, ' body is empty', mainCB);
                                                }


                                                let responseObj;

                                                try {
                                                    responseObj = JSON.parse(body.slice(1, -2));
                                                } catch (e) {
                                                    writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                                    return check.error(funcName, ' couldn\'t parse JSON', mainCB);
                                                }

                                                let statusText = responseObj.html['objektintresse'];

                                                if (!(statusText.contains('Du har gjort en intresseanmälan'))) {
                                                    console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': statusText != "Du har gjort en intresseanmälan" ==' + statusText + '!').red);
                                                    return tryNext();
                                                }


                                                if (responseObj.hasOwnProperty('messages') && responseObj.messages.length > 0 && responseObj.messages.some(function (messageObj) {
                                                    if (messageObj.type == 'Error') {
                                                        console.log((getDateTime() + '  [' + user.name + '] AUTO' + funcName.toUpperCase() + ': ' + messageObj.message + '!').red);
                                                        return true;
                                                    }
                                                })) {
                                                    return tryNext();
                                                } else {

                                                    console.log(getDateTime() + '  [' + user.name + '] Added AUTO' + funcName.toUpperCase() + ' ' + apartment.id + '!');
                                                    apartment.info.interestList = apartment.info.interestList || [];
                                                    apartment.info.interestList.push(user.name.toLowerCase());
                                                    DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");

                                                    cb();
                                                }

                                            });
                                        } else {
                                            if (responseObj.html['objektintresse'].trim().contains('Du har gjort en intresseanmälan') || $('[data-action="intresse.radera"]').eq(0).text().trim().contains('Ångra intresseanmälan')) {
                                                apartment.info.interestList = apartment.info.interestList || [];
                                                apartment.info.interestList.push(user.name.toLowerCase());
                                                DB("UPDATE ava***REMOVED***ble SET info = '" + JSON.stringify(apartment.info) + "' WHERE id = '" + apartment.id + "'");
                                            }
                                            cb();
                                        }
                                    }


                                });

                            };


                            var functionList = [];

                            for (let i = 0; usersFilteredApartmentsArr[userIndex].length > i; i++) {
                                functionList.push(function (cb) {
                                    add((usersFilteredApartmentsArr[userIndex][i]), cb);
                                })
                            }

                            async.series(functionList, function () {
                                return typeof cb === "function" ? cb() : null;
                            });


                        };

                        request({
                            uri: 'https://sigtunahem.se/wp-login.php',
                            method: "POST",
                            headers: {
                                'Referer': 'https://sigtunahem.se/logga-in/',
                                'Origin': 'https://sigtunahem.se',
                            },
                            form: {
                                log: user.pNummer.substr(2).replace(/-/g, ''),
                                pwd: user.auto[funcName].password,
                                redirect_to: 'https://sigtunahem.se/mina-sidor'
                            },
                            jar: cookiesArr[userIndex]
                        }, function (err, res, body) {

                            if (err) {
                                return auto.error(funcName, ' err: ' + err.code + (typeof res !== "undefined" ? 'statuscode = ' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode] : ''), mainCB);
                            } else if (res.statusCode != 302) {
                                let errorText = 'statuscode != 302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode];
                                if (res.statusCode == 200) {
                                    sendErrorEmail(funcName + ' \n' + errorText);
                                }
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
                                return auto.error(funcName, 'statuscode != 302 ==' + res.statusCode + ' ' + http.STATUS_CODES[res.statusCode], mainCB);
                            } else if (res.headers.location.contains('error=login') || !(res.headers.location.contains('sigtunahem.se/mina-sidor'))) {
                                writeBodyToFile(config.logsPath + filenamify(`${funcName}_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);

                                var errorText = getDateTime() + '  [' + user.name + ']' + '[AUTO' + funcName.toUpperCase() + '] login: ERROR!';
                                console.log((errorText).red);

                                sendErrorEmail(errorText);

                                if (++doneCount == config.users.length) {
                                    return auto.done(mainCB, funcName);
                                }

                                return;

                            }

                            addAds(function () {
                                if (++doneCount == config.users.length) {
                                    return auto.done(mainCB, funcName);
                                }
                            });
                        });
                    } else {
                        // Skip user
                        if (++doneCount == config.users.length) {
                            return auto.done(mainCB, funcName);
                        }
                    }
                } else {
                    return auto.done(mainCB, funcName);
                }
            });*/
        } catch (err) {

            let errorText = String('\ncatched err: ' + err.stack);
            sendErrorEmail('AUTO' + funcName + ' \n' + errorText);
            return auto.error(funcName, errorText, mainCB);
        }

    }
};


let checkAllProcess = function () {
    let log = oneDayHasPassed();

    check.all(function (apartmentsArr, cb, toIncludeArr, toExcludeArr, log, currentlyRunning) {
        check.process(undefined, function (ava***REMOVED***ble, currentlyRunning) {
            if (config.auto && !currentlyRunning && !(config.sitesToExclude.contains('*'))) {
                auto.all();
            }

        }, undefined, undefined, log, currentlyRunning);

    }, undefined, undefined, log);
};

let lastRunTime;
let allJob = new CronJob({
    cronTime: '3 * * * *', // Every hour at :03
    onTick: function () {

        lastRunTime = lastRunTime || new Date();
        let now = new Date();
        const utc1 = Date.UTC(lastRunTime.getFullYear(), lastRunTime.getMonth(), lastRunTime.getDate(), lastRunTime.getHours(), lastRunTime.getMinutes(), lastRunTime.getSeconds());
        const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

        let diffSecs = (utc2 - utc1) / 1000;
        lastRunTime = new Date(this.lastDate());


        if (diffSecs === 0 || diffSecs > 59) {

            //console.log('checkCount = [1/2] ' + checkCount);

            /*   if (config.sitesToExclude.contains('*')) {
                   return console.log('Excluding all sites!'.red)
               }*/


            checkAllProcess();

        }

    },
    start: true,
    timeZone: 'Europe/Stockholm',
    runOnInit: config.checkOnInit
});
let wahlinLastRunTime;
let wahlinJob = new CronJob({
    cronTime: '* 13 * * 1-5', // Every minute at hour 13-14 on Mon-Fri
    onTick: function () {
        wahlinLastRunTime = wahlinLastRunTime || new Date();
        let now = new Date();
        const utc1 = Date.UTC(wahlinLastRunTime.getFullYear(), wahlinLastRunTime.getMonth(), wahlinLastRunTime.getDate(), wahlinLastRunTime.getHours(), wahlinLastRunTime.getMinutes(), wahlinLastRunTime.getSeconds());
        const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

        let diffSecs = (utc2 - utc1) / 1000;
        wahlinLastRunTime = new Date(this.lastDate());


        if (diffSecs === 0 || diffSecs > 59) {
            if ((new Date()).getMinutes() != 3) {
                /* if (config.sitesToExclude.contains('*')) {
                     return console.log('Excluding all sites!'.red)
                 }*/
                check.all(null, ['wahlin'], undefined, false);

            }
        }
    },
    start: true,
    timeZone: 'Europe/Stockholm',
    runOnInit: false
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {

    if (key.name == 'c' && key.ctrl) {
        process.exit()
    } else {
        switch (str) {
            case 'r':
                console.log(`Refreshing...`);

                checkAllProcess()
                break;
        }
    }
});


if (config.enableServer) {
    var cachedIP;


    getIP(function (ip) {
        cachedIP = ip;
    });

    setInterval(function () {
        getIP(function (ip) {
            cachedIP = ip;
        });
    }, 1000 * 60 * 60);

    app.disable('x-powered-by');
    app.set('trust proxy', true);

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use(function (request, response, next) {
        if (!request.secure) {
            response.redirect("https://" + request.headers.host + request.url);
        } else {
            next();
        }
    });
    app.use('/bf-watcher/img', express.static(__dirname + '/img'));
    app.use('/bf-watcher/scripts', express.static(__dirname + '/scripts'));
    app.use('/bf-watcher/timesync', timesyncServer.requestHandler);
    app.get('/bf-watcher', function (req, res) {

        //console.log(getDateTime() + ' bf-watcher request from ip: ' + req.ip);

        var editedTemplate = htmlTemplate;
        var dbAva***REMOVED***ble = check.dbAva***REMOVED***ble;

        /* if (!(dbAva***REMOVED***ble.length)) {

             initDB(function (status, dbAva***REMOVED***ble) {
                 if (status) {
                 }

             }, false);
         } */


        dbAva***REMOVED***ble = dbAva***REMOVED***ble
            .filter(apartment => apartment.price < config.roomsMaxPrices[Object.keys(config.roomsMaxPrices).length - 1] && !(config.sitesToExclude.contains(apartment.site)))
            .sort((a, b) => a.price > b.price ? 1 : (a.price === b.price ? (b.rooms > a.rooms ? 1 : -1) : -1));


        var html = '<tbody>\n';
        for (var i = 0; i < dbAva***REMOVED***ble.length; i++) {
            html += '<tr>\n';
            html += '<td class="column1"><a draggable="false" ' + (dbAva***REMOVED***ble[i].type == "fast" || dbAva***REMOVED***ble[i].type == "sigtuna" ? 'style="color:red; "' : ' ') + 'href="' + (dbAva***REMOVED***ble[i].info.idUrl || dbAva***REMOVED***ble[i].url) + '" target="_blank">' + dbAva***REMOVED***ble[i].id + '</a></td>\n';
            html += '<td class="column2">' + dbAva***REMOVED***ble[i].price + ':-</td>\n';
            html += '<td class="column3">' + dbAva***REMOVED***ble[i].rooms + ' Rum</td>\n';
            html += '<td class="column4"><a draggable="false" rel="noopener noreferrer" target="_blank" href="' + (config.homepagesObj[dbAva***REMOVED***ble[i].site] || 'https://www.google.com/search?q=' + dbAva***REMOVED***ble[i].site) + '"><img draggable="false" alt="' + dbAva***REMOVED***ble[i].site + '" src="img/png/small/' + dbAva***REMOVED***ble[i].site + '.png"></a></td>\n';
            html += '</tr>\n';
        }

        if (!(dbAva***REMOVED***ble.length)) {
            html += '<tr><td colspan="4"><h2 style="color: white; text-align: center;">No Ads Ava***REMOVED***ble!</h2></td></tr>';
        }

        html += '</tbody>';

        var imgHost = 'https://***REMOVED******REMOVED***.com/bf-watcher/';

        editedTemplate = editedTemplate.replace('{TBODY}', html)
            .replace('{DATETIME}', getDateTime())
            .replace('{VERSION}', String(config.version))
            .replace('{IP}', cachedIP);


        var regex = /<img.*?src="(.*?)".*?>|<link.*?href="(.*?)".*?>/g;
        var imgUrlsArr = regex.matchAll(editedTemplate);


        imgUrlsArr.forEach(url => {
            editedTemplate = editedTemplate.replaceAll(url, imgHost + url);
        });


        res.setHeader('Content-type', 'text/html');
        res.send(editedTemplate);


    });
    app.get('/bf-watcher/status', function (req, res) {

        var editedTemplate = statusHtmlTemplate;


        var html = '<tbody>\n';
        var toExclude = ['init', 'all', 'done', 'error', 'process', 'errorsObj', 'dbAva***REMOVED***ble', 'excludedIDs', 'ava***REMOVED***ble', 'lastCheckedObj', 'currentlyRunning'];
        for (var site in check) {
            if (check.hasOwnProperty(site) && !(toExclude.contains(site))) {


                let column2Html = '';


                if (!(check.lastCheckedObj[site])) {
                    check.lastCheckedObj[site] = {};
                }

                switch (check.lastCheckedObj[site].status) {
                    case 'checked':
                        column2Html = 'Checked';
                        break;
                    case 'checking':
                        column2Html = '<div class="checking"></div>';
                        break;
                    case undefined:
                    case 'nocheck':
                        column2Html = 'None';
                        check.lastCheckedObj[site].status = 'nocheck';
                        break;
                    case 'error':
                        try {
                            let errorCode = check.errorsObj[site].match(/statuscode.+?==.?(\d{3,4})/)[1];

                            if (!(errorCode.match(/\d{3,4}/).length)) {
                                throw 'invalid code';
                            }

                            column2Html = 'Error ' + errorCode;
                        } catch (err) {
                            column2Html = 'Error';
                        }

                        break;
                    case 'excluded':
                        column2Html = 'Excluded';
                        break;
                    default:
                        column2Html = 'Invalid';
                        console.log('Invalid check.lastCheckedObj[site].status received.', 'check.lastCheckedObj[site].status = ' + check.lastCheckedObj[site].status);
                        check.lastCheckedObj[site].status = 'other';
                        break;
                }


                html += '<tr id="' + site + '">\n';
                html += '<td class="column1"><a draggable="false" rel="noopener noreferrer" target="_blank" href="' + (config.homepagesObj[site] || 'https://www.google.com/search?q=' + site) + '"><img draggable="false" alt="' + site + '" src="img/png/small/' + site + '.png"></a></td>\n';
                html += '<td class="column2 ' + check.lastCheckedObj[site].status + '">' + column2Html + '</td>\n';
                html += '<td class="column3">' + (check.lastCheckedObj[site] && check.lastCheckedObj[site].lastChecked ? check.lastCheckedObj[site].lastChecked.replace(getDate() + ' ', '').replace(getDate(-1), 'Yesterday at') : 'None') + '</td>\n';
                html += '<td class="column4">' + (auto.hasOwnProperty(site) ? 'YES' : 'NO') + '</td>\n';
                html += '</tr>\n';

            }
        }


        html += '</tbody>';

        var imgHost = 'https://***REMOVED******REMOVED***.com/bf-watcher/';


        let nextDate;
        try {
            let allJobNextDate = new Date(allJob.nextDates());
            let wahlinJobNextDate = new Date(wahlinJob.nextDates());
            nextDate = (wahlinJobNextDate > allJobNextDate) ? allJobNextDate : wahlinJobNextDate;
        } catch (e) {
            nextDate = new Date();
        }

        let lastCheck = '2019-11-21 01:38:22';

        for (let site in check.lastCheckedObj) {
            if (check.lastCheckedObj.hasOwnProperty(site)) {

                if (check.lastCheckedObj[site].lastChecked && check.lastCheckedObj[site].lastChecked.match(/\d{4}/) !== null && check.lastCheckedObj[site].lastChecked > lastCheck) {
                    lastCheck = check.lastCheckedObj[site].lastChecked;
                }
            }
        }

        if (lastCheck == '2019-11-21 01:38:22') {
            lastCheck = 'None';
        }

        let nextCheck;
        if (config.sitesToExclude.contains('*')) {
            nextCheck = 'None'
        }


        editedTemplate = editedTemplate.replace('{TBODY}', html)
            .replace('{LASTCHECK}', lastCheck)
            .replace('{NEXTCHECK}', (nextCheck ? nextCheck : nextDate.getFullYear() + '-' + String(nextDate.getMonth() + 1).padStart(2, '0') + '-' + String(nextDate.getDate()).padStart(2, '0') + ' ' + String(nextDate.getHours()).padStart(2, '0') + ':' + String(nextDate.getMinutes()).padStart(2, '0') + ':' + String(nextDate.getSeconds()).padStart(2, '0')))
            .replace('{VERSION}', String(config.version))
            .replace('{TIME}', getDateTime(true))
            .replace('{STARTDATETIME}', startDateTime)
            .replace('{IP}', cachedIP);


        var regex = /<img.*?src="(.*?)".*?>|<link.*?href="(.*?)".*?>/g;
        var imgUrlsArr = regex.matchAll(editedTemplate);


        imgUrlsArr.forEach(url => {
            editedTemplate = editedTemplate.replaceAll(url, imgHost + url);
        });


        res.setHeader('Content-type', 'text/html');
        res.send(editedTemplate);


    });

    app.get('/bf-watcher/call', function (req, res) {

        client.calls
            .create({
                url: 'https://handler.twilio.com/twiml/***REMOVED***',
                to: '+46***REMOVED***',
                from: '+***REMOVED***',
                statusCallback: 'https://***REMOVED******REMOVED***.com/bf-watcher/events',
                statusCallbackEvent: ['initiated', 'answered', 'ringing', 'completed'],
                statusCallbackMethod: 'POST',
                machineDetection: 'Enable'
            })
            .then(call => console.log('Call has been sent'));

        res.status(200).send('Call Sent!');
    });

    app.post('/bf-watcher/voice', (request, response) => {

        console.log('Call received!')


        // Use the Twilio Node.js SDK to build an XML response
        const twiml = new VoiceResponse();

        twiml.say({
            language: 'sv-SE'
        }, 'Hej ***REMOVED***! Välkommen till denna samtal, vad vill du göra nu?');

        // Render the response as XML in reply to the webhook request
        response.type('text/xml');
        response.send(twiml.toString());
    });


    app.post('/bf-watcher/events', function (req, res) {
        console.log(req.body.CallStatus)

        if (req.body.CallStatus == 'completed') {
            console.log(req.body['AnsweredBy'])
        }
        res.status(200).send();
    })


    let httpsServer = https.createServer({
        key: fs.readFileSync(__dirname + '/server.key'),
        cert: fs.readFileSync(__dirname + '/server.crt')
    }, app);
    let httpServer = http.createServer(null, app);


    let wss = new WebSocket.Server({server: httpsServer});


    var toExclude = ['init', 'all', 'done', 'error', 'process', 'errorsObj', 'dbAva***REMOVED***ble', 'excludedIDs', 'ava***REMOVED***ble', 'lastCheckedObj', 'currentlyRunning'];
    let objToSend = {
        lastCheckedObj: {},
        autoSites: (Object.keys(auto)).filter(site => {
            return !(['all', 'done', 'error', 'errorsObj', 'currentlyRunning'].contains(site));
        }),
        nextCheck: 0,
        currentlyRunning: check.currentlyRunning,
        dateTime: getDateTime(),
        errorsObj: check.errorsObj,
        startDateTime: startDateTime
    };


    let broadcastTimeout;
    let lastMessageSent = null;
    let startBroadcast = function () {

        clearTimeout(broadcastTimeout);

        if (wss.clients.size > 0) {

            for (let site in check) {
                if (check.hasOwnProperty(site) && !(toExclude.contains(site))) {

                    let nextDate;
                    try {
                        let allJobNextDate = new Date(allJob.nextDates());
                        let wahlinJobNextDate = new Date(wahlinJob.nextDates());
                        nextDate = (wahlinJobNextDate > allJobNextDate) ? allJobNextDate : wahlinJobNextDate;
                    } catch (e) {
                        nextDate = new Date();
                    }

                    objToSend.lastCheckedObj[site] = check.lastCheckedObj[site] || {
                        status: 'nocheck',
                        lastChecked: 'None',
                    };

                    if (config.sitesToExclude.contains('*')) {
                        objToSend.nextCheck = 'None';
                    } else {
                        objToSend.nextCheck = formatDateTime(nextDate);
                    }

                }
            }

            objToSend.errorsObj = check.errorsObj;
            objToSend.currentlyRunning = check.currentlyRunning;
            delete objToSend.dateTime;

            let stringified = JSON.stringify(objToSend);

            if (lastMessageSent !== stringified) {
                lastMessageSent = stringified;


                wss.clients.forEach(function each(ws) {

                    if (ws.isAlive === false) {
                        return ws.terminate();
                    }

                    ws.send(stringified);
                });

            }
        }

        broadcastTimeout = setTimeout(startBroadcast, check.currentlyRunning ? 50 : 250);

    };
    let pingInterval = setInterval(function () {
        lastMessageSent = null;
        wss.clients.forEach(function (ws) {

            if (ws.isAlive === false) {
                // console.log(getDateTime() + ' ' + (ws._socket.remoteAddress).replace('::ffff:', '') + ' has disconnected');
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping(() => {
            });
        });
    }, 30000);

    wss.on('connection', function (ws) {

        //console.log(getDateTime() + ' ' + 'New connection from: ' + (ws._socket.remoteAddress).replace('::ffff:', ''));

        lastMessageSent = null;

        ws.isAlive = true;


        ws.on('pong', function () {
            this.isAlive = true;
            //console.log(getDateTime() + ' ' + 'Received: pong from: ' + (ws._socket.remoteAddress).replace('::ffff:', ''))
        });

        ws.on('message', function (message) {
            console.log(getDateTime() + ' ' + 'Received: ' + message + ' from: ' + (ws._socket.remoteAddress).replace('::ffff:', ''));
            lastMessageSent = null;

            if (message === 'update') {
                console.log('Updating...');

                /* if (config.sitesToExclude.contains('*')) {
                     return console.log('Excluding all sites!'.red)
                 }*/
                checkAllProcess();
            }

            if (message === 'restart') {

                let restart = () => {

                    console.log(getDateTime() + ' Restarting...');

                    wss.clients.forEach(function each(ws) {

                        if (ws.isAlive === false) {
                            return;
                        }

                        ws.send(JSON.stringify({restarting: true}));
                    });


                    process.on("exit", function () {
                        require("child_process").spawn('cmd', ['/c', '"../BF Watcher.lnk"'], {
                            cwd: process.cwd(),
                            detached: true,
                            shell: true
                        });
                    });
                    process.exit();

                };

                restart();
            }

        });

        ws.on('close', function () {
            // console.log(getDateTime() + ' ' + (ws._socket.remoteAddress).replace('::ffff:', '') + ' has disconnected');
        });
    });

    wss.on('error', function (err) {
        console.log(('WebSocket Server:\n' + err).red)
    });

    startBroadcast();


    httpsServer.listen(3293, function () {
        console.log('HTTPS on port 3293!'.cyan);
    });

    httpServer.listen(3294, function () {
        console.log('HTTP on port 3294!'.cyan);
    });


    httpsServer.on('error', err => console.log(('\nhttpsServer:\n' + err).red));
    httpServer.on('error', err => console.log(('\nhttpServer:\n' + err).red));
}


function extractBetweenStrings(str, start, end) {
    start = RegExp.escape(start);
    end = RegExp.escape(end);
    var regex = new RegExp(start + "(.*?)" + end, "igm");

    return regex.matchAll(str.trim()) || [];
}

function getDateTime(onlyTime, noSeconds, onlyDate) {
    var date = new Date();
    var hour = String(date.getHours()).padStart(2, '0');
    var min = String(date.getMinutes()).padStart(2, '0');
    var sec = String(date.getSeconds()).padStart(2, '0');
    var year = String(date.getFullYear());
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');

    if (onlyDate) {
        return year + month + day
    }

    return onlyTime ? (hour + ":" + min + (noSeconds ? "" : ":" + sec)) : (year + "-" + month + "-" + day + " " + hour + ":" + min + (noSeconds ? "" : ":" + sec));
}

function sendEmail(mailOptions, cb) {
    /**
     var mailOptions = {
        from: '"WiFog Notification" <notification@***REMOVED***.com>', // sender address
        to: '***REMOVED******REMOVED***97@gmail.com', // list of receivers separated by comma
        subject: 'Giftcards Ava***REMOVED***ble! ✔', // Subject line
        text: 'Giftcards Ava***REMOVED***ble!' // plaintext body
        //html: '<now>Giftcards Ava***REMOVED***ble!</now>' // html body
    };

     **/


    mailOptions.tls = {
        rejectUnauthorized: false
    };


    nodemailer.createTransport('smtps://***REMOVED***acc1%40gmail.com:Ila***REMOVED******REMOVED***03@smtp.gmail.com').sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('EMAIL ERROR: ' + error.toString().red);
            return cb(false);
        }
        return cb(true, info.accepted);
    });
}

function initDB(cb, log) {

    log = typeof log !== "undefined" ? log : true;

    mysqlConnection.getConnection(function (err, connection) {
        if (!err) {
            if (log) {
                console.log("\nDatabase connected!\n".cyan);
                console.log(getDateTime() + '  BOT is Running!'.cyan);
            }

            connection.query('SELECT * from ava***REMOVED***ble', function (err, results) {
                if (!err) {

                    var dbAva***REMOVED***ble = [];
                    //var excludedIDs = [];
                    results.forEach(apartment => {
                        dbAva***REMOVED***ble.push(apartment);
                    });
                    /*results[1].forEach(apartment => {
                        excludedIDs.push(apartment.id);
                    });*/

                    cb(true, dbAva***REMOVED***ble);
                    connection.release();

                } else {
                    console.log('Error while performing Query.');
                    cb(false);
                }
            });
        } else {
            console.error('Database ERROR     ' + err.stack);
            cb(false);
        }
    });
}

function DB(query, cb) {

    mysqlConnection.getConnection(function (err, connection) {
        if (!err) {

            connection.query(query, function (err, rows) {
                if (err) throw err;

                if (typeof cb == "function") {
                    cb(err, rows);
                }

                //console.log(rows);
                connection.release();
            });
        } else {
            console.error('error connecting: ' + err.stack);
            cb(err);
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendErrorEmail(err) {

    if (!(sentErrors.contains(err))) {

        sentErrors.push(err);
        sendEmail({
            from: '"BF Watcher" <***REMOVED***acc1@gmail.com>', // sender address
            to: '***REMOVED******REMOVED***97@gmail.com',
            subject: 'BF Watcher Error!', // Subject line
            html: err, // html body
        }, function (success, emailsArr) {

            if (!success) {
                return console.log('Error EMAIL ERROR');
            }

            if (config.debug) {
                console.log('Error E-mail sent to ' + emailsArr[0] + '\n');
            }
        });

        return true;
    }

    return false;
}

function getIP(cb) {
    /*request({
        uri: 'https://www.trackip.net/ip?json',
        method: "GET"
    }, function (err, res, body) {

        if (err) {
            console.log('getIP() error'.red);
            writeBodyToFile(config.logsPath + filenamify(`getIP()_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
            cb('ERROR: ' + err.code);
        }

        try {
            cb(JSON.parse(body)['IP']);
        } catch (e) {
            console.log('getIP() error'.red);
            writeBodyToFile(config.logsPath + filenamify(`getIP()_${getDateTime()}.html`), body, (new URL(res.request.uri.href)).origin);
            cb('ERROR: Invalid IP');
        }
    });*/

    (async () => {
        let ip = await publicIp.v4();

        cb(ip);
    })();

}

function writeBodyToFile(path, body, origin) {

    fs.writeFile(path, path.split('.').pop() != 'html' ? body : body.replace(/<\s*?head.*?>/i, `$&\n<base href="${origin}">`), (err) => {
        if (err) {
            console.error(err)
        }
    });
}

function apartmentIsInvalid(id, price, rooms, area) {
    return price < 1000 || price > 30000 || rooms < 1 || rooms > 8 || area < 10 || area > 200 || id.length < 3
}

function isBase64(str) {
    try {
        return Buffer.from(str, 'base64').toString('base64') == str;
    } catch (e) {
        return false;
    }
}

function isRedirect(code) {
    return [301, 302, 303, 307, 308].contains(code)
}

function formatDateTime(dateObj) {
    return dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0') + ' ' + String(dateObj.getHours()).padStart(2, '0') + ':' + String(dateObj.getMinutes()).padStart(2, '0') + ':' + String(dateObj.getSeconds()).padStart(2, '0');
}

function getDate(days = 0) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    var year = String(date.getFullYear());
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');

    return year + '-' + month + '-' + day;
}

function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}