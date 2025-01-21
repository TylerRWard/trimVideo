const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ffprobe = util.promisify(require('fluent-ffmpeg').ffprobe);

async function creationTime(vidname) {
  if (vidname.toLowerCase().includes('mp4'))
  {
    try {
      const { stdout } = await exec(`ffprobe -v quiet -select_streams v:0 -show_entries stream_tags=creation_time -of default=noprint_wrappers=1:nokey=1 ${vidname}`);
      const creationTime = moment(stdout.trim(),'YYYY-MM-DD HH:mm:ss');
      return creationTime.format('YYYY-MM-DD HH:mm:ss');
    } catch (err) {
      console.error(err);
      return err;
    }
  }
  else
{
  console.log("MP4 not found");
  const stats = fs.statSync(vidname);
  const creationTime = moment(stats.birthtime).utcOffset('+00:00');
  console.log(`The creation time of ${vidname} is ${creationTime.format('YYYY-MM-DD HH:mm:ss')}.`);
  return creationTime.format('YYYY-MM-DD HH:mm:ss');
}

  }
  
  async function duration(vidname) {
      try {
        const metadata = await ffprobe(vidname);
        const duration = metadata.format.duration;
        const length = moment.duration(duration, 'seconds');
        console.log("The duration is: " ,length.asSeconds());
        return length.asSeconds();
      } catch (err) {
        console.error(err);
        return;
      }
    }
   
  
  async function endTime(vidname) {
    try {
      const startTime = await creationTime(vidname);
      const length = await duration(vidname);
      console.log("The start time is" ,startTime);
      const creationMoment = moment(startTime, 'YYYY-MM-DD HH:mm:ss');
      const endTime = creationMoment.add(length, 'seconds');
      console.log(creationMoment);
      console.log("end time: " + endTime.format('YYYY-MM-DD HH:mm:ss'));
      return endTime.format('YYYY-MM-DD HH:mm:ss');
    } catch (err) {
      console.error(err);
      return;
    }
  }



  module.exports = {duration, endTime, creationTime};


