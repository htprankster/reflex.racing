class Maps {
    constructor(maps) {
        this.maps = maps;
    }

    count() {
        return this.maps.length;
    }

    getAll() {
        return this.maps.reverse();
    }

    getEntryById(id, property = false) {
        let i = 0;
        while(i < this.maps.length) {
            if(this.maps[i].id == id) {
                if(property) {
                    if(this.maps[i][property] || !isNaN(this.maps[i][property])) {
                        return this.maps[i][property];
                    }
                    else if(this.maps[i].custom[property] || !isNaN(this.maps[i].custom[property])) {
                        return this.maps[i].custom[property];
                    }
                    return false;
                }
                return this.maps[i];
            }

            i++;
        }
        return false;
    }

    getByPlayer(player) {
        let i = 0;
        let output = new Array();
        while(i < this.maps.length) {
            if(this.maps[i].creator === player) {
                output.push(this.maps[i]);
            }
            i++;
        }
        return output;
    }

    getTitleById(id, stripColor = false, charlimit = 0) {
        const objById = this.getEntryById(id);
        return filterExplicitContent(objById.title, objById.censored_title, stripColor, charlimit);
    }

    getPreviewUrl(id) {
        const output = this.getEntryById(id, 'preview_url');
        return (output ? output : this.maps[Math.floor(Math.random() * this.maps.length)].preview_url);
    }

    getLatest(limit, charLimit = 0) {
        let filteredMaps = this.maps.slice(Math.abs(limit)*-1).reverse();
        if(charLimit > 0) {
            let i = 0;
            while(i < filteredMaps.length) {
                if(filteredMaps[i].title.length > charLimit) {
                    filteredMaps[i].title = filteredMaps[i].title.slice(0, charLimit)+'&mldr;';
                    filteredMaps[i].censored_title = filteredMaps[i].censored_title.slice(0, charLimit)+'&mldr;';
                }

                i++;
            }
        }
        return filteredMaps;
    }
}

class Players {
    constructor(players) {
        this.players = players;
    }

    count() {
        return this.players.length;
    }

    getEntryById(id, property = false) {
        let i = 0;
        while(i < this.players.length) {
            if(this.players[i].id == id) {
                if(property) {
                    if(this.players[i][property] || !isNaN(this.players[i][property])) {
                        return this.players[i][property];
                    }
                    else if(this.players[i].custom[property] || !isNaN(this.players[i].custom[property])) {
                        return this.players[i].custom[property];
                    }
                    return false;
                }
                return this.players[i];
            }

            i++;
        }
        return false;
    }

    getNameById(id, stripColor = false, charlimit = 0) {
        const objById = this.getEntryById(id);
        return filterExplicitContent(objById.name, objById.censored_name, stripColor, charlimit);
    }

    getAll(sortGR = true) {
        if(sortGR) {
            let unsortedPlayers = new Array();
            let sortedPlayers = this.players.sort((a,b) => a.globalrank - b.globalrank);
            for(let i = 0; i < sortedPlayers.length; i++) {
                if(sortedPlayers[i].globalrank === 0) {
                    unsortedPlayers.push(sortedPlayers[i]);
                }
                else if(unsortedPlayers.length > 0) {
                    sortedPlayers.splice(0, unsortedPlayers.length);
                    return sortedPlayers.concat(unsortedPlayers);
                }
            }

            return sortedPlayers;
        }
        return this.players;
    }
}

class Records {
    constructor(records) {
        this.records = records;
    }

    count() {
        return this.records.length;
    }

    getByPlayer(player, wrs = false) {
        let playerRecords = new Array();
        for(let pi = 0; pi < this.records.length; pi++) {
            if(this.records[pi].player_id == player) {
                if(wrs && this.records[pi].rank !== '1') {
                    continue;
                }
                playerRecords.push(this.records[pi]);
            }
        }
        return playerRecords;
    }

    getByMap(map) {
        let mi = 0;
        let mapRecords = new Array();
        while(mi < this.records.length) {
            if(this.records[mi].map_id == map) {
                mapRecords.push(this.records[mi]);
            }

            mi++;
        }
        return mapRecords;
    }

    mostPlayedMaps() {
        let mp = 0, map = '';
        let allRecords = this.records.reverse();
        let popularMaps = new Array();
        while(mp < allRecords.length) {
            if(allRecords[mp].map_id !== map) {
                popularMaps.push({map_id: allRecords[mp].map_id, records: parseInt(allRecords[mp].rank)});
                map = allRecords[mp].map_id;
            }

            mp++;
        }
        return popularMaps.sort((a,b) => a.records - b.records).reverse();
    }
}

class Activity {
    constructor(activity) {
        this.activity = activity;
    }

    orderByDate(limit = 0) {
        this.activity.sort((a,b) => a.check_timestamp - b.check_timestamp).reverse();
        if(limit > 0) {
            return this.activity.slice(0, limit);
        }
        return this.activity;
    }

    getActivityByPlayer(player_id, limit = 0) {
        const activityByPlayer = this.activity.filter(item => item.player_id == player_id)
                                .sort((a,b) => a.check_timestamp - b.check_timestamp)
                                .reverse();
        if(limit > 0) {
            return activityByPlayer.slice(0, limit);
        }
        return activityByPlayer;
    }

    getActivityByMap(map_id, limit = 0) {
        const activityByMap = this.activity.filter(item => item.map_id == map_id)
                                .sort((a,b) => a.check_timestamp - b.check_timestamp)
                                .reverse();
        if(limit > 0) {
            return activityByMap.slice(0, limit);
        }
        return activityByMap;
    }

    getActivityByRecord(player_id, map_id) {
        const activityByRecord = this.activity.filter(item => item.player_id == player_id && item.map_id == map_id);
        if(activityByRecord.length > 0) {
            return activityByRecord[0];
        }
        return false;
    }
}

class Metadata {
    constructor(metadata) {
        this.metadata = metadata[0];
        this.colorClass = {
            info: 'color-status-info',
            warn: 'color-status-warn',
            crit: 'color-status-crit',
        };
    }

    getLeaderboardsStatus(format) {
        if(format) {
            let statusClass = '';
            let statusDescription = '';

            switch(this.metadata.status.leaderboards.toLowerCase()) {
                case 'active':
                    statusClass = this.colorClass.info;
                    statusDescription = 'No errors detected during scripts run.';
                    break;
                case 'shift':
                    statusClass = this.colorClass.warn;
                    statusDescription = 'The tracker has updated the leaderboards but the website was not able to reload the data. Try again later.';
                    break;
                case 'paused':
                    statusClass = this.colorClass.warn;
                    statusDescription = 'The tracker has been manually paused due to maintenance.\nIt is currently inactive and will not update the website leaderboards until resumed.';
                    break;
                case 'stall':
                    statusClass = this.colorClass.crit;
                    statusDescription = 'The tracker is currently stalled.';
                    break;
                default:
                    this.metadata.status.leaderboards = 'Unknown';
                    statusClass = this.colorClass.crit;
                    statusDescription = 'No data available.';
            }

            this.metadata.status.leaderboards = this.metadata.status.leaderboards.charAt(0).toUpperCase()+this.metadata.status.leaderboards.slice(1);
            return '<span title="'+statusDescription+'" class="'+statusClass+'">'+this.metadata.status.leaderboards+'</span>';
        }
        return this.metadata.status;
    }

