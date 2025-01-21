const fs = require('fs');
const { exec } = require('child_process');

vidname = 'MAH00101.MP4'
//formatt date
var date = new Date("Thu Oct 05 2023 7:27:11 PM"); // put vid time here
var options = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    hour12: true 
};

var formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
console.log(formattedDate);

// Get file metadata
function setDate(vidname){
    fs.stat('./'+vidname, (err, stats) => {
        if (err) throw err;
        console.log(`File Data Last Modified: ${stats.mtime}`);
        console.log(`File Status Last Modified: ${stats.ctime}`);
    });
    atime = (date);fds
    mtime= (5);

    // Change file metadata
    fs.utimes('./'+vidname, atime, mtime, (err) => {
        if (err) throw err;
    });
}
//setDate(vidname);



const path = require('path');

async function changeCreationTime(vidname, newCreationTime) {
    try {
        // Check if the file exists
        if (!fs.existsSync(vidname)) {
            console.error('File does not exist:', vidname);
            return;
        }

        // Create a temporary copy of the original file
        const tempFile = path.join(path.dirname(vidname), 'temp_' + path.basename(vidname));
        fs.copyFileSync(vidname, tempFile);

        // Change the creation time metadata of the copy
        const { stdout, stderr } = await exec(`ffmpeg -i ${tempFile} -metadata creation_time="${newCreationTime}" -codec copy ${vidname}`);

        // Delete the temporary file
        fs.unlinkSync(tempFile);

        console.log('Creation time changed successfully');



    } catch (err) {
        console.error(err);
    }
}

changeCreationTime(vidname, formattedDate);
