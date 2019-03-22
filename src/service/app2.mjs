import moment from 'moment';
import fs from 'fs';
import uuid from 'uuid/v1';
const srcFile = './penguins_season_2018-2019.txt';
const outFile = './penguins_season_2018-2019_new.ics';
let allElements = fs.readFileSync(srcFile, 'utf8').split('\n');
let outData = [];
// const dateParseString = 'dddd DD MMMM YYYY HH:mm';
const dateParseString = 'DD MM YYYY HH:mm';
allElements.forEach(dt => {
  if (dt.includes('originalDate: ')) {
    dt = dt.replace('originalDate: ', '')
// originalDate: Sunday 30 September 2018 19:30

    let dtmStart = moment(dt, dateParseString).subtract(1, 'h');
    let dtmStamp = moment(dt, dateParseString).subtract(1, 'h');
    let dtmEnd = moment(dt, dateParseString).add(2, 'h');
    const dtmStartString = 'DTSTART:' + dtmStart.format('YYYYMMDDTHHmmss');
    const dtmEventString = 'DTSTAMP:' + dtmStamp.format('YYYYMMDDTHHmmss');
    const dtmEndString = 'DTEND:' + dtmEnd.format('YYYYMMDDTHHmmss');
    const uidString = 'UID:' + uuid();
    dt = [dtmStartString,dtmEventString, dtmEndString,uidString].join('\n');
  }
  outData.push(dt);
});
fs.writeFileSync(outFile,outData.join('\r\n'),'utf8');