    getFeedStatus(format) {
        if(format) {
            let statusClass = '';
            let statusDescription = '';

            switch(this.metadata.status.rss.toLowerCase()) {
                case 'active':
                    statusClass = this.colorClass.info;
                    statusDescription = 'No errors detected during scripts run.';
                    break;
                case 'shift':
                    statusClass = this.colorClass.warn;
                    statusDescription = 'The tracker has updated the RSS feed but the website was not able to reload the data. Try again later.';
                    break;
                case 'paused':
                    statusClass = this.colorClass.warn;
                    statusDescription = 'The tracker has been manually paused due to maintenance. It is currently inactive and will not update the website feed until resumed.';
                    break;
                case 'stall':
                    statusClass = this.colorClass.crit;
                    statusDescription = 'The tracker is currently stalled.';
                    break;
                default:
                    this.metadata.status.rss = 'Unknown';
                    statusClass = this.colorClass.crit;
                    statusDescription = 'No data available.';
            }

            this.metadata.status.rss = this.metadata.status.rss.charAt(0).toUpperCase()+this.metadata.status.rss.slice(1);
            return '<span title="'+statusDescription+'" class="'+statusClass+'">'+this.metadata.status.rss+'</span>';
        }
        return this.metadata.status;
    }

    getLeaderboardsLastUpdate(format = 'full') {
        if(!isNaN(this.metadata.last_updated.leaderboards)) {
            return convertTime(this.metadata.last_updated.leaderboards, format);
        }
        return '<span class="'+this.colorClass.warn+'">Last update not available</span>';
    }

    getFeedLastUpdate(format = 'full') {
        if(!isNaN(this.metadata.last_updated.rss)) {
            return convertTime(this.metadata.last_updated.rss, format);
        }
        return '<span class="'+this.colorClass.warn+'">Last update not available</span>';
    }
}

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const idb = 'reflex-racing-htp';
const idbTable = 'datasets';
const idbIndex = 'data';
const idbKeyPath = 'name';
const idbKeyRSS = 'rss';
const idbKeyMaps = 'maps';
const idbKeyPlayers = 'players';
const idbKeyRecords = 'records';
const idbKeyActivity = 'activity';
const idbKeyMetadata = 'metadata';
const leaderboardsRecordLightClass = 'leaderboards-record-row-light';
const leaderboardsRecordDarkClass = 'leaderboards-record-row-dark';
const hideDomClass = 'hide-dom';
const lsiNSFW = 'reflex-racing-nsfw';

async function fetchDATA(url) {
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(10000),
            cache: "reload"
        });

        if (!response.ok) {
            return [];
        }

        const result = await response.json();
        return result;
    }
    catch(error) {
        console.error(error.message);
        return [];
    }
}

function getRelativePath(directoryLevels = 0) {
    let relativePath = (directoryLevels > 0 ? '' : './');
    for(let i = 0; i < directoryLevels; i++) {
        relativePath += '../';
    }
    return relativePath;
}

function getHrefMap(id = false, directoryLevels = 0) {
    return getRelativePath(directoryLevels)+'maps/'+(id ? '?k='+id : '');
}

function getHrefPlayer(id = false, directoryLevels = 0) {
    return getRelativePath(directoryLevels)+'players/'+(id ? '?k='+id : '');
}

function getMapPreview(preview_url) {
    return '<img src="'+preview_url+'"/>'
}

function getKeyLDB(windowLocation) {
    let getArgs = windowLocation.split('&');
    for(let i = 0; i < getArgs.length; i++) {
        let key = getArgs[i].split('=');
        if(key[0] === 'k') {
            if(!isNaN(key[1])) {
                return key[1];
            }
            break;
        }
    }
    return false;
}

function getMapType(id, toObj = true) {
    if(!id) { return false; }
    const typeList = [{ type: 'strafe', title: 'Strafe only', svg: SVG_TYPE_STRAFE },
                    { type: 'rocket', title: 'Rocket launcher', svg: SVG_TYPE_ROCKET },
                    { type: 'grenade', title: 'Grenade launcher', svg: SVG_TYPE_GRENADE },
                    { type: 'plasma', title: 'Plasma gun', svg: SVG_TYPE_PLASMA },
                    { type: 'stake', title: 'Stake gun', svg: SVG_TYPE_STAKE },
                    { type: 'tele', title: 'Teleports', svg: SVG_TYPE_TELE },
                    { type: 'jumppad', title: 'Jump pads', svg: SVG_TYPE_JUMPPAD },
                    { type: 'target', title: 'Targets', svg: SVG_TYPE_TARGET },
                    { type: 'turret', title: 'Sentry turrets', svg: SVG_TYPE_TURRET },
                    { type: 'lowgrav', title: 'Low gravity', svg: SVG_TYPE_LOWGRAV },
                    { type: 'surf', title: 'Surfing', svg: SVG_TYPE_SURF },
                    { type: 'team', title: 'Team race', svg: SVG_TYPE_TEAM },
                    { type: 'slick', title: 'Slick mod', svg: SVG_TYPE_SLICK },
                    { type: 'checkpoint', title: 'Checkpoints', svg: SVG_TYPE_CHECKPOINT },
                    { type: 'carnage', title: 'Carnage', svg: SVG_TYPE_CARNAGE },
                    { type: 'glitch', title: 'Glitch', svg: SVG_TYPE_GLITCH },
                    { type: 'unfinished', title: 'Unfinished', svg: SVG_TYPE_UNFINISHED }];

    const typeCode = id.toLowerCase();
    let output;
    for(let i = 0; i < typeList.length; i++) {
        if(typeList[i].type === typeCode) {
            output = typeList[i];
            break;
        }
    }

    if(output) {
        if(toObj) {
            return output;
        }
        return '<span class="map-type-icon-'+typeCode+'" title="'+output.title+'">'+output.svg+'</span>';
    }

    return false;
}

function getMapDifficulty(str, toObj = true, asLabel = true) {
    if(!str) { return false; }
    const difficultyCode = str.toLowerCase();
    const difficultyLevel = parseInt(difficultyCode[0]);
    let levelTitle = '', levelDescription = '', levelCSSClass = 'leveldfc';
    switch(difficultyLevel) {
        case 1:
            levelTitle = 'Training';
            levelDescription = 'Training maps are used to practice racing techniques and can include multiple finish lines.'
            break;
        case 2:
            levelTitle = 'Beginner';
            levelDescription = 'Beginner maps are the least difficult of time trials.';
            break;
        case 3:
            levelTitle = 'Easy';
            levelDescription = 'Easy maps include few obstacles that require clearing for completing the time trial.';
            break;
        case 4:
            levelTitle = 'Intermediate';
            levelDescription = 'Intermediate maps require some technical knowledge to complete the time trial.';
            break;
        case 5:
            levelTitle = 'Advanced';
            levelDescription = 'Advanced maps are mostly technical time trials that require a high level of skills to complete.';
            break;
        case 6:
            levelTitle = 'Expert';
            levelDescription = 'This is the most difficult level of time trials as it requires extensive technical and route knowledge.'
            break;
        case 7:
            levelTitle = 'Challenge';
            levelDescription = 'Maps made out of a very challenging obstacle course that requires precise execution on every single section.';
            break;
        default: return false;
    }

    const difficultyCategory = difficultyCode[1];
    let categoryTitle = '', categoryDescription = '';
    switch(difficultyCategory) {
        case 'a':
            categoryTitle = 'Low effort';
            categoryDescription = 'This category includes a low amount of obstacles and/or a short distance to the finish line.';
            break;
        case 'b':
            categoryTitle = 'Medium effort';
            categoryDescription = 'Requires some degree of attention to keep the pace going.';
            break;
        case 'c':
            categoryTitle = 'High effort';
            categoryDescription = 'Maps of extended length require a high level of attention to keep the pace.';
            break;
        default: return false;
    }

    if(toObj) {
        return {
            grade: difficultyCode,
            css: levelCSSClass+difficultyLevel,
            level: {
                id: difficultyLevel,
                title: levelTitle,
                description: levelDescription
            },
            category: {
                id: difficultyCategory,
                title: categoryTitle,
                description: categoryDescription
            }
        };
    }

    const tooltip = 'Grade: '+difficultyLevel+difficultyCategory+'\n\n'+
                    '['+difficultyLevel+'] => '+levelTitle+'\n'+levelDescription+'\n\n'+
                    '['+difficultyCategory+'] => '+categoryTitle+'\n'+categoryDescription;

    return '<div id="map_difficulty_grade" class="map-difficulty-grade">'+
        '<span title="'+tooltip+'" class="'+(asLabel ? 'btn-flat btn-flat-' : '')+levelCSSClass+difficultyLevel+'">'+difficultyCode+'<span>'+
    '</div>';
}

