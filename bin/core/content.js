const env = 'local';
const linkWebsiteRepo = '<a href="https://github.com/htprankster/reflex.racing" title="GitHub">'+SVG_GITHUB+'</a>';
const linkWebsiteDiscord = '<a href="https://discord.gg/e2tDNtm" title="Discord">'+SVG_DISCORD+'</a>';
const settingsShortcuts = '<button onclick="changeAutoRefresh(this)">'+SVG_REPEAT_OFF+'</button>';
const footerLinks = [linkWebsiteRepo,linkWebsiteDiscord].join('&nbsp;');
const lsiTheme = 'reflex-racing-theme';
const lsiAutoRefresh = 'reflex-racing-autorefresh';
let autoRefreshTimeout;

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

function setBackgroundAlt(event) {
    const parent = event.parentNode;
    parent.innerHTML = '<div class="cell-broken-preview"><span>'+SVG_WARN+'</span>&nbsp;<span>Deleted</span>&nbsp;<span>'+SVG_WARN+'</span></div>';
    return;
}

function resetSlideshow() {
    const slideshowStatus = document.getElementById('slideshow_panel_controls_status');
    const slideshowWrap = document.getElementById('slideshow_wrapper');
    if(slideshowStatus.innerHTML !== 'START') {
        const slideshowWrapHidden = document.getElementById('slideshow_wrapper_hidden');
        slideshowWrap.classList.remove('cell-group-scroll');
        slideshowWrap.style.animationPlayState = 'paused';
        slideshowWrapHidden.classList.remove('cell-group-scroll');
        slideshowWrapHidden.style.animationPlayState = 'paused';
        slideshowStatus.innerHTML = 'START';
        slideshowStatus.classList.remove('btn-flat-info');
        slideshowStatus.classList.add('btn-flat-warn');
        document.getElementById('slideshow_panel_controls_play').innerHTML = SVG_PLAY;
    }
    return;
}

function autoSlideshow() {
    const slideshowWrap = document.getElementById('slideshow_wrapper');
    const slideshowStatus = document.getElementById('slideshow_panel_controls_status');
    if(slideshowStatus.innerHTML === 'AUTO') {
        slideshowStatus.innerHTML = 'PAUSE';
        slideshowStatus.classList.remove('btn-flat-info');
        slideshowStatus.classList.add('btn-flat-warn');
        slideshowWrap.style.animationPlayState = 'paused';
        document.getElementById('slideshow_wrapper_hidden').style.animationPlayState = 'paused';
        document.getElementById('slideshow_panel_controls_play').innerHTML = SVG_PLAY;
    }
    else {
        const slideshowWrapHidden = document.getElementById('slideshow_wrapper_hidden');
        slideshowStatus.innerHTML = 'AUTO';
        slideshowStatus.classList.remove('btn-flat-warn');
        slideshowStatus.classList.add('btn-flat-info');
        slideshowWrap.classList.add('cell-group-scroll');
        slideshowWrap.style = '';
        slideshowWrapHidden.classList.add('cell-group-scroll');
        slideshowWrapHidden.style = '';
        document.getElementById('slideshow_panel_controls_play').innerHTML = SVG_PAUSE;
    }
    return;
}

function displayRSS(event, hide) {
    const streamClassName = event.getAttribute('streamClassName');
    let dom = document.getElementsByClassName(streamClassName);

    if(hide) {
        event.innerHTML = SVG_TOGGLE_DISABLED;
        event.setAttribute('onclick', 'displayRSS(this, false)');
    }
    else {
        event.innerHTML = SVG_TOGGLE_ENABLED;
        event.setAttribute('onclick', 'displayRSS(this, true)');
    }

    for(let i = 0; i < dom.length; i++) {
        if(hide) {
            dom[i].parentNode.classList.add(hideDomClass);
        }
        else {
            dom[i].parentNode.classList.remove(hideDomClass);
        }
    }
    return;
}

function displayActivity(event, hide) {
    let i = 0, j = 0;
    const activityClassName = event.getAttribute('activityClassName');
    let dom = document.getElementsByClassName(activityClassName);
    if(dom.length > 0) {
        let activityList = dom[0].parentNode.children;
        const activityFilterLabel = event.textContent;

        for(i = 0; i < dom.length; i++) {
            if(hide) {
                dom[i].classList.add(hideDomClass);
            }
            else {
                dom[i].classList.remove(hideDomClass);
            }
        }

        for(i = 0; i < activityList.length; i++) {
            if(!activityList[i].classList.contains(hideDomClass)) {
                activityList[i].className = activityList[i].className.replace(leaderboardsRecordDarkClass,'')
                                                                    .replace(leaderboardsRecordLightClass,'');
                activityList[i].classList.add(getTableRowBGColor(j));
                j++;
            }
        }

        if(hide) {
            event.innerHTML = SVG_TOGGLE_DISABLED+activityFilterLabel;
            event.setAttribute('onclick', 'displayActivity(this, false)');
        }
        else {
            event.innerHTML = SVG_TOGGLE_ENABLED+activityFilterLabel;
            event.setAttribute('onclick', 'displayActivity(this, true)');
        }
    }

    return;
}

