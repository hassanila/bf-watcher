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
    pool: {maxSockets: 25},
    uri: 'https://***REMOVED******REMOVED***.net/ListInterest',
    method: "GET",
    timeout: 15000,
    followRedirect: true,
    strictSSL: false,
    jar: cookies,
    proxy: config.proxy,
    maxRedirects: 10,

}, function (err, res, body) {

    var $ = cheerio.load(body);

    var ele = $('.interest-footer p');
    var toDelete = [];
    var pricesToExclude = []

    ele.each(function (i, element) {

        //console.log('\nEle: ' + ele.text())

        pricesToExclude.push(parseInt($('div.interest-objectinfo ul:nth-child(6) li:nth-child(2)').eq(i).text(), 10));
        //console.log(pricesToExclude[i])
        //console.log('toexc: ' + pricesToExclude[i])
        if (ele.eq(i).text().contains('Du har inte blivit erbjuden visning')) {
            console.log(ele.eq(i).text())
            console.log(i)
            toDelete.push('https://bostad.hasselbyhem.se' + $('[id$=_hlDeleteTxtApartment]').eq(i).attr('href'));
            console.log(toDelete[0])
            //console.log('Om du blir erbjuden visning :(');
        }
    });
    process.exit()
});