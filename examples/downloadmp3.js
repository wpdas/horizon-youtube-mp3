'use strict';

var horizon = require('../lib/index'); //use 'horizon-youtube-mp3'
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