function getTableRowBGColor(x) {
    return (x % 2 === 0 ? leaderboardsRecordDarkClass : leaderboardsRecordLightClass);
}

function convertTime(time, format = 'full'){
    const timestamp = (isNaN(time) ? time : parseInt((time+'0000000000000').slice(0,13)));
    const d = new Date(timestamp);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    switch(format) {
        case 'timestamp': return d.valueOf();
        case 'compact':
            return [[('0'+d.getDate()).slice(-2),('0'+(d.getMonth()+1)).slice(-2),d.getFullYear().toString().slice(2)].join('/'),
                    ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)].join(' ');
        case 'full':
        default:
            return [months[d.getMonth()], d.getDate()+',', d.getFullYear()+',', ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)].join(' ');
    }
}

function convertBytes(bytes, format = 'value') {
    const base = 1024;
    const exp = Math.floor(Math.log(bytes) / Math.log(base));
    const decimals = 3;
    const units = ['Bytes', 'Kb', 'Mb', 'Gb'];

    const size = parseFloat((bytes / Math.pow(base, exp)).toFixed(decimals));
    if(!isNaN(size)) {
        if(format === 'value') {
            return size+' '+units[exp];
        }

        let colorClass = '';
        let warnIcon = '';
        if(exp === 2) {
            if(size >= 25) {
                colorClass = 'span-special-warn';
                warnIcon = '<span class="svg-warn">'+SVG_WARN+'</span>';
            }
        }
        else if(exp === 3) {
            colorClass = 'span-special-warn';
            warnIcon = '<span class="svg-warn">'+SVG_WARN+'</span>';
            if(size >= 1) {
                colorClass = 'span-special-crit';
                warnIcon = '<span class="svg-crit">'+SVG_WARN+'</span>';
            }
        }
        return '<span class="'+colorClass+'">'+size+' '+units[exp]+' '+warnIcon+'</span>';
    }
    return false;
}

function convertDisplayName(str, stripColor = false, charlimit = 0) {
    function cutSubStr(str, sub, limit = 0) {
        if(limit > 0) {
            if(str.includes('<')) {
                let dom = document.createElement('div');
                dom.innerHTML = str.toString();
                str = dom.textContent || dom.innerText || str;
            }

            if(str.length+sub.length > limit) {
                let nl = (str.length+sub.length)-limit;
                if(nl < sub.length) {
                    return sub.slice(0, nl)+'&mldr;';
                }
                return '';
            }
        }

        return sub;
    }

    let output = str.replaceAll('"', '&quot;');
    const nameArr = (str ? str.split('^') : []);
    if(nameArr.length > 1) {
        let result = new Array();
        for(let i = 0; i < nameArr.length; i++) {
            if(nameArr[i].length > 0) {
                let colorClass = '';
                switch(nameArr[i].charAt(0)) {
                    case '1': colorClass = 'span-red'; break;
                    case '2': colorClass = 'span-green'; break;
                    case '3': colorClass = 'span-yellow'; break;
                    case '4': colorClass = 'span-blue'; break;
                    case '5': colorClass = 'span-cyan'; break;
                    case '6': colorClass = 'span-purple'; break;
                    case '7': colorClass = 'span-white'; break;
                    case '8': colorClass = 'span-pink'; break;
                    case '9': colorClass = 'span-grey'; break;
                    case '0': colorClass = 'span-black'; break;
                    default: break;
                }

                let nstr = cutSubStr(result.join(''), (colorClass !== '' ? nameArr[i].slice(1) : (i > 0 ? '^' : '')+nameArr[i]), charlimit);
                if(nstr !== '') {
                    if(stripColor || colorClass === '') {
                        result.push(nstr);
                    }
                    else {
                        result.push('<span class="'+colorClass+'">'+nstr+'</span>');
                    }
                }
            }
        }

        if(result.length > 0) {
            output = result.join('');
        }
    }
    else if(charlimit > 0 && output.length > charlimit) {
        output = output.slice(0, charlimit)+'&mldr;';
    }

    return output;
}

function formatScore(s) {
    const score = Math.abs(s);
    const time = Math.floor(score / 1000);
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    const msecArr = (score / 1000).toString().split('.');
    const msec = ((msecArr.length > 1 ? msecArr[1] : '')+'000').slice(0,3);
    return (minutes > 0 ? minutes+':' : '')+(seconds > 0 ? (seconds < 10 ? '0'+seconds : seconds) : '00')+'.'+msec;
}

function trimStrLength(str0, limit0, str1 = false, limit1 = false) {
    function cutStringEnd(str, limit) {
        return str.slice(0,limit).trim()+(str.length > limit ? '&mldr;' : '');
    }

    if(str1 && limit1 > 0) {
        let output = [str0,str1];
        if(str0.length > limit0 && str1.length > limit1) {
            output = [cutStringEnd(str0,limit0),cutStringEnd(str1,limit1)];
        }
        else if(str0.length > limit0) {
            output[0] = cutStringEnd(str0,limit0+(limit1-str1.length));
        }
        else if(str1.length > limit1) {
            output[1] = cutStringEnd(str1,limit1+(limit0-str0.length));
        }
        return output;
    }
    return cutStringEnd(str0,limit0);
}

function changeExplicitContent(event) {
    let nsfw = 0;
    if(event) {
        if(event.checked) {
            nsfw = 1;
        }
    }
    else {
        const savedPref = localStorage.getItem(lsiNSFW);
        if(savedPref) {
            nsfw = parseInt(savedPref) || 0;
        }
    }

    let preview = document.getElementById('info_panel_settings_nsfw_preview');
    if(preview) {
        if(nsfw === 0) {
            preview.src = preview.src.replace('_on.', '_off.');
        }
        else {
            preview.src = preview.src.replace('_off.', '_on.');
        }
    }

    let userInput = document.getElementsByClassName('explicit-content');
    const contentAttr = (nsfw === 0 ? 'censored' : 'explicit');
    for(let i = 0; i < userInput.length; i++) {
        userInput[i].innerHTML = convertDisplayName(userInput[i].getAttribute(contentAttr));
    }

    localStorage.setItem(lsiNSFW, nsfw);
    return;
}

function filterExplicitContent(strNSFW, strCensored, stripColor = false, charlimit = 0) {
    strNSFW = strNSFW.replaceAll('"', '&quot;');
    strCensored = strCensored.replaceAll('"', '&quot;');
    let output = strCensored;
    const lsi = localStorage.getItem(lsiNSFW);
    if(lsi && parseInt(lsi) === 1) {
        output = strNSFW;
    }

    if(output) {
        output = convertDisplayName(output, stripColor, charlimit);
        let spanOutput = '<span class="explicit-content" explicit="'+strNSFW+'" censored="'+strCensored+'">'+output+'</span>';
        return {str: output, span: spanOutput};
    }
    return {str: false, span: false};
}

