var request = require('request'),
    config = require('../config.js'),
    cheerio = require('cheerio');


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
        uri: 'https://cl-lettings-web.azurewebsites.net/api/v2/cities/SE/apartment?advertStatus=published',
        method: "GET",
        timeout: 15000,
        headers: {
            'Host': 'cl-lettings-web.azurewebsites.net',
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


        var body1 = JSON.parse(body).data;

        var counting = 0;
        body1.forEach(function (element, i) {
            var name = element['name'].toString().toLowerCase()
                .replace('ä', 'a')
                .replace('å', 'a')
                .replace('ö', 'o');


            if (name != 'malmo') {
                var url = element['_links']['teasers'];

                request({
                    uri: 'https://cl-lettings-web.azurewebsites.net' + url,
                    method: "GET",
                    timeout: 15000,
                    headers: {
                        'Host': 'cl-lettings-web.azurewebsites.net',
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

                    counting++;

                    body = JSON.parse(body).data;

                    body.forEach(function (element, index) {

                        var id = element['unitId'];
                        console.log(id);
                        console.log('https://www.akelius.se/site/search/apartment/' + name + '/' + id.split('.')[0] + '/' + id);
                        if (body1.length == counting) {
                            console.log('Done!');
                            process.exit()
                        }
                    });



                });
            }

        });



    });