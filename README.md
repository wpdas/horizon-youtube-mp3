# horizon-youtube-mp3

Get info and download (server or local) MP3 audio from youtube videos in node.js using horizon-youtube-mp3.

### Main Online App

Project developed using this module:
[YouTube Transfer App Site](http://www.youtubetransfer.com/)

### Prerequisites

#### ffmpeg and ffprobe

fluent-ffmpeg requires ffmpeg >= 0.9 to work.  It may work with previous versions but several features won't be available (and the library is not tested with lower versions anylonger).

If the `FFMPEG_PATH` environment variable is set, fluent-ffmpeg will use it as the full path to the `ffmpeg` executable.  Otherwise, it will attempt to call `ffmpeg` directly (so it should be in your `PATH`).  You must also have ffprobe installed (it comes with ffmpeg in most distributions).  Similarly, fluent-ffmpeg will use the `FFPROBE_PATH` environment variable if it is set, otherwise it will attempt to call it in the `PATH`.

Most features should work when using avconv and avprobe instead of ffmpeg and ffprobe, but they are not officially supported at the moment.

**Windows users**: most probably ffmpeg and ffprobe will _not_ be in your `%PATH`, so you _must_ set `%FFMPEG_PATH` and `%FFPROBE_PATH`.

**Debian/Ubuntu users**: the official repositories have the ffmpeg/ffprobe executable in the `libav-tools` package, and they are actually rebranded avconv/avprobe executables (avconv is a fork of ffmpeg).  They should be mostly compatible, but should you encounter any issue, you may want to use the real ffmpeg instead.  You can either compile it from source or find a pre-built .deb package at https://ffmpeg.org/download.html (For Ubuntu, the `ppa:jon-severinsson/ffmpeg` PPA provides recent builds).

## Main features

- Convert video from youtube in mp3 files (128 kBit/s) in realtime;
- Pipe stream of converted bytes;
- Save file in local folder (New);
- Crop time (start and end time).

With [npm](https://www.npmjs.com/) do:

```
npm install horizon-youtube-mp3
```

## API

Get info parameters:
```js
horizon.getInfo(url:String, callback:Function) => Get information from video.
```

Example:
``` js
// Get video information
horizon.getInfo("http://youtube.com/watch?v=NEA0BLnpOtg", function(err, data){...});
```

Download parameters (server):
```js
//Convert and send bytes to stream (download mp3 on client side)
horizon.download(
  videoURL:String,
  res:Response,
  optionalName?:String,
  cropParams?:Object,
  maxTimeAllowed?:Number,
  showSize?:Boolean,
  callback?:Function
  );
```

Example:
``` js
horizon.download("http://youtube.com/watch?v=NEA0BLnpOtg", response, null, {start:'02:15', end:'02:20'}, null, false, function(err, result){
  //On Conversion Complete
});
```

Download to Local parameters (local):
```js
//Convert video and save the final file in local path.
horizon.downloadToLocal(
  videoURL:String,
  directory:String,
  optionalName?:String,
  cropParams?:Object,
  maxTimeAllowed?:Number,
  callback?:Function,
  onProgress?:Function
  );
```

Params Info:
``` txt
videoURL = Url Youtube video;
res = API Response (to server only);
directory = Directory to save file (to local only);
optionalName = A default name for the audio file;
cropParams = Crop params;
maxTimeAllowed = Total time from video allowed (seconds);
showSize = Show size of file during download (to server only);
callback = Call on dowload file is complete;
onProgress = Show progress of conversion (to local only);
```

Type of errors callback:
``` js
log.info(horizon.errorsType)...
NO_DESTINATION;           => When res and directory parameters is not defined.
LONG_VIDEO_TIME;          => Video time is longer than allowed.
ERROR_ON_GET_INFO;        => Error on get info.
VIDEO_DOES_NOT_EXIST;     => Video does not exist.
ERROR_PROCESSING_VIDEO:   => Internal Server Error on Processing Video.
URL_VIDEO_NOT_DEFINED;    => Url Video Not Defined.
MISSING_CROP_PARAMS;      => Missing params on CropParams.
```

Type of success callback
``` js
log.info(horizon.successType)...
CONVERSION_FILE_COMPLETE; => Conversion File Complete (and sent in response)
```

## Usage Examples
### Get info from video.

``` js
var horizon = require('horizon-youtube-mp3');

horizon.getInfo('http://youtube.com/watch?v=NEA0BLnpOtg', function(err, e){

  console.log(e);

  /**
     * Will Return:
     *
     * { isValid: true,
     *   videoName: 'OZIELZINHO - TOP GEAR 2.0',
     *   videoThumb: 'https://i.ytimg.com/vi/NEA0BLnpOtg/hqdefault.jpg?custom=true&w=320&h=180&stc=true&jpg444=true&jpgq=90&sp=68&sigh=FoGsoudXCGPU-Fb6epRh1eIzVDs',
     *   videoTime: '2:35',
     *   videoTimeSec 244,
     *   videoThumbList: {sd: 'http...', mq: 'http...', hq: 'http...', hd: 'http...'},
     *   videoFile: 'https://....'
     *   videoFormats: [...]}
     */
});
```

### Use for server-side processing and client-side downloading

``` js
var horizon = require('horizon-youtube-mp3');
var http = require('http');
var url  = require('url') ;
var log = require('console-log-level')({ level: 'info' });

var server = http.createServer(function(request, response) {

  var paramsUrl = url.parse(request.url, true).query;
  log.info('URL Video: ' + paramsUrl.youtubeURL);

  //var cropParams = {start:'02:15', end:'02:20'}; //Optional
  var cropParams = null;

  horizon.download(paramsUrl.youtubeURL, response, null, cropParams, null, false, function(err, e){

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
```

### Use for local processing (New)

```js
var horizon = require('horizon-youtube-mp3');
var path = require('path');

var downloadPath = path.join(__dirname);

horizon.downloadToLocal(
  'http://youtube.com/watch?v=NEA0BLnpOtg',
  downloadPath,
  null,
  null,
  null,
  onConvertVideoComplete,
  onConvertVideoProgress
);

function onConvertVideoComplete(err, result) {
  console.log(err, result);
  // Will return...
  //null, conversionFileComplete
}

function onConvertVideoProgress(percent, timemark, targetSize) {
  console.log('Progress:', percent, 'Timemark:', timemark, 'Target Size:', targetSize);
  // Will return...
  // Progress: 90.45518257038955 Timemark: 00:02:20.04 Target Size: 2189
  // Progress: 93.73001672942894 Timemark: 00:02:25.11 Target Size: 2268
  // Progress: 100.0083970106642 Timemark: 00:02:34.83 Target Size: 2420
}
```

## Run examples
Get video information:
```
npm run info
```

Convert and save file to local folder:
```
npm run app
```

Convert and server bytes stream to client side:
```
npm run server
```

# License
MIT
