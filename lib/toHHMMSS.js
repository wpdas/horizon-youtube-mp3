/**
 * Created by wendersonpires on 27/11/16.
 */

'use strict';

/**
 * Return HH:MM:SS String from seconds
 * @param sec_num   Seconds
 * @returns {string}    HH:MM:SS String
 */
function secondsToHHMMSS(sec_num) {
  var d = Number(sec_num);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s);
}

module.exports = secondsToHHMMSS;