function formatRSS(rssObj, limit, headlinesOnly = false) {
    let rssFeedCollection = new Array();
    for(let i = 0; i < rssObj.length; i++) {
        const rssTitle = rssObj[i].title;
        const rssItems = rssObj[i].items;

        for(let j = 0; j < rssItems.length; j++) {
            const rssHeadline = rssItems[j].title;
            const rssHTML = rssItems[j].content_html;
            const rssTimestamp = convertTime(rssItems[j].date_published, 'timestamp');
            const rssDate = convertTime(rssTimestamp);
            const rssContent = (headlinesOnly ? '<a href="'+rssItems[j].url+'">['+rssObj[i].title+'] '+rssHeadline+'</a>' :
                '<div class="info-panel-rss-post '+feedNameToClass(rssTitle)+'">'+
                    '<a class="btn-flat btn-flat-custom-'+i+'" href="'+rssObj[i].home_page_url+'" style="margin-bottom:1em">'+rssTitle+'</a>'+
                    '<a class="btn-flat" href="'+rssItems[j].url+'" style="margin-bottom:1em">'+rssHeadline+'</a>'+
                    '<span class="btn-flat">'+rssDate+'</span>'+rssHTML+
                '</div>');

            if(i > 0) {
                let rssOrdered = false;
                for(let k = 0; k < rssFeedCollection.length; k++) {
                    const rssFCT = rssFeedCollection[k][1];
                    if(rssTimestamp >= rssFCT) {
                        rssFeedCollection.splice(k, 0, [rssContent, rssTimestamp]);
                        rssOrdered = true;
                        break;
                    }
                }

                if(rssOrdered) {
                    continue;
                }
            }

            rssFeedCollection.push([rssContent, rssTimestamp]);
        }
    }

    if(rssFeedCollection.length > 0) {
        let output = rssFeedCollection.map(column => column[0]);
        if(limit > 0) {
            return output.slice(0,limit).join('');
        }
        return output.join('');
    }

    return 'No recent posts.';
}

function feedNameToClass(name) {
    return name.toLowerCase().replaceAll(' ','-').trim()+'-feed';
}

function changeStyleCSS(event = false) {
    let mode = 'dark';
    if(event) {
        if(!event.checked) {
            mode = 'light';
        }
    }
    else {
        const savedPref = localStorage.getItem(lsiTheme);
        if(savedPref) {
            mode = savedPref;
        }
    }

    let stylesheet = document.getElementById('theme');
    if(stylesheet) {
        let href = stylesheet.href.split('/');
        href[href.length-1] = (mode === 'light' ? 'themelight.css' : 'themedark.css');
        stylesheet.href = href.join('/');
        localStorage.setItem(lsiTheme, mode);
    }

    return;
}

function changeAutoRefresh(event) {
    let autorefresh = 0;
    if(event) {
        if(event.checked) {
            autorefresh = 1;
        }
    }
    else {
        const savedPref = localStorage.getItem(lsiAutoRefresh);
        if(savedPref) {
            autorefresh = parseInt(savedPref) || 0;
        }
    }

    let preview = document.getElementById('info_panel_settings_autorefresh_preview');
    if(preview) {
        if(autorefresh > 0) {
            preview.src = preview.src.replace('_off.', '_on.');
        }
        else {
            preview.src = preview.src.replace('_on.', '_off.');
        }
    }

    if(autorefresh > 0) {
        autoRefresh();
    }
    else {
        clearTimeout(autoRefreshTimeout);
        autoRefreshTimeout = null;
    }
    localStorage.setItem(lsiAutoRefresh, autorefresh);
    return;
}

function initCheckbox(domId, varIndex, checkValue, toBtn = {btnY: false, btnN: false}) {
    const lsi = localStorage.getItem(varIndex);
    if(lsi) {
        let dom = document.getElementById(domId);
        if(dom) {
            if(lsi === checkValue) {
                dom.checked = true;
            }
            else {
                dom.checked = false;
            }

            if(toBtn.btnY && toBtn.btnN) {
                let chkLabel = document.getElementById(domId+'_label');
                if(chkLabel) {
                    chkLabel.innerHTML = (dom.checked ? toBtn.btnY : toBtn.btnN);
                }
            }
        }
    }

    return;
}