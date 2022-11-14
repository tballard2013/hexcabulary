import { randomLetter } from "./random-letter.js";
import { svg } from "./svg.js";

export function drawBoard(that) {
    let html = '';
    let y = 0, x = 0;
    // let xx = 94, yy = 49;
    let xx = that.size - 6;
    let yy = that.size / 2 - 2;
    let styles = document.styleSheets[0];
    let data = JSON.parse(JSON.stringify(that.gameData || {}));
    let ROWS = that.gameData.rows || 10;
    let COLUMNS = that.gameData.columns || 10;

    // store with data (in case we're generating the data here, we need to persist it)
    data.rows = ROWS;
    data.columns = COLUMNS;
    
    for (let row = ROWS; row > 0; row--) {
        x = row % 2 ? 0 : (0 + xx / 2)
        for (let column = COLUMNS; column > 0; column--) {
            x += xx;
            let name = `cell-${column},${row}`;
            let cell = that.gameData[name];
            let letter = (cell && cell.letter) || randomLetter();
            html += `
                <div 
                    class="cell slow-reveal" 
                    id="${name}"
                    data-letter="${letter}"
                    style="
                        top: ${y}px; left: ${x}px; 
                        animation-duration: ${(Math.random() * 1.5) + .05}s;
                    "
                ><div class="click-zone"
                    data-editable="true"
                    data-id="${name}"
                    data-column = "${column}"
                    data-row = "${row}"
                    data-letter="${letter}"
                    onclick="${that.me}.handleClick(event)"
                >${letter}</div
                ></div>
            `;
            data[name] = {
                letter: letter,
                // TODO: is this part of a word?
            }
        }
        y += yy;
    }

    // html = `<div style="position:relative; left: -5%; outline: 1px red solid;">${html}</div>`;
    that.gameData = JSON.parse(JSON.stringify(data));
    that.el.innerHTML = html;

    // start play?
    if (that.gameData.mode !== 'play') {
        that.el.classList.add('paused'); 
    } else {
        that.play();
    }

    // wordlist
    let e2 = document.createElement('div');
    e2.innerHTML = drawWordList();
    that.el.appendChild(e2);
    calculateCellReuse();

    function drawWordList() {
        let html = '<div id="wordlist-container" class="wordlist">'
        const words = that.gameData.words || ['missing word list'];
        words.forEach(word => {
            html += `<div 
                        id="wordlist-${word.word}"
                        data-value="wordlist-${word.word}"
                        data-name="wordlist-${word.word}"
                        data-editable="true"
                        onclick="${that.me}.handleClick(event)"
                    >${word.hint || word.word}</div>`
        })
        html += '</div>';
        return html;
    }

    function calculateCellReuse() {
        // build map of reused cells one time (we need this to avoid hiding cells/letters that are shared... until
        // the last use case/reference count goes to zero)
        if (that.gameData.hasCalculatedCellUsageCounts === undefined) {
            that.gameData.words.forEach(word => {
                word.coords.forEach(coord => {
                    if (that.gameData[coord].usedBy === undefined) {
                        that.gameData[coord].usedBy = []; 
                    }
                    that.gameData[coord].usedBy.push(word.word);
                })
            })
            that.gameData.hasCalculatedCellUsageCounts = true;
        }
    }
}
