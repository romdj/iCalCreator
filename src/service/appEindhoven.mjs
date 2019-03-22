import fs from 'fs';
import moment from 'moment';
import uuid from 'uuid/v1';
import _ from 'lodash';

import src from './sourceEindhoven.json';
const teamName = 'Eindhoven Kemphanen';
const destLeagueCalendar = './resultLeagueCalendar.ics';
const destTeamCalendar = './result' + teamName + 'Calendar.ics';
const header = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//ddaysoftware.com//NONSGML DDay.iCal 1.0//EN'
];
const footer = 'END:VCALENDAR';
const instanceHeader = 'BEGIN:VEVENT';
const instanceFooter = 'END:VEVENT';
const dtParseString = 'DDMMYYYYHH:mm';
const leagueGames = formatDate(flattenCalendar(src));
const teamGames = leagueGames.filter(game => game.home === teamName || game.visitor === teamName);
// writeResults(leagueGames, destLeagueCalendar);
writeResults(teamGames, destTeamCalendar);

function flattenCalendar(days) {
  let gamesOutput = [];
  days.forEach((day) => {
    if (Array.isArray(day.games)) {
      day.games.forEach((game) => {
        game.date = day.date;
        gamesOutput.push(game);
      });
    } else {
      const game = {};
      Object.assign(game, day.games.game, { date: day.date })
      gamesOutput.push(game);
    }
  });
  return gamesOutput;
}

function formatDate(array) {
  let results = [];
  array.forEach((elt) => {
    const formatted = Object.assign({}, elt)
    const weekdays = [
      'maandag',
      'dinsdag',
      'woensdag',
      'donderdag',
      'vrijdag',
      'zaterdag',
      'zondag'
    ];
    const months = [
      ['januari', '01'],
      ['februari', '02'],
      ['maart', '03'],
      ['april', '04'],
      ['mei', '05'],
      ['juni', '06'],
      ['juli', '07'],
      ['augustus', '08'],
      ['september', '09'],
      ['oktober', '10'],
      ['november', '11'],
      ['december', '12']
    ]
    formatted.date = formatted.date.replace(/ /g,'');
    weekdays.forEach(day => formatted.date = formatted.date.replace(day, ''));
    months.forEach(month => formatted.date = formatted.date.replace(month[0], month[1]));
    if(formatted.date.length == 7)
      formatted.date = '0' + formatted.date;
    formatted.dt = formatted.date + formatted.time;
    results.push(formatted);
  });
  return results;
}

function getDateString(gameDate){
  let dtmStart = moment(gameDate, dtParseString);
  let dtmStamp = moment(gameDate, dtParseString);
  let dtmEnd = moment(gameDate, dtParseString).add(2, 'h');
  const dtmStartString = 'DTSTART:' + dtmStart.format('YYYYMMDDTHHmmss');
  const dtmEventString = 'DTSTAMP:' + dtmStamp.format('YYYYMMDDTHHmmss');
  const dtmEndString = 'DTEND:' + dtmEnd.format('YYYYMMDDTHHmmss');
  if(dtmStart.format('YYYYMMDDTHHmmss') === 'Invalid date')
    console.error('error with given date: ', gameDate);
  return [dtmStartString,dtmEventString, dtmEndString];
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

function writeResults(games, outputFile){
  const resultData = header;
  games.forEach((game) => {
    const description = game.visitor  + ' @ ' + game.home;
    resultData.push(instanceHeader);
    if(!game.dt)
      console.error('dt undefined', game);
    resultData.push(...getDateString(game.dt));
    resultData.push(['LOCATION:', game.rink].join(''));
    resultData.push(['DESCRIPTION:', description].join(''))
    resultData.push(['SUMMARY:', description].join(''))
    resultData.push(['UID:', uuid()].join(''))
    resultData.push(instanceFooter);
  });
  resultData.push(footer);
  fs.writeFileSync(outputFile, resultData.join('\r\n'), 'utf8');
}