function generateTableLDB(data = {maps: [], players: [], records: [], activity: []}, tableId, key = 'player', value = 'all', dirLevels = 0, maxRows = 300, version = 'latest') {
    let dom = document.getElementById(tableId);
    let table = document.createElement('table');

    const fnMaps = new Maps(data.maps);
    const fnPlayers = new Players(data.players);
    const fnRecords = new Records(data.records);

    const theadId = tableId+'_thead';
    const tbodyId = tableId+'_tbody';

    const keyGR = 'globalrank';
    const keyAR = 'avgrank';
    const keyWR = 'wr';
    const keyRecords = 'records';
    const keyFavMapType = 'favmaptype';
    //const keyTags = 'tags';
    const keyRank = 'rank';
    const keyItemPlayer = 'player_id';
    const keyItemMap = 'map_id';
    const keyScore = 'score';
    const keyTopSpeed = 'top_speed';
    const keyDistance = 'distance';
    const keyMapType = 'type';
    const keyMapCreator = 'creator';
    const keyDifficulty = 'difficulty';
    const keyPublished = 'time_created';

    const dataSortGR = 'table-column-globalrank';
    const dataSortAR = 'table-column-avgrank';
    const dataSortWR = 'table-column-wr';
    const dataSortRecords = 'table-column-records';
    const dataSortFavMapType = 'table-column-favmaptype';
    //const dataSortTags = 'table-column-tags';
    const dataSortRank = 'table-column-rank';
    const dataSortKey = 'table-column-key';
    const dataSortScore = 'table-column-score';
    const dataSortTopSpeed = 'table-column-topspeed';
    const dataSortDistance = 'table-column-distance';
    const dataSortMapType = 'table-column-type';
    const dataSortMapCreator = 'table-column-creator';
    const dataSortDifficulty = 'table-column-difficulty';
    const dataSortPublished = 'table-column-published';

    if(dom) {
        let dHeader, dRecords;
        if(isNaN(value)) {
            if(key === 'player') {
                dHeader = [
                    {k: keyGR, v: 'Rank', class: 'table-header-column-globalrank', sort: dataSortGR},
                    {k: keyWR, v: 'WRs', class: 'table-header-column-wr', sort: dataSortWR},
                    {k: keyRecords, v: 'Records', class: 'table-header-column-records', sort: dataSortRecords},
                    {k: keyItemPlayer, v: 'Player', class: 'table-header-column-key', sort: dataSortKey},
                    {k: keyAR, v: 'Average Rank', class: 'table-header-column-avgrank', sort: dataSortAR},
                    {k: keyFavMapType, v: 'Favourite', class: 'table-header-column-favmaptype', sort: dataSortFavMapType}
                    //{k: keyTags, v: 'Tags', class: 'table-header-column-tags', sort: dataSortTags}
                ];
                dRecords = fnPlayers.getAll();
            }
            else {
                if(value === 'mapper') {
                    dHeader = [
                        {k: keyRecords, v: 'Records', class: 'table-header-column-records', sort: dataSortRecords},
                        {k: keyItemMap, v: 'Map', class: 'table-header-column-key', sort: dataSortKey},
                        {k: keyMapType, v: 'Race', class: 'table-header-column-type', sort: dataSortMapType},
                        {k: keyDifficulty, v: 'Difficulty', class: 'table-header-column-difficulty', sort: dataSortDifficulty},
                        {k: keyPublished, v: 'Date Published', class: 'table-header-column-published', sort: dataSortPublished},
                    ];
                }
                else {
                    dHeader = [
                        {k: keyRecords, v: 'Records', class: 'table-header-column-records', sort: dataSortRecords},
                        {k: keyItemMap, v: 'Map', class: 'table-header-column-key', sort: dataSortKey},
                        {k: keyMapType, v: 'Race', class: 'table-header-column-type', sort: dataSortMapType},
                        {k: keyDifficulty, v: 'Difficulty', class: 'table-header-column-difficulty', sort: dataSortDifficulty},
                        {k: keyMapCreator, v: 'Mapper', class: 'table-header-column-creator', sort: dataSortMapCreator},
                        {k: keyPublished, v: 'Date Published', class: 'table-header-column-published', sort: dataSortPublished},
                    ];
                }
                dRecords = fnMaps.getAll();
            }
        }
        else {
            dHeader = [
                {k: keyRank, v: 'Rank', class: 'table-header-column-rank', sort: dataSortRank},
                {k: (key === 'player' ? keyItemMap : keyItemPlayer), v: (key === 'player' ? 'Map' : 'Player'), class: 'table-header-column-key', sort: dataSortKey},
                {k: keyScore, v: 'Time {m:s.ms}', class: 'table-header-column-score', sort: dataSortScore},
                {k: keyTopSpeed, v: 'Top Speed {ups}', class: 'table-header-column-topspeed', sort: dataSortTopSpeed},
                {k: keyDistance, v: 'Distance', class: 'table-header-column-distance', sort: dataSortDistance}
            ];
            dRecords = (key === 'player' ? fnRecords.getByPlayer(value) : fnRecords.getByMap(value));
        }

        const HEADER = dHeader;
        const RECORDS = dRecords;

        let i = 0;
        let thead = table.createTHead();
        thead.id = theadId;
        thead.className = 'rc-leaderboards-header';
        let cell, row = thead.insertRow(0);
        for(i = 0; i < HEADER.length; i++) {
            if(HEADER[i].sort) {
                row.innerHTML += '<th class="'+HEADER[i].class+'"><button class="btn-text" onclick="sortTableLDB(this, \''+theadId+'\', \''+tbodyId+'\')" data-sort="'+HEADER[i].sort+'">'+HEADER[i].v+' '+SVG_ORDER+'</button></th>';
            }
            else {
                row.innerHTML += '<th class="'+HEADER[i].class+'"><button class="btn-text">'+HEADER[i].v+' '+SVG_ORDER+'</button></th>';
            }
        }

        let tbody = table.createTBody();
        tbody.id = tbodyId;
        tbody.setAttribute('max_rows', maxRows);
        for(i = 0; i < RECORDS.length; i++) {
            row = tbody.insertRow(i);
            row.className = 'cell-leaderboards-row '+(i % 2 === 0 ? leaderboardsRecordDarkClass : leaderboardsRecordLightClass);
            let aRank = '', aScore = '', aTopSpeed = '', aDistance = '';

            if(i >= maxRows && maxRows > 0) {
                row.classList.add(hideDomClass);
            }

            if(!isNaN(value)) {
                const fnActivity = new Activity(data.activity);
                const ACTIVITY = fnActivity.getActivityByRecord(RECORDS[i].player_id, RECORDS[i].map_id);

                if(ACTIVITY && ACTIVITY.details) {
                    aRank = '<span class="span-special-value">[&plus;]</span>&nbsp;';
                    if(ACTIVITY.type === 'update_record') {
                        aRank = (ACTIVITY.details.rank > 0 ? '<span class="cell-extra-rank span-special-info">['+Math.abs(ACTIVITY.details.rank)+'&uarr;]' :
                                (ACTIVITY.details.rank < 0 ? '<span class="cell-extra-rank span-special-crit">['+Math.abs(ACTIVITY.details.rank)+'&darr;]' :
                                '<span class="cell-extra-rank span-special-'+(ACTIVITY.details.score < 0 ? 'crit' : 'info')+'">[=]'))+'</span>&nbsp;';
                        aScore = (ACTIVITY.details.score < 0 ? '<span class="cell-extra-rank span-special-crit">[&plus;' : '<span class="span-special-info">[&minus;')+formatScore(Math.abs(ACTIVITY.details.score))+']</span>&nbsp;';
                        if(ACTIVITY.details.top_speed !== 0) {
                            aTopSpeed = '<span class="span-special-value">['+(ACTIVITY.details.top_speed > 0 ? '&plus;' : '')+ACTIVITY.details.top_speed+']</span>&nbsp;';
                        }
                        if(ACTIVITY.details.distance !== 0) {
                            aDistance = '<span class="span-special-value">['+(ACTIVITY.details.distance < 0 ? '&plus;' : '&minus;')+Math.abs(ACTIVITY.details.distance)+']</span>&nbsp;';
                        }
                    }
                }
            }

            for(let j = 0; j < HEADER.length; j++) {
                cell = row.insertCell(j);
                let recordItem = RECORDS[i][HEADER[j].k];

                switch(HEADER[j].k) {
                    case keyGR:
                        const globalRankTemp = RECORDS[i].globalrank;
                        const globalRank = (globalRankTemp !== 0 ? globalRankTemp : fnPlayers.count());
                        let grClassSuffix = '';
                        if(globalRank <= 3) {
                            grClassSuffix = '-'+globalRank;
                        }
                        else if(globalRank <= 100) {
                            grClassSuffix = '-top100';
                        }
                        else if(globalRank <= maxRows) {
                            grClassSuffix = '-topX';
                        }
                        cell.className = dataSortGR;
                        cell.setAttribute('sort-value', globalRank);
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = '<span class="cell-table-key"><a class="'+HEADER[j].class+grClassSuffix+'" href="'+getHrefPlayer(RECORDS[i].id, dirLevels)+'">'+(globalRankTemp !== 0 ? globalRank : '-----------'.slice(0,globalRank.toString().length))+'</a></span>';
                        break;
                    case keyAR:
                        const avgRankTemp = RECORDS[i].avgrank;
                        const avgRank = (avgRankTemp !== 0 ? avgRankTemp : fnPlayers.count());
                        let arClassSuffix = (avgRank <= 10 ? (RECORDS[i].records > 10 ? '-hl' : '') : '');
                        cell.className = dataSortAR;
                        cell.setAttribute('sort-value', avgRank);
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = '<span class="cell-table-key"><a class="'+HEADER[j].class+arClassSuffix+'" href="'+getHrefPlayer(RECORDS[i].id, dirLevels)+'">'+(avgRankTemp !== 0 ? avgRank : '-----------'.slice(0,avgRank.toString().length))+'</a></span>';
                        break;
                    case keyWR:
                        let wrClassSuffix = (RECORDS[i].wrs > 0 ? '-hl' : '');
                        cell.className = dataSortWR;
                        cell.setAttribute('sort-value', RECORDS[i].wrs);
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = '<span class="cell-table-key"><a class="'+HEADER[j].class+wrClassSuffix+'" href="'+getHrefPlayer(RECORDS[i].id, dirLevels)+'">'+RECORDS[i].wrs+'</a></span>';
                        break;
                    case keyRecords:
                        let recordsCount = (key === 'player' ? fnRecords.getByPlayer(RECORDS[i].id) : fnRecords.getByMap(RECORDS[i].id)) || [];
                        let recClassSuffix = (recordsCount.length > 0 ? '-hl' : '');
                        cell.className = dataSortRecords;
                        cell.setAttribute('sort-value', recordsCount.length);
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = '<span class="cell-table-key"><a class="'+HEADER[j].class+recClassSuffix+'" href="'+(key === 'player' ? getHrefPlayer(RECORDS[i].id, dirLevels) : getHrefMap(RECORDS[i].id, dirLevels))+'">'+recordsCount.length+'</a></span>';
                        break;
                    case keyFavMapType:
                        cell.className = dataSortFavMapType;
                        cell.setAttribute('sort-value', formatFavouriteMapType(RECORDS[i].fav, RECORDS[i].records, true));
                        cell.setAttribute('sort-type', 'string');
                        cell.innerHTML = formatFavouriteMapType(RECORDS[i].fav, RECORDS[i].records);
                        break;
                    case keyMapType:
                        const mapTypeList = fnMaps.getEntryById(RECORDS[i].id, keyMapType);
                        const mapTypes = formatMapTypeLine(mapTypeList);
                        cell.className = dataSortMapType;
                        cell.setAttribute('sort-value', mapTypeList.sort().reverse().join(','));
                        cell.setAttribute('sort-type', 'string');
                        cell.style.textAlign = 'center';
                        cell.innerHTML = mapTypes;
                        break;
                    case keyDifficulty:
                        const difficulty = fnMaps.getEntryById(RECORDS[i].id, keyDifficulty);
                        const difficultySpan = formatMapDifficultyLine(difficulty, false);
                        cell.className = dataSortDifficulty;
                        cell.setAttribute('sort-value', difficulty);
                        cell.setAttribute('sort-type', 'string');
                        cell.style.textAlign = 'center';
                        cell.innerHTML = difficultySpan;
                        break;
                    case keyMapCreator:
                        const mapperObj = fnPlayers.getEntryById(recordItem);
                        const mapperName = filterExplicitContent(mapperObj.name, mapperObj.censored_name, false, 50);
                        cell.className = dataSortMapCreator;
                        cell.setAttribute('sort-value', (mapperName.str || '?').toLowerCase());
                        cell.setAttribute('sort-type', 'string');
                        if(mapperName.str) {
                            cell.innerHTML = '<span class="cell-table-key"><a class="'+HEADER[j].class+'" href="'+getHrefPlayer(recordItem, dirLevels)+'">'+mapperName.span+'</a></span>';
                        }
                        else {
                            cell.innerHTML = '<span class="cell-table-key">--</span>';
                        }
                        break;
                    //case keyTags: break;
                    case keyPublished:
                        cell.className = dataSortPublished;
                        cell.setAttribute('sort-value', (isNaN(recordItem) ? 0 : recordItem));
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = aDistance+'<span '+(!isNaN(recordItem) ? 'title="'+convertTime(recordItem)+'"' : '')+'>'+(convertTime(recordItem, 'compact') || '--')+'</span>';
                        break;
                    case keyRank:
                        let ranksCount = RECORDS.length;
                        cell.className = dataSortRank;
                        if(key === 'player') {
                            ranksCount = fnRecords.getByMap(RECORDS[i].map_id).length;
                            cell.innerHTML = aRank+'<span class="cell-top-player-name-'+(recordItem-1)+'"><span class="cell-top-player-position">'+recordItem+'/'+ranksCount+'</span></span>';
                        }
                        else {
                            cell.innerHTML = aRank+'<a class="'+HEADER[j].class+'" href="'+getHrefPlayer(RECORDS[i].player_id, dirLevels)+'"><span class="cell-top-player-name-'+(recordItem-1)+'"><span class="cell-top-player-position">'+recordItem+'</span></span></a>';
                        }
                        cell.setAttribute('sort-value', recordItem+'/'+ranksCount);
                        cell.setAttribute('sort-type', 'rank');
                        break;
                    case keyItemMap:
                        const mapId = RECORDS[i].map_id || RECORDS[i].id;
                        let mapObj = RECORDS[i];
                        if(!mapObj.title) {
                            mapObj = fnMaps.getEntryById(mapId);
                        }

                        const mapTitle = filterExplicitContent(mapObj.title, mapObj.censored_title, false, 50);
                        const mapDeleted = (!isNaN(mapObj.time_created) ? '' : '&nbsp;<span class="svg-crit" title="This map was deleted and cannot be played anymore!">'+SVG_WARN+'</span>');
                        cell.className = dataSortKey;
                        cell.setAttribute('sort-value', mapTitle.str.toLowerCase());
                        cell.setAttribute('sort-type', 'string');
                        cell.innerHTML = '<span class="cell-table-key"><a class="'+HEADER[j].class+'" href="'+getHrefMap(mapId, dirLevels)+'">'+mapTitle.span+mapDeleted+'</a></span>';
                        break;
                    case keyItemPlayer:
                        const playerId = RECORDS[i].player_id || RECORDS[i].id;
                        let playerObj = RECORDS[i];
                        if(!playerObj.name) {
                            playerObj = fnPlayers.getEntryById(playerId);
                        }
                        const playerName = filterExplicitContent(playerObj.name, playerObj.censored_name, false, 50);
                        cell.className = dataSortKey;
                        cell.setAttribute('sort-value', (playerName.str || '[deleted]').toLowerCase());
                        cell.setAttribute('sort-type', 'string');
                        if(playerName.str) {
                            cell.innerHTML = '<span class="cell-table-key"><a class="'+HEADER[j].class+'" href="'+getHrefPlayer(playerId, dirLevels)+'">'+formatCountryFlag(playerObj.country)+'&nbsp;'+playerName.span+'</a></span>';
                        }
                        else {
                            cell.innerHTML = '<span class="cell-table-key">[deleted]</span>';
                        }
                        break;
                    case keyScore:
                        cell.className = dataSortScore;
                        cell.setAttribute('sort-value', recordItem);
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = aScore+'<span class="cell-top-player-score">'+formatScore(recordItem)+'</span>';
                        break;
                    case keyTopSpeed:
                        cell.className = dataSortTopSpeed;
                        cell.setAttribute('sort-value', recordItem);
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = aTopSpeed+'<span>'+recordItem+'</span>';
                        break;
                    case keyDistance:
                        cell.className = dataSortDistance;
                        cell.setAttribute('sort-value', recordItem);
                        cell.setAttribute('sort-type', 'int');
                        cell.innerHTML = aDistance+'<span>'+recordItem+'</span>';
                        break;
                    default: break;
                }
            }
        }

        dom.innerHTML = table.innerHTML;

        // Disabled "show more" labels in favour of pagination
        // if(maxRows > 0) {
        //     let showMoreBtn = table.parentNode.getElementsByClassName('table-show-more');
        //     if(showMoreBtn.length > 0) {
        //         if(RECORDS.length > maxRows) {
        //             let fixedRowLimit = 200;
        //             showMoreBtn[0].setAttribute('onclick', 'showMoreLDBRows(this, \"'+tableId+'\", '+fixedRowLimit+')');
        //             showMoreBtn[0].innerHTML = 'Currently showing '+maxRows+'/'+RECORDS.length+' rows / Show '+(fixedRowLimit+maxRows > RECORDS.length ? RECORDS.length-maxRows : fixedRowLimit)+' more '+SVG_SHOW_MORE;
        //         }
        //         else {
        //             showMoreBtn[0].removeAttribute('onclick');
        //             showMoreBtn[0].innerHTML = 'Showing all '+RECORDS.length+' rows';
        //         }
        //     }
        // }
        if(maxRows > 0) {
            let pageNavDiv = dom.parentNode.getElementsByClassName('table-page-nav');
            if(pageNavDiv.length > 0) {
                if(RECORDS.length > maxRows) {
                    let startPageBtn = pageNavDiv[0].getElementsByClassName('table-page-start')[0];
                    let prevPageBtn = pageNavDiv[0].getElementsByClassName('table-page-prev')[0];
                    let nextPageBtn = pageNavDiv[0].getElementsByClassName('table-page-next')[0];
                    let endPageBtn = pageNavDiv[0].getElementsByClassName('table-page-end')[0];
                    let pageIndexSpan = pageNavDiv[0].getElementsByClassName('table-page-index')[0];

                    startPageBtn.setAttribute('onclick', 'pageLDBRows(this, \"start\", \"'+tableId+'\", '+maxRows+')');
                    prevPageBtn.setAttribute('onclick', 'pageLDBRows(this, \"prev\", \"'+tableId+'\", '+maxRows+')');
                    nextPageBtn.setAttribute('onclick', 'pageLDBRows(this, \"next\", \"'+tableId+'\", '+maxRows+')');
                    endPageBtn.setAttribute('onclick', 'pageLDBRows(this, \"end\", \"'+tableId+'\", '+maxRows+')');
                    pageIndexSpan.innerHTML = indexPageLDB(1, Math.ceil(RECORDS.length/maxRows));
                }
                else {
                    pageNavDiv[0].innerHTML = '<span class="info-panel-details table-page-index svg-info-small">Showing '+RECORDS.length+' item'+(RECORDS.length !== 1 ? 's' : '')+'</span>';
                }
            }
        }
    }
    return;
}

