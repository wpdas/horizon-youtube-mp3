# horizon-youtube-mp3

Get info and download MP3 audio from youtube videos in node.js using horizon-youtube-mp3.

I developed this module to simplify how you convert a video directly to mp3. It was developed for a project called Horizon Mp3 Converter which will be available soon for online use.

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
- Crop time (start and end time);
- When used to download on server, it supports downloading the same audio without overwriting another (if 2 or more people are downloading the same audio).

With [npm](https://www.npmjs.com/) do:

```
npm install horizon-youtube-mp3
```

## API

**getInfo(url:String, callback:Function):Object** => Get information from video.
``` js
horizon.getInfo("http://youtube.com/watch?v=NEA0BLnpOtg", function(err, data){...});
```

**download(url:String, res?:Response, name?:String, cropParams?:Object, callback:Function):Object** => Download a converted MP3 file.
``` js
horizon.download("http://youtube.com/watch?v=NEA0BLnpOtg", response, null, {start:'02:15', end:'02:20'}, function(err, result){//On Conversion Complete});
```

## Usage Example
### Get info from video.

``` js
var horizon = require('horizon-youtube-mp3');

horizon.getInfo("http://youtube.com/watch?v=NEA0BLnpOtg", function(err, e){

    console.log(e);

    /**
     * Will Return:
     *
     * { isValid: true,
     *   videoName: 'OZIELZINHO - TOP GEAR 2.0',
     *   videoThumb: 'https://i.ytimg.com/vi/NEA0BLnpOtg/hqdefault.jpg?custom=true&w=320&h=180&stc=true&jpg444=true&jpgq=90&sp=68&sigh=FoGsoudXCGPU-Fb6epRh1eIzVDs',
     *   videoTime: '2:35',
     *   videoTimeSec: 155,
     *   videoFile: 'https://....'}
     */
});
```

### Use for server-side processing and client-side downloading

``` js
var horizon = require('horizon-youtube-mp3');
var path = require('path');
var http = require("http");
var url  = require('url') ;

var server = http.createServer(function(request, response) {

    let paramsUrl = url.parse(request.url, true).query;
    console.log("URL Video: " + paramsUrl.youtubeURL);

    let cropParams = {start:'02:15', end:'02:20'}; //Optional

    horizon.download(paramsUrl.youtubeURL, response, null, cropParams, function(err, e){

        console.log(e); //Will return: "Downloading file complete!"

        //Your code here...
    });
});

server.listen(3000);
console.log("Server running!");
console.log("Put on browser: http://localhost:3000/?youtubeURL=http://youtube.com/watch?v=NEA0BLnpOtg");
```

# License
MIT
