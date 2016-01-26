'use strict';
const fs = require('fs');

function getStats(i) {
    let stats = {};
    let players = require(`./data/server${i}.json`);

    // For all players in the server
    for(let i = 0, l = players.length - 1; i < l; i++) {
        // Instantiate current player statistic structure
        let playtime = 0;
        let intervals = {};

        let name = players[i].key;

        stats[name] = {
            playtime : 0,
            actions : {}
        };

        // For all statistics for a single player
        let statCount = players[i].values.length - 1;
        for(let j = 0; j < statCount; j++) {
            let action = players[i].values[j].key;
            let meta = players[i].values[j].meta;
            let count = +players[i].values[j].count;

            // Action has not been initialized, so simply insert new action
            if (!stats[name].actions[action]) {
                stats[name].actions[action] = {
                    [meta] : count
                };
            } 

            // Action has already been inserted, now check the meta
            else {
                // The meta already exists so increment the existing count
                if (stats[name].actions[action][meta]) {
                    stats[name].actions[action][meta] += count;
                } else {
                    // The meta doesn't already exist, so append
                    stats[name].actions[action][meta] = count;
                }
            }

            let start_t = players[i].values[j].start_t;
            let stop_t = players[i].values[j].stop_t;

            if(intervals[start_t] === undefined || intervals[start_t] < stop_t) {
                intervals[start_t] = stop_t;
            }
        }

        for(let time in intervals) {
            playtime += intervals[time] - time;
        }
        stats[name].playtime = playtime;
    }

    let roster = Object.keys(stats).sort((a, b) => -(stats[a].playtime - stats[b].playtime)); 
    let newstats = {};
    for(let i = 0; i < roster.length-1; i++) {
        newstats[roster[i]] = stats[roster[i]];
    }
    fs.writeFile(`./data/server${i}players.json`, JSON.stringify(newstats, null, 2));
}

for(let server = 1; server <= 14; server++) {
    console.log(`Getting server ${server} stats`);
    getStats(server);
}
console.log("Done :^)");

// Player statistic file structure example:
// {
//   "ef2d294c547763a3e149c73161a78de2190672ff": {
//     "playtime": 0,
//     "actions": {
//       "BlockBreak": {
//         "GLASS": 1,
//         "GLOWSTONE": 2,
//         "OTHER": 10,
//         "SMOOTH_BRICK": 16,
//         "IRON_BLOCK": 2
//       },
//       "BlockPlace": {
//         "GLASS": 1,
//         "OTHER": 9,
//         "SMOOTH_BRICK": 24
//       },
//       "Logins": {
//         "America/Los_Angeles": 4
//       },
//       "Kicks": {
//         "": 1
//       }
//     }
//   }
// }