function indexPageLDB(currentPage, maxPages) {
    return currentPage+' / '+maxPages;
}

function showMoreLDBRows(event, tableId, maxRows) {
    let table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    let hiddenRows = table.getElementsByClassName(hideDomClass);
    if(hiddenRows.length > 0) {
        for(let i = 0; i < maxRows; i++) {
            if(!hiddenRows[0]) { break; }
            hiddenRows[0].classList.remove(hideDomClass);
        }

        const currentlyHiddenRows = table.getElementsByClassName(hideDomClass);
        if(currentlyHiddenRows.length > 0) {
            event.innerHTML = 'Currently showing '+(table.children.length-currentlyHiddenRows.length)+'/'+table.children.length+' rows / Show '+(maxRows > currentlyHiddenRows.length ? currentlyHiddenRows.length : maxRows)+' more '+SVG_SHOW_MORE;
            return;
        }
    }

    event.removeAttribute('onclick');
    event.innerHTML = 'Currently showing all '+table.children.length+' rows';
    return;
}

function pageLDBRows(event, direction, tableId, maxRows) {
    let tr = document.getElementById(tableId).getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    if(tr.length > 0) {
        if((!tr[0].classList.contains(hideDomClass) && (direction === 'start' || direction === 'prev')) ||
            (!tr[tr.length-1].classList.contains(hideDomClass) && (direction === 'end' || direction === 'next'))) {
            return;
        }

        let i = 0, index = -1;
        const maxPages = Math.ceil(tr.length/maxRows);

        for(i = 0; i < tr.length; i++) {
            if(!tr[i].classList.contains(hideDomClass) && index < 0) {
                index = i;
            }
            tr[i].classList.add(hideDomClass);
        }

        if(direction === 'start') {
            index = 0;
        }
        else if(direction === 'prev') {
            index = (index-maxRows < 0 ? 0 : index-maxRows);
        }
        else if(direction === 'next') {
            index += maxRows;
        }
        else if(direction === 'end') {
            index = (maxPages-1)*maxRows;
        }

        for(i = index; i < tr.length && i < index+maxRows; i++) {
            tr[i].classList.remove(hideDomClass);
        }

        let table = document.getElementById(tableId);
        table.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
        table.parentNode.scrollTo({ top: 0, behavior: 'smooth' });

        pageIndexSpan = event.parentNode.getElementsByClassName('table-page-index')[0];
        pageIndexSpan.innerHTML = indexPageLDB((Math.ceil(index/maxRows)+1), maxPages);
    }
    return;
}

