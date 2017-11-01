'use strict';

var horizon = require('../lib/index');
var http = require('http');
var url  = require('url') ;
var log = require('console-log-level')({ level: 'info' });

var server = http.createServer(function(request, response) {

  var paramsUrl = url.parse(request.url, true).query;
  log.info('URL Video: ' + paramsUrl.youtubeURL);

  //var cropParams = {start:'02:15', end:'02:20'}; //Optional
  var cropParams = null;

  horizon.download(paramsUrl.youtubeURL, response, null, cropParams, null, true, function(err, e){

    if(err) {
      return log.info(err);
    }

    if(e === horizon.successType.CONVERSION_FILE_COMPLETE){
      log.info(e);
    }
  });
});

server.listen(3000);
log.info('Server running!');
log.info('Put on browser: http://localhost:3000/?youtubeURL=http://youtube.com/watch?v=NEA0BLnpOtg');