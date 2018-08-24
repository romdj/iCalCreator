import fs from 'fs';
import moment from 'moment';
import uuid from 'uuid/v1';
import _ from 'lodash';

import src from './src.json'; 
const destFile = './result.ics';

let resultData = [];
const header = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//ddaysoftware.com//NONSGML DDay.iCal 1.0//EN'
];
const footer = 'END:VCALENDAR';
const instanceHeader = 'BEGIN:VEVENT';
const instanceFooter = 'END:VEVENT';

resultData = header;
src.forEach(event => {
  resultData.push(instanceHeader);
  for(const key in event){
    resultData.push([key, ':', event[key]].join(''));
  }
  resultData.push(['UID:',uuid()].join(''))
  resultData.push(instanceFooter);
});
resultData.push(footer);
fs.writeFileSync(destFile,resultData.join('\r\n'),'utf8');
