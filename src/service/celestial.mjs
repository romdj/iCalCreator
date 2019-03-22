import fs from 'fs';
import moment from 'moment';
import uuid from 'uuid/v1';

// January 3, 4 - Quadrantids Meteor Shower. The Quadrantids is an above average shower, with up to 40 meteors per hour at its peak. It is thought to be produced by dust grains left behind by an extinct comet known as 2003 EH1, which was discovered in 2003. The shower runs annually from January 1-5. It peaks this year on the night of the 3rd and morning of the 4th. The moon will be a thin crescent and should not interfere with what could be a good show this year. Best viewing will be from a dark location after midnight. Meteors will radiate from the constellation Bootes, but can appear anywhere in the sky.

const events = celestialToJSON('../../DataSource/Celestial/Celestial2019.txt');

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
      resultData.push(['DTSTART;VALUE=DATE:', Date.UTC(event.dt)]);
      resultData.push(['DESCRIPTION:', event.description].join(''));
      resultData.push(['SUMMARY:', event.title].join(''));
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

const months = [
    {
    number: 0,
    text: 'January'
    },
    {
      number: 1,
      text: 'February'
    },
    {
      number: 2,
      text: 'March'
    },
    {
      number: 3,
      text: 'April'
    },
    {
      number: 4,
      text: 'May'
    },
    {
      number: 5,
      text: 'June'
    },
    {
      number: 6,
      text: 'July'
    },
    {
      number: 7,
      text: 'August'
    },
    {
      number: 8,
      text: 'September'
    },
    {
      number: 9,
      text: 'October'
    },
    {
      number: 10,
      text: 'November'
    },
    {
      number: 11,
      text: 'December'
}]

function celestialToJSON(filePath) {
  const celestialEvents = [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  lines.forEach(line => {
    const dateExtract = line.split('-')[0];
    const eventMonth = dateExtract.split(' ')[0];
    const daysExtract = dateExtract.split(' ').splice(1, dateExtract.split(' ').length - 1).filter(item => item.length > 0);
    // daysExtract.forEach(item => item.replace(',', '').replace('&','').trim);

    console.log(daysExtract);
    console.log(eventMonth);
    const days = (daysExtract.includes(',') ? daysExtract.split(',') : daysExtract.includes('&') ? daysExtract.split('&') : daysExtract);
    console.log(line.split('-')[1]);
    const title = line.split('-')[1];
    const description = line.split('-')[1];

    if (typeof days === 'string') {
      date.forEach(dateInstance => {
        celestialEvents.push({
          dt: new Date(
            2019,
            months.filter(d => d.text === eventMonth),
            Number(days)),
          // dtEnd: new Date(
          //   2019,
          //   months.filter(d => d.text === eventMonth),
          //   Number (days) + 1),
          summary: title,
          description: description,
          wholeDay: true
        });
      });
    console.log(celestialEvents);
    }
  });
  return celestialEvents;
}