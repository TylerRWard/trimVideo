const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment');
const UploadingFiles = require('./UploadingFiles');
const fileConvert = require('./fileConvert');
const path = require('path');

async function trim(pitchTime, vidname, startTime) {
  try {
    let seconds = moment(pitchTime).diff(moment(startTime), 'seconds');
    console.log(`LOOK PITCH TIME: , ${moment(pitchTime).format('YYYY-MM-DD HH:mm:ss')}`);
    console.log("LOOK START TIME: ", startTime);
    console.log("seconds", seconds);

    var tempName = `${moment.utc(pitchTime).format('ddd-MMM-DD-YYYY-hhmmss-A')}${path.basename(vidname)}`;

    await new Promise((resolve, reject) => {
      ffmpeg(vidname)
        .setStartTime(seconds-4)
        .setDuration(8)
        .outputOptions('-c copy')
        .output(tempName)
        .on('end', async function () {
          console.log("Trim completed");
          try {
            if (tempName.toLowerCase().includes('mts')) {
              let outputFile = await fileConvert(tempName, pitchTime);
            } else {
              //console.log(tempName);
              await UploadingFiles(pitchTime, tempName);
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', function (err, stdout, stderr) {
          console.log('Error occurred: ' + err.message);
          console.log('ffmpeg standard output:\n' + stdout);
          console.log('ffmpeg standard error:\n' + stderr);
          reject(err);
        })
        .run();
    });

    console.log("trimPitch.js is done");
  } catch (error) {
    console.error("Error in trim function:", error);
  }
}

module.exports = trim;
