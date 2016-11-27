/**
 * Created by wendersonpires on 27/11/16.
 * - FFmpeg installed is necessary!
 * - Auto delete files from server after Download
 * - When used to download on server, it supports downloading the same audio without overwriting another (if 2 or more people are downloading the same audio).
 *
 * (!) ****** FALTA CONFIGRAR package.json DE ACORDO COM OS OUTROS E PUBLICAR NO GIT E NPM
 * VERIFICAR ASSINATURA EM CADA CLASSE SEGUINDO O EXEMPLO DOS OUTROS MODULOS
 */

'use strict';

var itags   = require('./itags');
var toTime  = require('./toHHMMSS');
var ytdl    = require('ytdl-core');
var fs      = require('fs');
var path    = require('path');
var ffmpeg  = require('fluent-ffmpeg');
var shortid = require('shortid');

function HorizonMP3(){};

/**
 * Search Info
 * @param {String} videoURL
 * @param {Function(Object)} callback
 */
HorizonMP3.getInfo = function(videoURL, callback){
    
    //Infos
    var isValid = false;
    var videoName = null;
    var videoThumb = null;
    var videoTimeSec = null;
    var videoFile = null;

    //Get infos
    ytdl.getInfo(videoURL, {}, function(err, info){

        if(info){

            videoName = info.title;
            videoTimeSec = info.length_seconds;
            videoThumb = info.iurlmq;

            var formats = info.formats;

            //Filter to search values
            formats.forEach(function(format){

                //If exists someone value...
                if(!isValid) if(format.itag == itags.ITAG_43 || format.itag == itags.ITAG_251 || format.itag == itags.ITAG_140){
                    videoFile = format.url;
                    isValid = true;
                };
            });
        }

        //Callback contain datas
        callback({
            isValid:        isValid,
            videoName:      videoName,
            videoThumb:     videoThumb,
            videoTime:      toTime(videoTimeSec),
            videoFile:      videoFile
        });

    });
};

/**
 * Converts and download in MP3 Format
 * @param {String}      videoURL
 * @param {String}      filePath
 * @param {Response}    res (optional) Auto pipe on response
 * @param {String}      optionalName (optional) Optional name to file.
 * @param {Function(String)} callback. It's only to no Response (directly download) because when the parameter res is non null, it automatically dispatch the callback.
 */
HorizonMP3.download = function(videoURL, downloadPath, res, optionalName, callback){

    //Proccess
    var filePath = downloadPath;
    var outStream = null;

    var videoFile = null;
    var videoName = optionalName;

    //Get infos
    this.getInfo(videoURL, function(e){

        //Alert
        console.log("Video name: " + e.videoName);

        videoFile = e.videoFile;
        if(videoName == null) videoName = e.videoName + '.mp3';

        //Final file name
        if(res != null){
            filePath = path.join(downloadPath + "/" + shortid.generate() + '.mp3'); //Temporary name
        } else {
            filePath = filePath + "/" + videoName;
        }

        outStream = fs.createWriteStream(filePath);

        //Init Head to response with Download file
        if(res != null) {
            res.writeHead(200, {
                'Set-Cookie': 'fileDownload=true; path=/',
                'Content-Type': 'audio/mpeg',
                'Content-disposition': 'attachment; filename=' + videoName
            });
        };

        //Init conversion proccess
        var command = ffmpeg(videoFile)
            .format('mp3')
            .on('start', function() {
                console.log("Converting...");

            })
            .on('end', function() {
                console.log('Conversion finished!');

                if(res == null) {callback("Downloading file complete!");};

                //Call download on res
                if(res != null) {

                    var readStream = fs.createReadStream(filePath);
                    readStream.on('end', function() {

                        console.log('Downloading file complete!');

                        //After save and download file, delete temporary file from server
                        fs.unlink(filePath, function() {
                            console.log('Temporary file deleted from server.');
                        });
                    });

                    readStream.pipe(res);
                };
            })
            .on('error', function(err, stdout, stderr) {
                console.log('Cannot process video: ' + err.message);
            })
            .pipe(outStream, { end: true });
    });
};


module.exports = HorizonMP3;