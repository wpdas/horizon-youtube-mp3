/**
 * Created by wendersonpires on 27/11/16.
 */

var horizon = require('../lib/index');
var path = require('path');
var http = require("http");
var url  = require('url') ;

var server = http.createServer(function(request, response) {

    var paramsUrl = url.parse(request.url, true).query;
    console.log("URL Video: " + paramsUrl.youtubeURL);


    horizon.download(paramsUrl.youtubeURL, response, null, function(e){

        console.log(e); //Will return: "Downloading file complete!"

        //Your code here...
    });
});

server.listen(3000);
console.log("Server running!");
console.log("Put on browser: http://localhost:3000/?youtubeURL=http://youtube.com/watch?v=NEA0BLnpOtg");