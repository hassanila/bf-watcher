var request = require('request'),
    config = require('../config.js');


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
    proxy: config.proxies[1],
    maxRedirects: 10
}, function (err, res, body) {
    if (err) throw err;

    body = JSON.parse(body);


    body['Result'].forEach(function (element) {
        var id = element['ObjectNo'];
        var link = 'https://marknad.jarfallahus.se/pgObjectInformation.aspx?company=1&obj=' + id;

        console.log(link);

    });
});