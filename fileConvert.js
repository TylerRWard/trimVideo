const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises;
const path = require('path');
const UploadingFiles = require('./UploadingFiles');
async function fileConvert(vidName, pitchTime) {
  const inputDir = './'; // directory with MTS files
  const outputDir = './'; // directory to save MP4 files

  try {
    const ext = path.extname(vidName).toLowerCase();
    if (ext === '.mts') {
      const inputFile = path.join(inputDir, vidName);
      const outputFile = path.join(outputDir, `${path.basename(vidName, ext)}.mp4`);

      await new Promise((resolve, reject) => {
        ffmpeg(inputFile)
          .output(outputFile)
          .on('end', async () => {
            console.log(`Finished processing ${vidName}`);
            await UploadingFiles(pitchTime, outputFile);
            try {
              await fs.unlink(inputFile);
              console.log(`Deleted original file ${vidName}`);
            } catch (err) {
              console.error(`Failed to delete ${vidName}: ${err}`);
            }
            resolve();
          })
          .on('error', (err) => {
            console.error(`An error occurred processing ${vidName}: ${err.message}`);
            reject(err);
          })
          .run();
      });
    }
  } catch (err) {
    console.error("Could not process the file.", err);
  }
}

module.exports = fileConvert;
