//require('dotenv').config(); // temp
const google = require('googleapis');
const fs = require('fs');
const {promisify} = require('util');


/*
const keysEnvVar = process.env['CREDS'];
if (!keysEnvVar) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(keysEnvVar);
*/

async function main() {
  // load the JWT or UserRefreshClient from the keys
  //const client = google.auth.fromJSON(keys);
  const client = await google.auth.fromStream(fs.createReadStream('./tc39-bot-e1f30a2c4bcb.json'));
  client.scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
  await client.authorize();

  const sheets = google.sheets({ version: 'v4', auth: client });

  const values = await promisify(sheets.spreadsheets.values.batchGet)({
    spreadsheetId: '', // FIXME: Spreadsheet ID here
    ranges: ['A1:A','C1:C']
  });
  console.log(JSON.stringify(values.data));
}

main().catch(console.error);