function changeShowcaseView(event, panel) {
    if(event.className === 'selected') {
        return false;
    }

    let headerSelection = event.parentNode.getElementsByClassName('selected');
    for(let i = 0; i < headerSelection.length; i++) {
        headerSelection[i].className = '';
    }
    event.className = 'selected';

    let contentDom = document.getElementById(panel).parentNode.children;
    for(let i = 0; i < contentDom.length; i++) {
        contentDom[i].classList.add(hideDomClass);
    }
    document.getElementById(panel).classList.remove(hideDomClass);
    return;
}

function adjustLDBHeaderOffset(topElementId, headerElementId) {
    const span = document.getElementById(topElementId);
    const header = document.getElementById(headerElementId);
    const spanHeight = span.scrollHeight+2;
    header.style.top = spanHeight + 'px';
}

function sortTableLDB(event, theadId, tbodyId, asc = -1) {
    const columnName = event.getAttribute('data-sort');
    const headerName = event.textContent;

    let i = 0;
    let sortedTable = new Array();
    let indexedColumn = new Array();

    let domTHead = document.getElementById(theadId);
    if(domTHead) {
        let domSortButtons = domTHead.getElementsByTagName('button');
        if(domSortButtons.length > 0) {
            for(i = 0; i < domSortButtons.length; i++) {
                domSortButtons[i].setAttribute('onclick', 'sortTableLDB(this, \''+theadId+'\', \''+tbodyId+'\')');
                domSortButtons[i].innerHTML = domSortButtons[i].textContent+' '+SVG_ORDER;
            }
        }
    }

    let domTBody = document.getElementById(tbodyId);
    if(domTBody && columnName) {
        let domColumns = domTBody.getElementsByClassName(columnName);
        if(domColumns.length > 1) {
            const sortType = domColumns[0].getAttribute('sort-type');
            for(i = 0; i < domColumns.length; i++) {
                const sortKey = domColumns[i].getAttribute('sort-value');
                if(sortKey) {
                    indexedColumn.push([sortKey, domColumns[i].parentNode.outerHTML]);
                }
            }

            if(asc < 0) {
                if(indexedColumn.length > 0) {
                    switch(sortType) {
                        case 'rank':
                            indexedColumn.sort((a, b) => {
                                const [leftA, rightA] = a[0].split('/').map(Number);
                                const [leftB, rightB] = b[0].split('/').map(Number);
                                if (leftA !== leftB) {
                                    return leftA - leftB;
                                }
                                return rightA - rightB;
                            });
                            break;
                        case 'int':
                            indexedColumn.sort((a, b) => a[0] - b[0]);
                            break;
                        case 'string':
                        default:
                            indexedColumn.sort((a, b) => {
                                if (a[0] < b[0]) return -1;
                                if (a[0] > b[0]) return 1;
                                return 0;
                            });
                            break;
                    }
                }
                asc = 0;
            }
            else if(indexedColumn.length > 0) {
                indexedColumn.reverse();
            }
        }
    }

    if(asc === 0) {
        event.setAttribute('onclick', 'sortTableLDB(this, \''+theadId+'\', \''+tbodyId+'\', 1)');
        event.innerHTML = headerName+' '+SVG_ORDER_DOWN;
    }
    else {
        event.setAttribute('onclick', 'sortTableLDB(this, \''+theadId+'\', \''+tbodyId+'\', 0)');
        event.innerHTML = headerName+' '+SVG_ORDER_UP;
    }

    if(indexedColumn.length > 0) {
        const maxRows = parseInt(domTBody.getAttribute('max_rows'));
        for(i = 0; i < indexedColumn.length; i++) {
            let splitDom = indexedColumn[i][1].split('<td');
            splitDom[0] = '<tr class="cell-leaderboards-row '+getTableRowBGColor(i)+(i >= maxRows && maxRows > 0 ? ' '+hideDomClass : '')+'">';
            sortedTable.push(splitDom.join('<td'));
        }
        domTBody.innerHTML = sortedTable.join('');
        domTBody.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
        domTBody.parentNode.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
        let pageIndexDom = domTBody.parentNode.parentNode.getElementsByClassName('table-page-index');
        if(pageIndexDom.length > 0) {
            let pageIndex = pageIndexDom[0].innerHTML.split('/');
            if(pageIndex.length > 1) {
                pageIndexDom[0].innerHTML = indexPageLDB(1, pageIndex[1]);
            }
        }
    }
    return;
}

