// ==UserScript==
// @name         Show time left in hospital
// @version      0.1
// @downloadURL  https://github.com/SVD-NL/svdnl-torn-userscripts/tree/main/showHospTime.user.js
// @updateURL    https://github.com/SVD-NL/svdnl-torn-userscripts/tree/main/showHospTime.user.js
// @description  Add time left in hospital to faction page
// @author       SVD_NL [2363978]
// @run-at       document-end
// @match        https://www.torn.com/factions.php?step=*
// @grant        none
// ==/UserScript==


//TODO: Use the seconds parameter and make it count down
(function() {
    const addHospTime = function() {
        $('ul.table-body').find('li.table-row').each(function() {
            let timeLeft = '';
            $(this).find('li[title^="<b>Hospital"]').each(function() {
                timeLeft = $(this).attr('title').match(/\d{2}:\d{2}:\d{2}/);
            });
            if (typeof timeLeft === 'object') {
                $(this).find('div.table-cell.status > span').each(function() {
                    $(this).text(timeLeft[0]);
                });
            }
        });
    }
    setTimeout(addHospTime, 5000)
    //setInterval(addHospTime, 1000)
})();
