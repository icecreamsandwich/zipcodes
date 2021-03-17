#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    zips = {},
    str,
    data = fs.readFileSync('./india_pcodes.csv', 'utf8').replace(/\r/g, '').split('\n');
    geonamesData = fs.readFileSync('./IN.txt', 'utf8').split('\n');

//data.shift(); // remove first element

var clean = function(str) {
    return str.replace(/"/g, '').trimLeft();
}

var ucfirst = function(str) {
    str = str.toLowerCase();
    var lines = str.split(' ');
    lines.forEach(function(s, i) {
        var firstChar = s.charAt(0),
            upperFirstChar = firstChar.toUpperCase();

        lines[i] = upperFirstChar + s.substring(1);

    });
    return lines.join(' ');
};

geonamesLookupData = {};
// replace lat long India zip Codes 
geonamesData.forEach(function(line, num) {
    var dt = line.split('\t');
    if (dt.length == 12) {
        geonamesLookupData[clean(dt[1])] = {
            latitude: dt[9],
            longitude: dt[10]
        };
    }
});

data.forEach(function(line, num) {
    line = line.split(',');
    if (line.length > 1) {
        var o = {};
        o.region = clean(line[0])
        o.zip = clean(line[1]);
        if (geonamesLookupData[o.zip] !== undefined) {
            o.latitude = Number(clean(geonamesLookupData[o.zip].latitude));
            o.longitude = Number(clean(geonamesLookupData[o.zip].longitude));
        } else {
            o.latitude = Number(clean(line[13]));
            o.longitude = Number(clean(line[14]));
        }
        o.city = ucfirst(clean(line[8]));
        o.state = clean(line[9]);
        o.country = 'India';
        if (!zips[o.zip]) {
            zips[o.zip] = o;
        }
    }
});

//this is like an option B- read from geonames.csv
/* geonamesData.forEach(function(line, num) {
    var dt = line.split('\t');
    if (dt.length == 12) {
        var zip = clean(dt[1]);
        if (!zips[zip] && dt[4]) {
            zips[zip] = {
                zip: zip,
                latitude: Number(clean(dt[9])),
                longitude: Number(clean(dt[10])),
                city: ucfirst(clean(dt[2])),
                state: clean(dt[4]),
                country: 'India'
            };
        }
    }
}); */


var stateMap = {};

for (var i in zips) {
    var item = zips[i];
    stateMap[item.state] = stateMap[item.state] || [];

    stateMap[item.state].push(item.zip);
}

str = 'exports.codes = ' + JSON.stringify(zips) + ';\n';
str += 'exports.stateMap = ' + JSON.stringify(stateMap) + ';\n';

fs.writeFileSync(path.join('../', 'lib', 'codesIndia.js'), str, 'utf8');
