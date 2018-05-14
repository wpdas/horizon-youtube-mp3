'use strict';

var horizon = require('../lib/index');
var log = require('console-log-level')({ level: 'info' });

horizon.getInfo('http://youtube.com/watch?v=NEA0BLnpOtg', function(err, e){

  log.info(e);

  /**
     * It'll return:
     *
     * { isValid: true,
     *   videoName: 'OZIELZINHO - TOP GEAR 2.0',
     *   videoThumb: 'https://i.ytimg.com/vi/NEA0BLnpOtg/hqdefault.jpg?custom=true&w=320&h=180&stc=true&jpg444=true&jpgq=90&sp=68&sigh=FoGsoudXCGPU-Fb6epRh1eIzVDs',
     *   videoThumbList: [{url, width, height}, {...}...]
     *   videoTime: '2:35',
      *  videoFile: 'https://....'}
     */
});