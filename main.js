/**
 * @author Tyler Ward
 * @version 12/1/23
 */

const {endTime, creationTime} = require('./ffprobeStuff')
const queryPitchesDuring = require('./queryPitchesDuring')
const trim = require('./trimPitch');
vidname = 'videoName';//video name here
//const fixCreationTime = require('./fixCreationTime')

async function main(){
    /**
     * gets video creation time, end Time, and sends a quesry to rapsoto to get pitches during that time
     */
    let startTime = await creationTime(vidname);
    let videndTime = await endTime(vidname);
    const ran = await queryPitchesDuring(startTime, videndTime);
    let myList = [];
    ran.forEach(function(item) {
        console.log(item.pitchtime_in_central);
        
        myList.push(item.pitchtime_in_central)
        //pitchTime = item.pitchtime_in_central;
        //vidsToTrim++;
        console.log("trims: " , myList.length);

    //return myList;
    });
    /*  
        for(let i = 0; i < myList.length; i++) {
            console.log(myList[i]);
        }
        */
    var currentIndex = 0;

    async function processNextVideo(){
        let currentIndex = 0;
        await myList.reduce(async (previousPromise, currentItem) => {
            await previousPromise;
            console.log("trim# ", ++currentIndex);
            await trim(new Date(currentItem), vidname, startTime);
            console.log("Upload completed");
        }, Promise.resolve());
        console.log("All Done!! :)")
    };


    processNextVideo();

}



main();
