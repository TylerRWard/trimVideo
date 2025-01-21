const AWS = require('aws-sdk');
const fs = require('fs');
const moment = require('moment');
//video name based off time and or raposodo serial number

vidlen = 8
//trims video
function UploadingFiles(pitchTime, outputFile){
  const AWS = require('aws-sdk');
  const fs = require('fs');
  const s3 = new AWS.S3();
  const bucketName = `trimmed-pitches/${moment(pitchTime).format('ddd-MMM-DD-YYYY-hhmmss-A')}.mp4`;
  //const fileName = 'C:/Users/Aaron/OneDrive/Documents/GitHub/Nodeenvironment/test1.txt';
  //filename is the file that will be uploaded 
  const fileName = `${outputFile}`;
  const fileData = fs.readFileSync(fileName);
    return new Promise((resolve, reject)=>{
        s3.upload({
            Bucket: bucketName,
            Key: fileName,
            Body: fileData
        }, (err, data) => {
        if (err) {
            console.error(err);
            reject(err);
        } else {
                console.log(`File uploaded successfully. ${data.Location}`);
                // Delete the file after upload
                fs.unlink(fileName, function (err)
                {
                    if (err) throw err;
                    console.log('File deleted!');
                });
                resolve(data);
            }
        });

    });
}

module.exports = UploadingFiles;