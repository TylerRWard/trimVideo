const { Pool } = require('pg');
const db = new Pool({//this is temporary hardcoded to be run outside of the express server change this when adding to server
  host: 'databaseName',
  port: portNum,
  database: 'databaseName',
  user: 'user',
  password: 'password',
  ssl:{
    rejectUnauthorized: false
  }
});

const moment = require('moment');

async function queryPitchesDuring(startTime, endTime) {
  const client = await db.connect();
  try {
    const startTimeStr = moment(startTime).format('ddd MMM DD YYYY hh:mm:ss A');
    const endTimeStr = moment(endTime).format('ddd MMM DD YYYY hh:mm:ss A');

    const result = await client.query("SELECT pitchtime_in_central FROM rapsodo_pitch_t WHERE TO_TIMESTAMP(pitchtime_in_central, 'Dy Mon DD YYYY HH12:MI:SS PM') >= TO_TIMESTAMP($1, 'Dy Mon DD YYYY HH12:MI:SS PM') and TO_TIMESTAMP(pitchtime_in_central, 'Dy Mon DD YYYY HH12:MI:SS PM') <= TO_TIMESTAMP($2, 'Dy Mon DD YYYY HH12:MI:SS PM')", [startTimeStr, endTimeStr]);
    //console.log(result.rows);
    return result.rows;
    const rowCount = result.rows[0].count;

  } catch (err) {
    console.error(err.message);
  } finally {
    client.release();
  }
  
}
//console.log("row count: " +rowCount); cant find rowCount
module.exports = queryPitchesDuring;


 
/*
EXAMPLE USAGE BELOW
*/


/*
let startTime = new Date('Thu Sep 28 2023 9:00:00 PM');
let endTime = new Date('Fri Sep 28 2023 10:00:00 PM');

queryPitchesDuring(startTime, endTime)
.then(result => {
  console.log(result);
})
.catch(error => {
  console.error(error);
});
*/
