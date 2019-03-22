const fs = require('fs');
const moment = require('moment');
const uuid = require('uuid/v1');

const months = require(`${process.cwd()}/months.json`);
// January 3, 4 - Quadrantids Meteor Shower. The Quadrantids is an above average shower, with up to 40 meteors per hour at its peak. It is thought to be produced by dust grains left behind by an extinct comet known as 2003 EH1, which was discovered in 2003. The shower runs annually from January 1-5. It peaks this year on the night of the 3rd and morning of the 4th. The moon will be a thin crescent and should not interfere with what could be a good show this year. Best viewing will be from a dark location after midnight. Meteors will radiate from the constellation Bootes, but can appear anywhere in the sky.
// console.log(fs.readdirSync(`${process.cwd()}/DataSource/Celestial/`));
const events = celestialToJSON(`${process.cwd()}/DataSource/Celestial/Celestial2021.txt`, 2021);

const outputFile = './result.ics';
const header = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//ddaysoftware.com//NONSGML DDay.iCal 1.0//EN'
];
const footer = 'END:VCALENDAR';
const instanceHeader = 'BEGIN:VEVENT';
const instanceFooter = 'END:VEVENT';
const dtParseString = 'DDMMYYYYHH:mm';

writeResults(events, outputFile);

function getDateString(eventDate) {
  let dtmStart = moment(eventDate, dtParseString);
  let dtmStamp = moment(eventDate, dtParseString);
  let dtmEnd = moment(eventDate, dtParseString).add(2, 'h');
  const dtmStartString = 'DTSTART:' + dtmStart.format('YYYYMMDDTHHmmss');
  const dtmEventString = 'DTSTAMP:' + dtmStamp.format('YYYYMMDDTHHmmss');
  const dtmEndString = 'DTEND:' + dtmEnd.format('YYYYMMDDTHHmmss');
  if (dtmStart.format('YYYYMMDDTHHmmss') === 'Invalid date')
    console.error('error with given date: ', eventDate);
  return [dtmStartString, dtmEventString, dtmEndString];
}

/*
  BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//ddaysoftware.com//NONSGML DDay.iCal 1.0//EN
  BEGIN:VEVENT
    DTSTART:20180930T183000
    DTSTAMP:20180930T183000
    DTEND:20180930T213000
    UID:4cf0e3b0-a7d8-11e8-adf2-afa8cc4faa8b
    DESCRIPTION: Charleroi Red Roosters vs Mighty Penguins
    SUMMARY: Charleroi Red Roosters vs Mighty Penguins
    LOCATION: Charleroi
  END:VEVENT
  END:VCALENDAR
*/

function writeResults(events, outputFile) {
  const resultData = header;
  events.forEach((event) => {
    resultData.push(instanceHeader);
    if (!event.dt)
      console.error('dt undefined', event);
    if (event.wholeDay) {
      resultData.push(['DTSTAMP:', event.dt, 'T000000Z'].join(''));
      resultData.push(['DTSTART;VALUE=DATE:', event.dt].join(''));
      resultData.push(['DESCRIPTION:', event.description].join(''));
      resultData.push(['SUMMARY:', event.summary].join(''));
      resultData.push(['UID:', uuid()].join(''));
    } else {
      const description = event.visitor + ' @ ' + event.home;
      resultData.push(...getDateString(event.dt));
      resultData.push(['LOCATION:', event.rink].join(''));
      resultData.push(['DESCRIPTION:', description].join(''))
      resultData.push(['SUMMARY:', description].join(''))
      resultData.push(['UID:', uuid()].join(''))
    }
    resultData.push(instanceFooter);
  });
  resultData.push(footer);
  fs.writeFileSync(outputFile, resultData.join('\r\n'), 'utf8');
}



function celestialToJSON(filePath, year) {
  const celestialEvents = [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(l => l.length > 0);
  lines.forEach(line => {
    const dateExtract = line.split('-')[0];
    const eventMonth = dateExtract.split(' ')[0];
    const monthNumber = months.filter(d => d.text === eventMonth)[0].number;
    // const formattedMonth = (monthNumber.length === 1)? '0' + monthNumber : monthNumber;
    const daysExtract = dateExtract.split(' ').splice(1, dateExtract.split(' ').length - 1).filter(item => item.length > 0);
    // console.log(daysExtract);
    // const days = (daysExtract.includes(',') ? daysExtract.split(',') : daysExtract.includes('&') ? daysExtract.split('&') : daysExtract);
    const days = (daysExtract[0].includes(',') ? daysExtract[0].split(',') : daysExtract[0].includes('&') ? daysExtract[0].split('&') : daysExtract[0]);
    const formattedDay = (days[0].length === 1) ? '0' + days[0] : days[0];
    const title = line.split('-')[1].split('.')[0];
    const description = line.split('-')[1];
    if (eventMonth.length > 0)
      celestialEvents.push({
        dt: `${year}${monthNumber}${formattedDay}`,
        dtObj: new Date(
          2021,
          monthNumber,
          Number(days[0])),
        dtEnd: new Date(
          2021,
          monthNumber,
          Number(days[days.length - 1]) + 1),
        summary: title,
        description: description,
        wholeDay: true
      });
  });
  // console.log('celestialEvents', JSON.stringify(celestialEvents, null, 2));
  return celestialEvents;
}