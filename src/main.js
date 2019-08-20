var request = require('request'),
    colors  = require('colors'),
    config  = require('../config.js'),
    mysql   = require('mysql'),
    nodemailer  = require('nodemailer'),
    fs          = require('fs'),
    syncRequest = require('sync-request'),
    CronJob     = require('cron').CronJob,
mysqlConnection = mysql.createPool(config.mysql);

// TIMER


Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};
Array.prototype.remove = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};
String.prototype.contains = function (str) {
    str = RegExp.escape(str);
    return this.search(new RegExp(str, "i")) > -1;
};
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
Array.prototype.removeDuplicates = function () {
    var m = {}, newarr = [];
    for (var i=0; i<this.length; i++) {
        var v = this[i];
        if (!m[v]) {
            newarr.push(v);
            m[v]=true;
        }
    }
    return newarr;
};
RegExp.prototype.matchAll = function (string) {
    var matches = [];
    var match = null;

    while ((match = this.exec(string)) !== null) {
        matches.push(match[1]);
    }

    return matches.removeDuplicates();
};

var count = 0;
var cookies = request.jar();
var ids = [];
var stillava***REMOVED***ble = [];
var hhemurls = [];
var newids = [];
var emailTemplate = fs.readFileSync(__dirname + '/adEmailTemp.html').toString();
var editedEmailTemplate;
var cronRunning = true;
var timesCount = 0;



var job = new CronJob({
    cronTime: '10 * * * *', // Every 1hr10min
    onTick: function() {
        start();
    },
    start: true,
    timeZone: 'Europe/Stockholm',
    runOnInit: true
});


