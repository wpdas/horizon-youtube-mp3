# horizon-youtube-mp3

Get info and download MP3 audio from youtube videos in node.js using horizon-youtube-mp3.

I developed this module to simplify how you convert a video directly to mp3. It was developed for a project called Horizon Mp3 Converter which will be available soon for online use.

## Main features

- Convert video from youtube in mp3 files (128 kBit/s) in realtime.
- Auto delete files from server after Download
- When used to download on server, it supports downloading the same audio without overwriting another (if 2 or more people are downloading the same audio).
- FFmpeg installed is necessary!

With [npm](https://www.npmjs.com/) do:

```
npm install horizon-youtube-mp3
```

## Usage
### Get info from video.

``` js
var horizon = require('horizon-youtube-mp3');

horizon.getInfo("http://youtube.com/watch?v=NEA0BLnpOtg", function(e){

    console.log(e);

    /**
     * Will Return:
     *
     * { isValid: true,
     *   videoName: 'OZIELZINHO - TOP GEAR 2.0',
     *   videoThumb: 'https://i.ytimg.com/vi/NEA0BLnpOtg/hqdefault.jpg?custom=true&w=320&h=180&stc=true&jpg444=true&jpgq=90&sp=68&sigh=FoGsoudXCGPU-Fb6epRh1eIzVDs',
     *   videoTime: '2:35',
      *  videoFile: 'https://....'}
     */
});
```


### Simple mp3 file download

``` js
var horizon = require('horizon-youtube-mp3');
var path = require('path');

var downloadPath = path.join(__dirname);
var fileName = "mySound.mp3"; //Optional. The file automatically have the video name.


horizon.download("http://youtube.com/watch?v=NEA0BLnpOtg", downloadPath, null, fileName, function(e){

    console.log(e); //Will return: "Downloading file complete!"

    //Your code here...
});
```

### Use for server-side processing and client-side downloading

``` js
var horizon = require('horizon-youtube-mp3');
var path = require('path');
var http = require("http");
var url  = require('url') ;

var downloadPath = path.join(__dirname); //Path in your server to alocate temporaly file

var server = http.createServer(function(request, response) {

    var paramsUrl = url.parse(request.url, true).query;
    console.log("URL Video: " + paramsUrl.youtubeURL);


    horizon.download(paramsUrl.youtubeURL, downloadPath, response, null, function(e){

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
