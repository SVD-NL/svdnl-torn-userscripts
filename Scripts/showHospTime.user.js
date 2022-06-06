// ==UserScript==
// @name         Show time left in hospital
// @version      1.0
// @downloadURL  https://github.com/SVD-NL/svdnl-torn-userscripts/raw/main/Scripts/showHospTime.user.js
// @updateURL    https://github.com/SVD-NL/svdnl-torn-userscripts/raw/main/Scripts/showHospTime.user.js
// @description  Change status to time left in hospital on faction pages. Does not use the Torn API.
// @author       SVD_NL [2363978]
// @run-at       document-end
// @match        https://www.torn.com/factions.php?step=*
// @grant        none
// ==/UserScript==

/*CAVEATS:
    1. It will only be able to add the timer to war pages for members of the faction you are currently on.
    2. It will not detect players medding out on the info pages. It will on war pages (if the underlying page properly refreshes).
*/

(function() {
    const addHospTime = function() {
        const hospedUsers = [];
        const memberRows = $('ul.table-body').children('li.table-row');
        if(memberRows.length === 0) {
            return;
        }
        clearInterval(mainInterval);
        memberRows.each(function() {
            let userId, countdownDate, element, secondsLeft;
            $(this).find('li[title^="<b>Hospital"]').each(function() {
                secondsLeft = $(this).attr('title').match(/(?<=data-time=')\d*/);
            });
            if (typeof secondsLeft === 'object') {
                countdownDate = new Date;
                countdownDate.setSeconds(countdownDate.getSeconds() + parseInt(secondsLeft[0]));
                $(this).find('div.table-cell.status > span').each(function() {
                    $(this).parent().parent().find('div[class^="userInfoBox"]').each(function() {
                        userId = $(this).children().first().attr('id').match(/^\d*/)[0];
                    });
                    element = $(this);
                    hospedUsers.push({
                        userId: userId,
                        countdownDate: countdownDate,
                        element: element,
                    });
                });
            }
        });
        for (let i = 0; i < hospedUsers.length; i++) {
            setInterval(function() { hospTimer(hospedUsers[i].element, hospedUsers[i].countdownDate); }, 1000);
        }
        if (hospedUsers.length > 0) {
            const warList = $('ul.f-war-list.war-new');
            const noActiveWar = warList.find('div[class^=rankBox]').length === 0;
            if(noActiveWar) {
                console.log('no war')
                return;
            }
            const warMembersInterval = setInterval(function(){
                const warElement = warList.children('li.descriptions');
                if (warElement.length === 0) {
                    return;
                }
                clearInterval(warMembersInterval);
                for (let i = 0; i < hospedUsers.length; i++) {
                    warElement.find(`div[id^=${hospedUsers[i].userId}]`).each(function() {
                        $(this).parentsUntil('ul').find('div.status').each(function() {
                            const element = $(this)
                            setInterval(function() { hospTimer(element, hospedUsers[i].countdownDate); }, 1000);
                        });
                    });
                }
            }, 1000);
        }
    }
    //Check the page for loaded member list every second
    const mainInterval = setInterval(addHospTime, 1000);

    const hospTimer = function(element, countdownDate) {
        if(element.text() === 'Okay'){
            return;
        }
        const now = new Date();
        const timeLeft = countdownDate.getTime() - now.getTime();
        if(timeLeft <= 0) {
            element.text('Okay');
            if(element.hasClass('t-red')) {
                element.removeClass('t-red');
                element.addClass('t-green');
            } else if (element.hasClass('not-ok')) {
                element.removeClass('not-ok');
                element.addClass('ok');
            }
            return;
        }
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = zeroPad(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),2);
        const seconds = zeroPad(Math.floor((timeLeft % (1000 * 60)) / 1000),2);
        const timer = `${hours}:${minutes}:${seconds}`
        element.text(timer);
    }

    const zeroPad = function(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

})();
