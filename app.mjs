import moment from 'moment';
import fs from 'fs';
import uuid from 'uuid/v1';
const srcFile = './turtles_Season_2018-2019.ics';
const outFile = './turtles_Season_2018-2019_OUT.ics';
let allElements = fs.readFileSync(srcFile, 'utf8').split('\n');
let outData = [];
allElements.forEach(dt => {
  if (dt.includes('DTSTART:')) {
    dt = dt.replace('DTSTART:', '')
    let dtmStart = moment(dt, 'YYYYMMDDTHHmmss').subtract(1, 'h');
    let dtmEnd = moment(dt, 'YYYYMMDDTHHmmss').add(2, 'h');
    const dtmStartString = 'DTSTART:' + dtmStart.format('YYYYMMDDTHHmmss');
    const dtmEventString = 'DTSTAMP:' + dt;
    const dtmEndString = 'DTEND:' + dtmEnd.format('YYYYMMDDTHHmmss');
    const uidString = 'UID:' + uuid();
    dt = [dtmStartString,dtmEventString, dtmEndString,uidString].join('\n');
  }
  outData.push(dt);
});
fs.writeFileSync(outFile,outData.join('\r\n'),'utf8');

