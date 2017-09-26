/**
 * Created by wendersonpires on 27/11/16.
 * - FFmpeg installed is necessary!
 * - Auto delete files from server after Download
 * - When used to download on server, it supports downloading the same audio without overwriting another (if 2 or more people are downloading the same audio).
 */

'use strict';

var itags   = require('./itags');
var toTime  = require('./toHHMMSS');
var ytdl    = require('ytdl-core');
var ffmpeg  = require('fluent-ffmpeg');
var probe = require('node-ffprobe');
var timeformat = require('hh-mm-ss');
var removeAccents = require('remove-accents');
var log = require('console-log-level')({ level: 'info' });
function HorizonMP3(){}

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
  var videoFormats = null;

  //Get infos
  ytdl.getInfo(videoURL, {}, function(err, info){

    if(err){
      return callback('Error on get info.');
    }

    if(info){

      videoName = info.title;
      videoTimeSec = info.length_seconds;
      videoThumb = info.thumbnail_url;
      videoFormats = info.formats;

      var formats = info.formats;

      //Filter to search values
      formats.forEach(function(format){

        //If exists someone value...
        if(!isValid) if(format.itag == itags.ITAG_43 || format.itag == itags.ITAG_251 || format.itag == itags.ITAG_140){
          videoFile = format.url;
          isValid = true;
        }
      });
    }

    //Callback contain datas
    callback(null, {
      isValid:        isValid,
      videoName:      videoName,
      videoThumb:     videoThumb,
      videoTime:      toTime(videoTimeSec),
      videoTimeSec:   videoTimeSec,
      videoFile:      videoFile,
      videoFormats:   videoFormats
    });

  });
};

/**
 * Converts and download in MP3 Format
 * @param {String}      videoURL
 * @param {Response}    res (optional) Auto pipe on response
 * @param {String}      optionalName (optional) Optional name to file.
 * @param {Object}      cropParams (optional) Sets start and end time for cutting. Format: {start:'mm:ss', end:'mm:ss'}
 * @param {Function(String)} callback. It's only to no Response (directly download) because when the parameter res is non null, it automatically dispatch the callback.
 */
HorizonMP3.download = function(videoURL, res, optionalName, cropParams, callback){

  //Proccess
  let videoFile = null;
  let videoName = optionalName;
  var startTimeConv;
  var endTimeConv;

  if(cropParams !== null){
    if(cropParams.start !== undefined && cropParams.end !== undefined){
      startTimeConv = timeformat.toS(cropParams.start);
      endTimeConv = timeformat.toS(cropParams.end);
      var realEndTime = Math.abs(endTimeConv - startTimeConv);
            
      //Set new properties
      cropParams.start = startTimeConv;
      cropParams.end = realEndTime;
    }
  }

  //Get infos
  this.getInfo(videoURL, function(err, e){

    //On error on get info
    if(err){
      return callback(err);
    }

    //Video does not exist
    if(e.videoName == null){
      return callback('Video does not exist');
    }

    //Alert
    log.info(`Video name: ${e.videoName}`);

    videoFile = e.videoFile;
    if(videoName == null) {
      videoName = e.videoName;
      videoName = removeAccents(videoName); //Remove todas as caracteres especiais e substitui letras com acentos para letras normais
      videoName = videoName + '.mp3';
    }
    
    //Busca informacoes primarias do video (tempo certo.)
    let videoDuration;

    if(!cropParams) {
      probe(e.videoFile, function(err, probeData) {
        videoDuration = probeData.format.duration;
  
        if(videoDuration) {
          //Init Head to response with Download file
          if(res != null) {
            res.writeHead(200, {
              'Set-Cookie': 'fileDownload=true; path=/',
              'Content-Type': 'audio/mpeg',
              'Content-disposition': 'attachment; filename=' + fixedEncodeURI(videoName),
              'Content-Length': ((128/8) * videoDuration) * 1000
            });
          }
        }
  
        nextProcess();
      });
    } else {

      //Caso seja uma requisicao com Crop. apenas pula para proxima etapa (nao precisa buscar informacoes pelo Probe)
      //porque o processo de corte nao mostra o tamanho final que o arquivo vai ter.
      nextProcess();
    }

    function nextProcess(){
  
      if(cropParams === null){
  
        //Init Head to response with Download file
        if(res != null && !videoDuration) {
          res.writeHead(200, {
            'Set-Cookie': 'fileDownload=true; path=/',
            'Content-Type': 'audio/mpeg',
            'Content-disposition': 'attachment; filename=' + fixedEncodeURI(videoName)
          });
        }
  
        //Init normal conversion proccess
        ffmpeg(videoFile)
          .format('mp3')
          .on('start', function() {
            log.info('Converting...');
          })
          .on('end', function() {
            log.info('Conversion finished!');
  
            if(callback) callback(null, 'Conversion file complete!');
          })
          .on('error', function(err) {
            if(err){
              log.info(`Cannot process video: ${err.message}`);
            }

            //log.info('Conversion finished!');
            if(callback) callback(null, 'Conversion file complete!');
          })
  
          //Send file in real time in same time that are converted
          .pipe(res, { end: !videoDuration });
  
      } else {
  
        //Init Head to response with Download file
        if(res != null) {
          //var fileSizeByTime = Math.abs(startTimeConv - endTimeConv);
          res.writeHead(200, {
            'Set-Cookie': 'fileDownload=true; path=/',
            'Content-Type': 'audio/mpeg',
            'Content-disposition': 'attachment; filename=' + fixedEncodeURI(videoName)
          });
        }
  
        //Verify params
        if(cropParams.start !== undefined && cropParams.end !== undefined){
  
          //Init cropping conversion proccess
          ffmpeg(videoFile)
            .format('mp3')
            .seekInput(cropParams.start)
            .duration(cropParams.end)
            .on('start', function() {
              log.info('Converting...');
            })
            .on('end', function() {
              log.info('Conversion finished!');
  
              if(callback) callback(null, 'Conversion file complete!');
            })
            .on('error', function(err) {
              log.info(`Cannot process video: ${err.message}`);
            })
  
            //Send file in real time in same time that are converted
            .pipe(res, { end: true });
        } else {
          res.json(200, {
            message:'Error: Missing params on CropParams.'
          });
        }
      }
    }
  });
};

function fixedEncodeURI(str) {
  return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}


module.exports = HorizonMP3;