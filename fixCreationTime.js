
const moment = require('moment');
const ffmetadata = require("ffmetadata");
const fs = require('fs');


function setStartTime(originalVideoPath, newCreationTime) {
  originalVideoPath.toLowerCase().includes('mp4')
  const data = {creation_time: newCreationTime};

  ffmetadata.write(originalVideoPath, data, function(err) {
    if (err) console.error("Error writing metadata:", err);
    else console.log("Data written");
  });
}
const utimes = require('utimes');
function setmtsStartTime(filePath, newTimestamp){
  const birthtime = new Date(newTimestamp);

utimes.utimes(filePath, birthtime, birthtime, birthtime, (err) => {
  if (err) {
    console.error("Error updating timestamp:", err);
  } else {
    console.log("Timestamp updated");
  }
});
}


//given the seconds into a video a pitch takes place, and the pitchDateString from the database return the new calculated start time of the video
//pitch date string is from rapsodo 
//seconds into video is first pitch in video

function fixCreationTime(secondsIntoVideo,pitchDateString,videoPath){
  const newCreationTime = moment.utc(pitchDateString, 'YYYY-MM-DD HH:mm:ss').subtract(secondsIntoVideo, 'seconds'); 
  if (videoPath.toLowerCase().includes('mp4'))
  {
    console.log("CONTAINS MP4")
    setStartTime(videoPath,newCreationTime.toISOString());
  }
  else{
    console.log("NO MP4")
    setmtsStartTime(videoPath, newCreationTime);
  }

}

module.exports = fixCreationTime;



//TESTING OF FUNCTION

var secondsIntoVideo = 306;
var pitchDateString = '2023-10-25 15:46:23';
var videoPath = './00002.MTS';

fixCreationTime(secondsIntoVideo,pitchDateString,videoPath);


const ffmpeg = require('fluent-ffmpeg');

ffmpeg.ffprobe(videoPath, function(err, metadata) {
  if (err) {
    console.error("An error occurred: " + err.message);
  } 
  if (videoPath.toLowerCase().includes('mp4'))
  {
    
    console.log("Creation Time: " + metadata.format.tags.creation_time);
  }
  else
  {
    console.log("MP4 not found");
    fs.stat(videoPath, (err, stats)=> {
      if (err){
        console.error(err);
        return;
      }
      console.log(stats);
      
      const creationTime = moment(stats.birthtime).utcOffset('+00:00');
      console.log("Creaetion time: ",creationTime);
      console.log(`The creation time of ${videoPath} is ${creationTime}.`);
      //creationTime = moment(stats.birthtimeMs.trim(),'YYYY-MM-DD HH:mm:ss');
      return creationTime.format('YYYY-MM-DD HH:mm:ss');
    }
)}
});