function pageHeader(directoryLevel = 1) {
    const menuChoices = [
        {id: 'menu_home', content: SVG_HOME+' Home', url: getRelativePath(directoryLevel+1)+'leaderboards/'},
        {id: 'menu_maps', content: SVG_MAP+' Maps', url: getRelativePath(directoryLevel)+'maps/'},
        {id: 'menu_players', content: SVG_PLAYER+' Players', url: getRelativePath(directoryLevel)+'players/'},
        {id: 'menu_news', content: SVG_ANNOUCEMENT+' News', url: '/news'},
        {id: 'menu_wiki', content: SVG_RESOURCES+' Wiki', url: '/wiki/reflex-racing-wiki', dropdown: [
            {content: 'Getting started', url: '/wiki/getting-started'},
            {content: 'Movement guide', url: '/wiki/movement/menu'}
        ]},
        {id: 'menu_tournaments', content: SVG_LEADERBOARDS+' Tournaments', url: '#wip'}
    ];

    let panel = document.createElement('div');
    panel.classList.add('rc-menu-panel');
    let menu = document.createElement('div');
    menu.classList.add('info-panel-menu');

    for(let i = 0; i < menuChoices.length; i++) {
        let choice = document.createElement('div');
        let menuBtn = document.createElement('a');
        menuBtn.id = menuChoices[i].id;
        menuBtn.classList.add('btn-text');
        menuBtn.href = menuChoices[i].url;
        menuBtn.innerHTML = menuChoices[i].content;
        choice.appendChild(menuBtn);

        if(menuChoices[i].dropdown) {
            let menuDropdown = document.createElement('ul');
            for(let j = 0; j < menuChoices[i].dropdown.length; j++) {
                let subMenuBtn = document.createElement('a');
                subMenuBtn.classList.add('btn-text');
                subMenuBtn.href = menuChoices[i].dropdown[j].url;
                subMenuBtn.innerHTML = menuChoices[i].dropdown[j].content;
                menuDropdown.innerHTML += ('<li>'+subMenuBtn.outerHTML+'</li>');
            }
            choice.appendChild(menuDropdown);
        }

        menu.appendChild(choice);
    }

    panel.appendChild(menu);
    return panel.outerHTML;
}

function formatCountryFlag(countryCode, countryName = false) {
    let countryTitle = (countryName && countryName !== 'Unknown' ? countryName : countryCode);
    if(!countryCode || countryCode.length !== 2) {
        countryCode = 'xx';
        countryTitle = ''; //'Country not available'
    }
    return '<span title="'+countryTitle+'" class="fi fi-'+countryCode.toLowerCase()+'"></span>'
}

function getCountryName(data, alpha2code) {
    for(let i = 0; i < data.length; i++) {
        if(data[i].alpha2 === alpha2code.toLowerCase()) {
            const countryName = data[i].name.split(',').reverse();
            return countryName.join(' ').trim();
        }
    }
    return 'Country';
}

function formatMapTypeLine(typeList) {
    let output = new Array();
    if(typeList && Array.isArray(typeList)) {
        typeList.sort().reverse();
        for(let i = 0; i < typeList.length; i++) {
            const type = getMapType(typeList[i], false);
            if(type) {
                output.push(type);
            }
        }
    }

    if(output.length > 0) {
        return output.join('&nbsp;');
    }
    return '<span class="map-type-icon-unknown" title="Unknown map type">'+SVG_TYPE_UNKNOWN+'</span>';
}

function formatMapDifficultyLine(difficultyObj, asLabel = true) {
    const difficulty = getMapDifficulty(difficultyObj, false, asLabel);
    if(difficulty) {
        return difficulty;
    }

    return '<span class="map-type-icon-unknown" title="Unknown map difficulty">'+SVG_TYPE_UNKNOWN+'</span>';
}