function start() {

    count = 0;
    cookies = request.jar();
    ids = [];
    stillava***REMOVED***ble = [];
    hhemurls = [];
    newids = [];
    editedEmailTemplate = emailTemplate;

initDB(function (status) {
    if (status == true) {


        if (!cronRunning) {
            job.start();
            cronRunning = true;
        }

        login(config.email, config.password, function (status) {
            if (status == true) {

                //console.log('Logged in!\n'.cyan);

                request({
                    uri: 'https://bostad.stockholm.se/Lista/AllaAnnonser',
                    method: "GET",
                    timeout: 15000,
                    headers: {
                        'Host': 'bostad.stockholm.se',
                        'User-Agent': config.chrome_ua,
                        'Accept-Language': '*'
                    },
                    followRedirect: true,
                    strictSSL: false,
                    jar: cookies,
                    proxy: config.proxy,
                    maxRedirects: 10
                }, function (err, res, body) {
                    if (err) throw err;

                    if (body.contains('"Bostadssnabben": true')) {
                        console.log(getDateTime() + '  Bostadsnabben Ava***REMOVED***ble!');
                    } else {
                        //console.log('Inga Bostadsnabben!');
                    }

                    body = JSON.parse(body);


                    body.forEach(function (element) {
                        var id = element['AnnonsId'].toString();
                        if ((element['Bostadssnabben'] == true || ((element['Ungdom'] == true/* || element['Korttid'] == true*/) && element['KanAnmalaIntresse'] == true)) && !ids.contains(id)) {
                            // Add to DB

                            if (element['Bostadssnabben'] == true) {
                                sendEmail({
                                    from: '"BF Bostadsnabben" <***REMOVED***acc1@gmail.com>', // sender address
                                    to: [
                                        '***REMOVED******REMOVED******REMOVED***',
                                        '***REMOVED***',
                                        '***REMOVED***'
                                    ], // list of receivers separated by comma
                                    subject: 'BF Bostadsnabben Ava***REMOVED***ble! ✔', // Subject line
                                    /*text: 'BF Bostadsnabben Ava***REMOVED***ble! ✔', // plaintext body*/
                                    html: '<a href="https://bostad.stockholm.se/Lista/Details/?aid=' + id + '">' + id + '</a><br>'// html body
                                }, function (success) {

                                    sendSms('0769943039', '0***REMOVED***', 'BF Bostadsnabben Ava***REMOVED***ble!  id: ' + id + '\r\n\r\n' + getDateTime() + '\r\n\r\n', function (response) {
                                        if (response) {
                                            console.log('SMS Sent!');
                                        } else {
                                            console.log("SMS Couldn't be sent");
                                        }
                                    });

                                    if (!success) {
                                        return console.log('EMAIL ERROR');
                                    }
                                    console.log('E-mail sent\n');
                                    //job.stop();
                                });
                            }

                            newids.push(id);
                            //ids = ids.remove(id);
                        } else if (ids.contains(id)) {
                            //ids = ids.remove(id);
                            stillava***REMOVED***ble.push(id)
                        }

                        if ((element['Ungdom'] == true || element['Vanlig'] == true || element['Bostadssnabben'] == true) && element['KanAnmalaIntresse'] == true) {
                            count += element['Antal'];
                        }
                    });


                    request({
                        uri: 'https://marknad.jarfallahus.se/API/Service/SearchServiceHandler.ashx',
                        method: "POST",
                        timeout: 15000,
                        headers: {
                            Accept: "*/*",
                            Host: "marknad.jarfallahus.se",
                            Origin: "https://marknad.jarfallahus.se",
                            Referer: "https://marknad.jarfallahus.se/pgSearchResult.aspx",
                            "X-Momentum-API-KEY": "6mY71aDCKIAFqiRUoZJKmNbKpTleyebtIEPl0wD4jWc=",
                            "X-Requested-With": "XMLHttpRequest",
                            'User-Agent': config.chrome_ua,
                            'Accept-Language': '*'
                        },
                        form: {
                            Parm1: '{"CompanyNo":-1,"SyndicateNo":1,"ObjectMainGroupNo":4,"Advertisements":[{"No":-1}],"RentLimit":{"Min":0,"Max":15000},"AreaLimit":{"Min":0,"Max":150},"ApplySearchFilter":true,"Page":1,"Take":10,"SortOrder":"SeekAreaDescription ASC, StreetName ASC","ReturnParameters":["ObjectNo","FirstEstateImageUrl","Street","SeekAreaDescription","PlaceName","ObjectSubDescription","ObjectArea","RentPerMonth","MarketPlaceDescription","CountInterest","FirstInfoTextShort","FirstInfoText","EndPeriodMP","FreeFrom","SeekAreaUrl","Latitude","Longitude","BoardNo"]}',
                            CallbackMethod: "PostObjectSearch",
                            CallbackParmCount: 1,
                            __WWEVENTCALLBACK: ''
                        },
                        followRedirect: true,
                        strictSSL: false,
                        proxy: config.proxy,
                        maxRedirects: 10
                    }, function (err, res, body) {
                        if (err) throw err;

                        body = JSON.parse(body);


                        body['Result'].forEach(function (element) {
                            var id = element['ObjectNo'];

                            count ++;


                            if (!ids.contains(id)) {
                            newids.push(id);
                            //ids = ids.remove(id);
                        } else if (ids.contains(id)) {
                            //ids = ids.remove(id);
                                stillava***REMOVED***ble.push(id)
                        }
                        });


                        request({
                            uri: 'https://marknad.upplands-brohus.se/API/Service/SearchServiceHandler.ashx',
                            method: "POST",
                            timeout: 15000,
                            headers: {
                                Accept: "*/*",
                                Host: "marknad.upplands-brohus.se",
                                Origin: "https://marknad.upplands-brohus.se",
                                Referer: "https://marknad.upplands-brohus.se/?mg=1",
                                "X-Momentum-API-KEY": "+FTolII7sNynUJWMso0zjawKmDHLnzZ9YWZwzupbOyE=",
                                "X-Requested-With": "XMLHttpRequest",
                                'User-Agent': config.chrome_ua,
                                'Accept-Language': '*'
                            },
                            form: {
                                Parm1: '{"CompanyNo":-1,"SyndicateNo":1,"ObjectMainGroupNo":1,"MarketPlaces":[{"No":101},{"No":100}],"Advertisements":[{"No":0}],"RentLimit":{"Min":0,"Max":15000},"AreaLimit":{"Min":0,"Max":200},"ApplySearchFilter":true,"Page":1,"Take":10,"SortOrder":"SeekAreaDescription asc, StreetName asc","ReturnParameters":["ObjectNo","FirstEstateImageUrl","Street","SeekAreaDescription","PlaceName","ObjectSubDescription","ObjectArea","RentPerMonth","MarketPlaceDescription","CountInterest","FirstInfoTextShort","FirstInfoText","EndPeriodMP","FreeFrom","SeekAreaUrl","Latitude","Longitude","BoardNo"]}',
                                CallbackMethod: "PostObjectSearch",
                                CallbackParmCount: 1,
                                __WWEVENTCALLBACK: ''
                            },
                            followRedirect: true,
                            strictSSL: false,
                            proxy: config.proxy,
                            maxRedirects: 10
                        }, function (err, res, body) {
                            if (err) throw err;

                            body = JSON.parse(body);


                            body['Result'].forEach(function (element) {
                                var id = element['ObjectNo'];
                                var type = element['MarketPlaceNo'];

                                // Only Ledig Direkt
                                if (type == 100) {

                                    count++;


                                    if (!ids.contains(id)) {
                                        newids.push(id);
                                        //ids = ids.remove(id);
                                    } else if (ids.contains(id)) {
                                        //ids = ids.remove(id);
                                        stillava***REMOVED***ble.push(id)
                                    }
                                }
                            });


                            request({
                                pool: {maxSockets: 25},
                                uri: 'https://bostad.hasselbyhem.se/',
                                method: "GET",
                                timeout: 15000,
                                headers: {
                                    'Host': 'bostad.hasselbyhem.se',
                                    'Upgrade-Insecure-Requests': 1,
                                    'DNT': 1,
                                    'Cache-Control': 'max-age=0',
                                    'Origin': 'https://bostad.hasselbyhem.se',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Referer': 'https://bostad.hasselbyhem.se/',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8,it;q=0.7',
                                    'User-Agent': config.chrome_ua,
                                    'Connection': 'keep-alive'
                                },
                                followRedirect: true,
                                strictSSL: false,
                                jar: cookies,
                                proxy: config.proxy,
                                maxRedirects: 10
                            }, function(err, res, body){

                                if (err) throw err;

                                var cmguidurl = res.request.uri.href;
                                var oldcmguid = extractBetweenStrings(body, 'cmguid=', '">here')[0];
                                var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                var viewstate2 = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                request({
                                    pool: {maxSockets: 25},
                                    uri: cmguidurl,
                                    method: "POST",
                                    timeout: 15000,
                                    headers: {
                                        'Host': 'bostad.hasselbyhem.se',
                                        'Upgrade-Insecure-Requests': 1,
                                        'DNT': 1,
                                        'Cache-Control': 'max-age=0',
                                        'Origin': 'https://bostad.hasselbyhem.se',
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Referer': 'https://bostad.hasselbyhem.se/User/MyPagesLogin.aspx',
                                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                                        'Accept-Encoding': 'gzip, deflate, br',
                                        'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8,it;q=0.7',
                                        'User-Agent': config.chrome_ua,
                                        'Connection': 'keep-alive'
                                    },
                                    followRedirect: true,
                                    strictSSL: false,
                                    jar: cookies,
                                    proxy: config.proxy,
                                    maxRedirects: 10,
                                    form: {
                                        '__LASTFOCUS': '',
                                        '__EVENTTARGET': '',
                                        '__EVENTARGUMENT': '',
                                        '__VIEWSTATE': viewstate,
                                        '__VIEWSTATEGENERATOR': viewstate2,
                                        '__EVENTVALIDATION': eventvalidation,
                                        'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtUserID': '***REMOVED***',
                                        "ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$txtPassword": config.password,
                                        'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col2$LoginControl1$btnLogin': 'OK',
                                        'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                        'ctl00$ctl01$SearchSimple$txtSearch': '',
                                        'ctl00$ctl01$hdnBrowserCheck': ''
                                    },
                                }, function (err, res, body) {

                                    newcmguid = extractBetweenStrings(body, 'cmguid=', '">here')[0];
                                    var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                    var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                    var viewstate2 = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                    request({
                                        pool: {maxSockets: 25},
                                        uri: 'https://bostad.hasselbyhem.se/User/MyPages.aspx?cmguid=' + newcmguid,
                                        method: "GET",
                                        timeout: 15000,
                                        headers: {
                                            'Host': 'bostad.hasselbyhem.se',
                                            'Upgrade-Insecure-Requests': 1,
                                            'DNT': 1,
                                            'Cache-Control': 'max-age=0',
                                            'Origin': 'https://bostad.hasselbyhem.se',
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                            'Referer': 'https://bostad.hasselbyhem.se/User/MyPagesLogin.aspx?cmguid=' + oldcmguid,
                                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                                            'Accept-Encoding': 'gzip, deflate, br',
                                            'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8,it;q=0.7',
                                            'User-Agent': config.chrome_ua,
                                            'Connection': 'keep-alive'
                                        },
                                        followRedirect: true,
                                        strictSSL: false,
                                        jar: cookies,
                                        proxy: config.proxy,
                                        maxRedirects: 10,

                                    }, function (err, res, body) {

                                        var eventvalidation = extractBetweenStrings(body, 'EVENTVALIDATION" value="', '" />')[0];
                                        var viewstate = extractBetweenStrings(body, 'VIEWSTATE" value="', '" />')[0];
                                        var viewstate2 = extractBetweenStrings(body, 'VIEWSTATEGENERATOR" value="', '" />')[0];

                                        request({
                                            pool: {maxSockets: 25},
                                            uri: 'https://bostad.hasselbyhem.se/User/MyPages.aspx',
                                            method: "POST",
                                            timeout: 15000,
                                            headers: {
                                                'Host': 'bostad.hasselbyhem.se',
                                                'Upgrade-Insecure-Requests': 1,
                                                'DNT': 1,
                                                'Cache-Control': 'max-age=0',
                                                'Origin': 'https://bostad.hasselbyhem.se',
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Referer': 'https://bostad.hasselbyhem.se/User/MyPages.aspx?cmguid=' + newcmguid,
                                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                                                'Accept-Encoding': 'gzip, deflate, br',
                                                'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8,it;q=0.7',
                                                'User-Agent': config.chrome_ua,
                                                'Connection': 'keep-alive'
                                            },
                                            followRedirect: true,
                                            strictSSL: false,
                                            jar: cookies,
                                            proxy: config.proxy,
                                            maxRedirects: 10,
                                            form: {
                                                '__EVENTTARGET': 'ctl00$ctl01$DefaultSiteContentPlaceHolder1$Col1$ListAva***REMOVED***ble$btnAva***REMOVED***bleApartments',
                                                '__EVENTARGUMENT': '',
                                                '__VIEWSTATE': viewstate,
                                                '__VIEWSTATEGENERATOR': viewstate2,
                                                '__EVENTVALIDATION': eventvalidation,
                                                'ctl00$ctl01$SearchSimple$autocompleteTreefilter': '',
                                                'ctl00$ctl01$SearchSimple$txtSearch': '',
                                                'ctl00$ctl01$hdnBrowserCheck': ''
                                            },
                                        }, function (err, res, body) {

                                            var newurl = extractBetweenStrings(body, 'Object moved to <a href="', '">here')[0];
                                            newurl= newurl.replace(/&amp;/g, '&');

                                            request({
                                                pool: {maxSockets: 25},
                                                uri: 'https://bostad.hasselbyhem.se' + newurl,
                                                method: "GET",
                                                timeout: 15000,
                                                headers: {
                                                    'Host': 'bostad.hasselbyhem.se',
                                                    'Upgrade-Insecure-Requests': 1,
                                                    'DNT': 1,
                                                    'Cache-Control': 'max-age=0',
                                                    'Origin': 'https://bostad.hasselbyhem.se',
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Referer': 'https://bostad.hasselbyhem.se/User/MyPages.aspx?cmguid=' + newcmguid,
                                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                                                    'Accept-Encoding': 'gzip, deflate, br',
                                                    'Accept-Language': 'en-US,en;q=0.9,sv;q=0.8,it;q=0.7',
                                                    'User-Agent': config.chrome_ua,
                                                    'Connection': 'keep-alive'
                                                },
                                                followRedirect: true,
                                                strictSSL: false,
                                                jar: cookies,
                                                proxy: config.proxy,
                                                maxRedirects: 10,
                                            }, function (err, res, body) {

                                                var ava***REMOVED***bleArr = extractBetweenStrings(body, 'ObjectDetailsTemplateB.aspx?cmguid=', '">');

                                                ava***REMOVED***bleArr.forEach(function (element) {
                                                    element = element.replace(/&amp;/g, '&');
                                                    var id = element.split('objectguid=')[1];
                                                    var url = 'https://bostad.hasselbyhem.se/HSS/Object/ObjectDetailsTemplateB.aspx?cmguid=' + element;

                                                    hhemurls.push(url);

                                                    count++;


                                                    if (!ids.contains(id)) {
                                                        newids.push(id);
                                                        //ids = ids.remove(id);
                                                    } else if (ids.contains(id)) {
                                                        //ids = ids.remove(id);
                                                        stillava***REMOVED***ble.push(id)
                                                    }

                                                });

                                                request({
                                                    uri: 'https://sigtunahem.se/widgets/?omraden=&egenskaper=SNABB&objektTyper=&maxAntalDagarPublicerad=&actionId=&callback=&widgets%5B%5D=objektsortering&widgets%5B%5D=objektfilter&widgets%5B%5D=objektlista%40lagenheter&widgets%5B%5D=pagineringgofirst&widgets%5B%5D=pagineringgonew&widgets%5B%5D=pagineringlista&widgets%5B%5D=pagineringgoold&widgets%5B%5D=pagineringgolast&widgets%5B%5D=paginering',
                                                    method: "GET",
                                                    timeout: 15000,
                                                    headers: {
                                                        'Host': 'sigtunahem.se',
                                                        'User-Agent': config.chrome_ua,
                                                        'Accept-Language': '*'
                                                    },
                                                    followRedirect: true,
                                                    strictSSL: false,
                                                    jar: cookies,
                                                    proxy: config.proxy,
                                                    maxRedirects: 10
                                                }, function (err, res, body) {
                                                    if (err) throw err;

                                                    var jsonBody = JSON.parse(body.slice(1, -2));



                                                    jsonBody.data["objektlista@lagenheter"].forEach(function (element) {

                                                        var id = (element["hyra"] +
                                                            element["inflyttningDatum"] +
                                                            element["byggAr"] +
                                                            element["yta"]
                                                        ).replace(/\s/g, "").replace(/-/g, "");

                                                        count++;


                                                        if (!ids.contains(id)) {
                                                            newids.push(id);
                                                            //ids = ids.remove(id);
                                                        } else if (ids.contains(id)) {
                                                            //ids = ids.remove(id);
                                                            stillava***REMOVED***ble.push(id)
                                                        }

                                                    });



                                                    var removedArr = ids.diff(stillava***REMOVED***ble);


                                                if (newids.length > 0) {
                                                    console.log(getDateTime() + '  ' + newids.length + ' New Ads! & ' + removedArr.length + ' Ads Removed!');

                                                    var newLinks = '';
                                                    var mysqlQuery = '';
                                                    var hhemPrefixed = false;
                                                    var jfhusPrefixed = false;
                                                    var upbrohusPrefixed = false;
                                                    var bfPrefixed = false;
                                                    var sighemPrefixed = false;

                                                    newids.forEach(function (value, index) {
                                                        if (newids.length == index + 1) {
                                                            mysqlQuery += "('" + newids[index] + "')";
                                                        } else {
                                                            mysqlQuery += "('" + newids[index] + "'),";
                                                        }

                                                        if (newids[index].length > 17 && newids[index].length < 21) {
                                                            if (sighemPrefixed == false) {
                                                                sighemPrefixed = true;
                                                                newLinks += '<br><h2 style="color:green;">SigtunaHem (Bostadsnabben)</h2>';
                                                            }
                                                            newLinks += '<a href="https://sigtunahem.se/sok-ledigt/?omraden=&egenskaper=SNABB">' + newids[index] + '</a><br>';
                                                        } else if (newids[index].length > 20) {
                                                            if (hhemPrefixed == false) {
                                                                hhemPrefixed = true;
                                                                newLinks += '<br><h2 style="color:green;">Hässelby Hem</h2>';
                                                            }
                                                            hhemurls.forEach(function (element) {
                                                                if (element.contains(newids[index])) {
                                                                    newLinks += '<a href="' + element + '">' + newids[index] + '</a><br>';
                                                                }
                                                            })

                                                        } else if (newids[index].length == 14) {
                                                            if (jfhusPrefixed == false) {
                                                                jfhusPrefixed = true;
                                                                newLinks += '<br><h2 style="color:green;">Järfällahus (Ungdom)</h2>';
                                                            }
                                                            newLinks += '<a href="https://marknad.jarfallahus.se/pgObjectInformation.aspx?company=1&obj=' + newids[index] + '">' + newids[index] + '</a><br>';
                                                        } else if (newids[index].length == 13) {
                                                            if (upbrohusPrefixed == false) {
                                                                upbrohusPrefixed = true;
                                                                newLinks += '<br><h2 style="color:green;">Upplands-Brohus (Ledigt Direkt)</h2>';
                                                            }
                                                            newLinks += '<a href="https://marknad.upplands-brohus.se/pgObjectInformation.aspx?company=1&obj=' + newids[index] + '">' + newids[index] + '</a><br>';
                                                        } else {
                                                            if (bfPrefixed == false) {
                                                                bfPrefixed = true;
                                                                newLinks += '<br><h2 style="color:green;">Bostadsförmedlingen (Ungdom)</h2>';
                                                            }
                                                            newLinks += '<a href="https://bostad.stockholm.se/Lista/Details/?aid=' + newids[index] + '">' + newids[index] + '</a><br>';
                                                        }
                                                    });

                                                    editedEmailTemplate = emailTemplate
                                                        .replace('{IMGURL1}', 'https://jarfallahus.se/Global/LogoTypes/JarfallahusLogo352px.png')
                                                        .replace('{IMGURL2}', 'https://static.hitta.se/static/products/images/InfoText/bostadsformedlingen-il.gif')
                                                        .replace('{IMGURL3}', 'https://upplands-brohus.se/wp-content/themes/ubh-theme/images/logo.png')
                                                        .replace('{IMGURL4}', 'https://bostad.hasselbyhem.se/Res/Themes/Hasselbyhem/Img/Hasselbyhem_logo.png')
                                                        .replace('{IMGURL5}', 'https://greencon.se/wp-content/uploads/2015/11/SigtunaHem-Logo-Landscape-CMYK-till-hemsidan.png')
                                                        .replace('{DATETIME}', getDateTime(false, true))
                                                        .replace('{VERSION}', config.version)
                                                        .replace('{IP}', getIP())
                                                        .replace('{LINKS}', newLinks);

                                                    sendEmail({
                                                        from: '"Bostadsförmedlingen" <***REMOVED***acc1@gmail.com>', // sender address
                                                        to: [
                                                            '***REMOVED******REMOVED******REMOVED***'
                                                        ], // list of receivers separated by comma
                                                        subject: 'BF Nya Lägenheter! ✔', // Subject line
                                                        /*text: 'BF Nya Lägenheter! ✔<br>' // plaintext body*/
                                                        html: editedEmailTemplate // html body
                                                    }, function (success) {

                                                        if (!success) {
                                                            return console.log('EMAIL ERROR');
                                                        }
                                                        DB("INSERT INTO ava***REMOVED***ble (id) VALUES " + mysqlQuery + " ON DUPLICATE KEY UPDATE id=id");
                                                        //console.log('\nTotal Ava***REMOVED***ble Apartments: ' + count);
                                                        console.log('E-mail sent\n');
                                                        //job.stop();
                                                    });
                                                } else {
                                                    if (timesCount == 0 || timesCount > 23) {
                                                        console.log(getDateTime() + '  Inga nya lägenheter!');
                                                    }
                                                    //console.log('\nTotal Ava***REMOVED***ble Apartments: ' + count);
                                                }

                                                if (removedArr.length > 0) {
                                                    //Remove from DB
                                                    removedArr.forEach(function (value, index) {
                                                        DB('DELETE FROM ava***REMOVED***ble where id="' + removedArr[index] + '"');
                                                        console.log(getDateTime() + '  ID: ' + removedArr[index] + ' removed!');
                                                    });
                                                    ids = [];
                                                }

                                                if (timesCount > 23) {
                                                    timesCount = 0;
                                                    console.log("Database connected!\n".cyan);
                                                    console.log(getDateTime() + '  BOT is Running!'.cyan);
                                                }
                                                timesCount++;

                                            });

                                            });
                                        });
                                    });


                                    /* if (res.statusCode == 302) {
                                         cb(true);
                                     } else if (err) {throw err;}
                                     else {
                                         cb(false);
                                     }*/
                                });
                            });


                        });
                    });
                });
            } else {
                console.log('Couldn\'t login!');
            }
        });
    } else {
        console.log('DB NOT CONNECTED!\n'.red);
        setTimeout(start, 60000);
        if (cronRunning) {
            job.stop();
            cronRunning = false;
        }
    }
});
}





