var request = require('request'),
    config = require('../config.js');


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


var cookies = request.jar();


function extractBetweenStrings(str, start, end) {
    start = RegExp.escape(start);
    end = RegExp.escape(end);

    var regex = new RegExp(start + "(.*?)" + end, "igm");
    var matchedArr = regex.matchAll(str.trim());

    return matchedArr;
}


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
}, function(err, res, body) {

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
            uri: 'https://bostad.hasselbyhem.se/HSS/ObjectInterest/ListInterest.aspx',
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

        });
    })
});