function formatFavouriteMapType(favMapTypeObj, recordsCount, asLabel = false) {
    const strafeType = favMapTypeObj.strafe || 0;
    const rocketType = favMapTypeObj.rocket || 0;
    const plasmaType = favMapTypeObj.plasma || 0;
    const grenadeType = favMapTypeObj.grenade || 0;
    let output = new Array();

    if(strafeType > 0 && (strafeType / recordsCount) > 0.6) {
        if(asLabel) {
            output.push('strafe');
        }
        else {
            output.push('<span title="Strafing" class="map-type-icon-strafe">'+SVG_TYPE_STRAFE+'</span>');
        }
    }

    if(rocketType > 0 && (rocketType / recordsCount) > 0.2) {
        if(asLabel) {
            output.push('rocket');
        }
        else {
            output.push('<span title="Rocket jumps" class="map-type-icon-rocket">'+SVG_TYPE_ROCKET+'</span>');
        }
    }

    if(plasmaType > 0 && (plasmaType / recordsCount) > 0.2) {
        if(asLabel) {
            output.push('plasma');
        }
        else {
            output.push('<span title="Plasma climb" class="map-type-icon-plasma">'+SVG_TYPE_PLASMA+'</span>');
        }
    }

    if(grenadeType > 0 && (grenadeType / recordsCount) > 0.2) {
        if(asLabel) {
            output.push('grenade');
        }
        else {
            output.push('<span title="Grenade jumps" class="map-type-icon-grenade">'+SVG_TYPE_GRENADE+'</span>');
        }
    }

    if(output.length > 0) {
        return output.join((asLabel ? ',' : '&nbsp;'));
    }

    if(asLabel) {
        return '?';
    }
    return '<span title="No preference" class="map-type-icon-unknown">'+SVG_TYPE_UNKNOWN+'</span>';
}

async function deleteIDB() {
    if(indexedDB) {
        const request = indexedDB.deleteDatabase(idb);
        request.onblocked = function(event) {
            console.log("Database in blocked state");
        };
        request.onerror = function(event) {
            console.log("Error deleting database");
        };
        request.onsuccess = function(event) {
            console.log("Database deleted successfully");
        };
    }
    return;
}

async function initIDB() {
    if(indexedDB) {
        var request = indexedDB.open(idb, 1);
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.errorCode}`);
        };
        request.onsuccess = (event) => {
            let db = request.result;
            db.close();
        };
        request.onupgradeneeded = (event) => {
            let db = request.result;
            let objectStoreData = db.createObjectStore(idbTable, { keyPath: idbKeyPath });
            objectStoreData.createIndex(idbIndex, [idbIndex], { unique: false });
            objectStoreData.transaction.oncomplete = (event) => {
                console.log("Schema added to the database");
            };
        };
    }
    return;
}

async function getIndexedData(index) {
    return new Promise((resolve) => {
        if(!indexedDB) {
            resolve(false);
        }

        var output = false;
        var request = indexedDB.open(idb, 1);
        request.onerror = (event) => {
            console.error('Database error: '+event.target.errorCode);
            resolve(false);
        };
        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            let objectStore = db.createObjectStore(idbTable, { keyPath: idbKeyPath });
            objectStore.createIndex(idbIndex, [idbIndex], { unique: false });
            objectStore.transaction.oncomplete = (event) => {
                //console.log('getIndexedData() -> request.onupgradeneeded();');
            };
        };
        request.onsuccess = (event) => {
            let db = event.target.result;
            const cTransaction = db.transaction(idbTable, "readonly");
            let cObjectStore = cTransaction.objectStore(idbTable);
            let cursorRequest = cObjectStore.openCursor(IDBKeyRange.only(index));
            cursorRequest.onerror = function(err) {
                console.error('Transaction error: '+err);
                resolve(false);
            };
            cursorRequest.onsuccess = function(evt) {
                let cursor = evt.target.result;
                if(cursor) {
                    output = cursor.value;
                    cursor.continue();
                }

                if(output[idbIndex]) {
                    resolve(output[idbIndex]);
                }
                else {
                    resolve(false);
                }
            };
        };
        request.oncomplete = () => {
            let db = request.result;
            db.close();
            resolve(output);
        };
    });
}

async function setIDBDataset(index, dataset)
{
    if(indexedDB) {
        var data = { [idbKeyPath]: index, [idbIndex]: JSON.stringify(dataset) };
        var request = indexedDB.open(idb, 1);
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.errorCode}`);
        };
        request.onsuccess = (event) => {
            const db = request.result;
            const transaction = db.transaction(idbTable, "readwrite");
            const store = transaction.objectStore(idbTable);
            store.put(data);
            transaction.oncomplete = function () {
                db.close();
            };
        };
    }
    return;
}

function autoRefresh() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const refreshIntervals = [10, 30, 50, 70];
    let remainingMinutes = 20;
    for(let i = 0; i < refreshIntervals.length; i++) {
        if(minutes < refreshIntervals[i]) {
            remainingMinutes = refreshIntervals[i] - minutes;
            break;
        }
    }

    const timer = (((remainingMinutes * 60) - seconds) * 1000);
    autoRefreshTimeout = setTimeout(function() {
        const check = localStorage.getItem(lsiAutoRefresh);
        if(check && check === '1') {
            window.location.reload();
        }
    }, timer);
}

async function getIDBDataset(key) {
    let latestVersion = false;
    const lastUpdateKey = 'reflex-racing-ldb-lastupdate';
    const lastLDBUpdate = localStorage.getItem(lastUpdateKey);
    let idbUpdates = {};
    if(lastLDBUpdate) {
        idbUpdates = JSON.parse(lastLDBUpdate);
        if(!isNaN(idbUpdates[key])) {
            const lastUpdate = new Date(idbUpdates[key]);
            const now = new Date();
            if(now.getHours() === lastUpdate.getHours()) {
                latestVersion = true;
                const currentMinutes = now.getMinutes();
                const prevMinutes = lastUpdate.getMinutes();
                const refreshIntervals = [10, 30, 50, 70];
                for(let i = 0; i < refreshIntervals.length; i++) {
                    if(prevMinutes < refreshIntervals[i] && currentMinutes >= refreshIntervals[i]) {
                        latestVersion = false;
                        break;
                    }
                }
            }
        }
    }

    let fetchURL = '';
    switch(key) {
        case idbKeyMaps:
            fetchURL = 'https://raw.githubusercontent.com/htprankster/reflex-racing-datasets/refs/heads/main/leaderboards/latest/ldb_maps.json';
            break;
        case idbKeyPlayers:
            fetchURL = 'https://raw.githubusercontent.com/htprankster/reflex-racing-datasets/refs/heads/main/leaderboards/latest/ldb_players.json';
            break;
        case idbKeyRecords:
            fetchURL = 'https://raw.githubusercontent.com/htprankster/reflex-racing-datasets/refs/heads/main/leaderboards/latest/ldb_records.json';
            break;
        case idbKeyActivity:
            fetchURL = 'https://raw.githubusercontent.com/htprankster/reflex-racing-datasets/refs/heads/main/leaderboards/latest/ldb_activity.json';
            break;
        case idbKeyRSS:
            fetchURL = 'https://raw.githubusercontent.com/htprankster/reflex-racing-datasets/refs/heads/main/rss/rss.json';
            break;
        case idbKeyMetadata:
            fetchURL = 'https://raw.githubusercontent.com/htprankster/reflex-racing-datasets/refs/heads/main/metadata.json';
            break;
        default: return false;
    }

    let dataset = false;
    if(!latestVersion || !indexedDB) {
        dataset = await fetchDATA(fetchURL);
        setIDBDataset(key, dataset);
        const d = new Date();
        idbUpdates[key] = d.valueOf();
        localStorage.setItem(lastUpdateKey, JSON.stringify(idbUpdates));
        return dataset;
    }

    await getIndexedData(key).then(output => { dataset = output; });
    return JSON.parse(dataset);
}