function login (email, password, cb) {

    cookies = request.jar();

    if ((!email) || (!password)) {
        console.log('Email or Password empty!'.red);
        return cb(false);
    }

    request({
        pool: {maxSockets: 25},
        uri: 'https://login001.stockholm.se/siteminderagent/forms/login.fcc',
        method: "POST",
        timeout: 15000,
        headers: {
            "Host": "login001.stockholm.se",
            "Origin": "https://bostad.stockholm.se",
            "Referer": "https://bostad.stockholm.se/Minasidor/login/",
            'Accept-Language': '*',
            'User-Agent': config.chrome_ua,
        },
        followRedirect: true,
        strictSSL: false,
        jar: cookies,
        proxy: config.proxy,
        maxRedirects: 10,
        form: {
            "target": "-SM-https://bostad.stockholm.se/secure/login",
            "smauthreason": 0,
            "smagentname": "bostad.stockholm.se",
            "USER": email,
            "PASSWORD": password
        },
    }, function (err, res, body) {
        if (res.statusCode == 302) {
            cb(true);
        } else if (err) {throw err;}
        else {
            cb(false);
        }
    });
}


function sendEmail(mailOptions, cb) {
    /**
     var mailOptions = {
        from: '"WiFog Notification" <notification@***REMOVED***.com>', // sender address
        to: '***REMOVED******REMOVED******REMOVED***', // list of receivers separated by comma
        subject: 'Giftcards Ava***REMOVED***ble! ✔', // Subject line
        text: 'Giftcards Ava***REMOVED***ble!' // plaintext body
        //html: '<b>Giftcards Ava***REMOVED***ble!</b>' // html body
    };

     **/


    mailOptions.tls = {
        rejectUnauthorized: false
    };


    nodemailer.createTransport('smtps://***REMOVED***acc1%40gmail.com:Ila***REMOVED******REMOVED***03@smtp.gmail.com').sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('EMAIL ERROR: ' + error.toString().red)
            return cb(false);
        }
        return cb(true);
    });
}
function sendSms(from, to, message, cb) {
    //message = message.split(' ').join('+');

    request({
        uri: 'http://www.sms.se/ajax/send',
        method: "POST",
        form: {
            'senderNumber': from,
            'recipientNumber': to,
            'message': message
        },
        headers: {
            'Host': 'www.sms.se',
            'User-Agent': config.chrome_ua,
            'Accept': 'application/json, text/javascript, */*',
            'Origin': 'http://www.sms.se',
            'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 15000,
        followRedirect: true,
        strictSSL: false,
        proxy: config.proxy,
        maxRedirects: 10
    }, function (err, res, body) {
        if (err) throw err;

        cb(JSON.parse(body)['success'] == true || JSON.parse(body)['success'] == 'true');
    });
}
function initDB(cb) {

        mysqlConnection.getConnection(function (err, connection) {
            if (!err) {
                if (timesCount == 0 || timesCount > 23) {
                    timesCount = 0;
                    console.log("Database connected!\n".cyan);
                    console.log(getDateTime() + '  BOT is Running!'.cyan);
                }
                //console.log("Database connected!\n");

                connection.query('SELECT * from ava***REMOVED***ble', function (err, rows) {
                    if (!err) {

                        Object.keys(rows).forEach(function (row) {
                            var id = rows[row].id;

                            ids.push(id);
                        });


                            cb(true);
                            connection.release();

                    }
                    else {
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
function getDateTime(onlyTime, noSeconds) {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return onlyTime ? (hour + ":" + min + (noSeconds ? "" : ":" + sec)) : (year + "-" + month + "-" + day + " " + hour + ":" + min + (noSeconds ? "" : ":" + sec));

}
function getIP () {

    var res = syncRequest('GET', 'https://www.trackip.net/ip?json');
    return JSON.parse(res.getBody())['IP'];

}
function extractBetweenStrings(str, start, end) {
    start = RegExp.escape(start);
    end = RegExp.escape(end);

    var regex = new RegExp(start + "(.*?)" + end, "igm");
    var matchedArr = regex.matchAll(str.trim());

    return matchedArr;
}