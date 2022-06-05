// ==UserScript==
// @name         Show time left in hospital
// @version      0.4
// @downloadURL  https://github.com/SVD-NL/svdnl-torn-userscripts/raw/main/Scripts/showHospTime.user.js
// @updateURL    https://github.com/SVD-NL/svdnl-torn-userscripts/raw/main/Scripts/showHospTime.user.js
// @description  Add time left in hospital to faction page
// @author       SVD_NL [2363978]
// @run-at       document-end
// @match        https://www.torn.com/factions.php?step=*
// @grant        none
// ==/UserScript==

(function() {
    const addHospTime = function() {
        $('ul.table-body').find('li.table-row').each(function() {
            if($(this)) {
                clearInterval(mainInterval);
            }
            let secondsLeft = '';
            let userId = '';
            $(this).find('li[title^="<b>Hospital"]').each(function() {
                secondsLeft = $(this).attr('title').match(/(?<=data-time=')\d*/);
            });
            if (typeof secondsLeft === 'object') {
                const countdownDate = new Date;
                countdownDate.setSeconds(countdownDate.getSeconds() + parseInt(secondsLeft[0]));
                $(this).find('div.table-cell.status > span').each(function() {
                    $(this).parent().parent().find('div[class^="userInfoBox"]').each(function() {
                        userId = $(this).children().first().attr('id').match(/^\d*/)[0];
                    });
                    const infoElement = $(this);
                    setInterval(function() { hospTimer(infoElement, countdownDate); }, 1000);
                    const checkWarInterval = setInterval(function() {
                        infoElement.parents().find('div#react-root').each(function() {
                            $(this).find('ul.f-war-list.war-new').each(function() {
                                $(this).find(`div[id^=${userId}]`).each(function() {
                                    if($(this)) {
                                        clearInterval(checkWarInterval);
                                    }
                                    $(this).parentsUntil('ul').find('div.status').each(function() {
                                        const warElement = $(this)
                                        setInterval(function() { hospTimer(warElement, countdownDate); }, 1000);
                                    });
                                });
                            });
                        });
                    }, 2500);
                });
            }
        });
    }
    const mainInterval = setInterval(addHospTime, 1000)

    const hospTimer = function(element,countdownDate) {
        if(element.text() === 'Okay'){
            return;
        }
        const now = new Date();
        const timeLeft = countdownDate.getTime() - now.getTime();
        if(timeLeft <= 0) {
            element.text('Okay');
            element.removeClass('t-red');
            element.addClass('t-green');
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
