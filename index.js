const got = require("got");
const cheerio = require("cheerio");
var {parse} = require("url");

exports.get = function(url, cb) {
    got(url, {
        headers: {
            "Accept-Encoding": "gzip,deflate,br",
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            "From": "googlebot(at)googlebot.com",
            "Accept": "text/html,application/xhtml,application/xml;q=0.9,*/*,q=0.8",
            "Connection": "close",
            "Cache-Control": "no-cache",
            "Accept-Language": "en-US"
        }
    }).then(function(resp) {
        var $ = cheerio.load(resp.body);
        var e = [];
        if ($("[rel='icon']").attr("href")) {e.push($("[rel='icon']").attr("href"))}
        if ($("[rel='shortcut icon']").attr("href")) {e.push($("[rel='shortcut icon']").attr("href"))}
        if ($("[rel='image_src']").attr("href")) {e.push($("[rel='image_src']").attr("href"))}
        if ($("[rel='apple-touch-icon']").attr("href")) {e.push($("[rel='apple-touch-icon']").attr("href"))}
        if ($("[rel='alternate icon']")) {e.push($("[rel='alternate icon']").attr("href"))}
        if ($("[rel='mask-icon']")) {e.push($("[rel='mask-icon']").attr("href"))}
        if ($("[rel='fluid-icon']")) {e.push($("[rel='fluid-icon']").attr("href"))}
        e = refine(e, url);
        cb(null, e);
    }).catch(function(err) {
        if (err.response && err.response.body) {
            var $ = cheerio.load(err.response.body);
            var e = [];
            if ($("[rel='icon']").attr("href")) {e.push($("[rel='icon']").attr("href"))}
            if ($("[rel='shortcut icon']").attr("href")) {e.push($("[rel='shortcut icon']").attr("href"))}
            if ($("[rel='image_src']").attr("href")) {e.push($("[rel='image_src']").attr("href"))}
            if ($("[rel='apple-touch-icon']").attr("href")) {e.push($("[rel='apple-touch-icon']").attr("href"))}
            if ($("[rel='alternate icon']")) {e.push($("[rel='alternate icon']").attr("href"))}
            if ($("[rel='mask-icon']")) {e.push($("[rel='mask-icon']").attr("href"))}
            if ($("[rel='fluid-icon']")) {e.push($("[rel='fluid-icon']").attr("href"))}
            e = refine(e, url);
            cb(null, e);
        } else {
            cb(err, null);
        }
    })
}

exports.isIco = function(url, cb) {
    var h = parse(url, true).hostname
    got("http://" + h + "/favicon.ico", {
        headers: {
            "Accept-Encoding": "gzip,deflate,br",
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            "From": "googlebot(at)googlebot.com",
            "Accept": "text/html,application/xhtml,application/xml;q=0.9,*/*,q=0.8",
            "Connection": "close",
            "Cache-Control": "no-cache",
            "Accept-Language": "en-US"
        }
    }).then(function(resp) {
        if (resp.headers["content-type"] == "image/x-icon") {cb(null, true);} else {cb(null, false)}
    }).catch(function(err) {
        if (!err.response) {
            cb(err, null);
        } else {
            if (err.response.headers["content-type"] == "image/x-icon") {cb(null, true);} else {cb(null, false)}
        }
    })
}

function refine(arr, url) {
    var n = [];
    for (var c in arr) {
        if (arr[c] !== undefined && arr[c] !== null) {
            var curr = arr[c];
            if (curr.startsWith("http://") | curr.startsWith("https://")) { n.push(curr); } else {
                if (curr.startsWith("/")) {
                    var nc = parse(url, true).host + curr;
                    n.push(nc);
                } else {
                    var nc = "http://" + curr;
                    n.push(nc);
                }
            }
        }
    }
    return n;
}