// ==UserScript==
// @name         Show time left in hospital
// @version      0.2
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
            let secondsLeft = '';
            $(this).find('li[title^="<b>Hospital"]').each(function() {
                secondsLeft = $(this).attr('title').match(/(?<=data-time=')\d*/);
            });
            if (typeof secondsLeft === 'object') {
                const countdownDate = new Date;
                countdownDate.setSeconds(countdownDate.getSeconds() + parseInt(secondsLeft[0]));
                $(this).find('div.table-cell.status > span').each(function() {
                    const element = $(this)
                    setInterval(function() { hospTimer(element, countdownDate); }, 1000);
                });
            }
        });
    }
    setTimeout(addHospTime, 3000)

    const hospTimer = function(element,countdownDate) {
        console.log(element);
        const now = new Date();
        const timeLeft = countdownDate.getTime() - now.getTime();
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