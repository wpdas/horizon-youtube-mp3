/**
 * Created by wendersonpires on 27/11/16.
 */

var horizon = require('../lib/index');
var path = require('path');

var downloadPath = path.join(__dirname);
var fileName = "mySound.mp3"; //Optional. The file automatically have the video name.


horizon.download("http://youtube.com/watch?v=NEA0BLnpOtg", null, fileName, function(e){

    console.log(e); //Will return: "Downloading file complete!"

    //Your code here...
});