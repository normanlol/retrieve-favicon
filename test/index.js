const faviget = require("../index");

// general favicon retrieval
faviget.get("https://github.com/", function(err, resp) {
    if (err) {
        console.log("Favicon retriever ran into an error.");
        console.log(err);
    } else {
        console.log("Favicon retriever got " + resp.length + " icons.");
    }
});

// /favicon.ico checker
faviget.isIco("https://github.com", function(err, resp) {
    if (err) {
        console.log("The /favicon.ico checker ran into an error.");
        console.log(err);
    } else {
        console.log("Favicon retriever checked the icon successfully. (" + resp + ")");
    }
})