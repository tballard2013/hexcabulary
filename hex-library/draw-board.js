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
                    class="cell" 
                    id="${name}"
                    style="top: ${y}px; left: ${x}px;"
                ><div class="click-zone"
                    data-id="${name}"
                    data-column = "${column}"
                    data-row = "${row}"
                    onclick="${that.me}.handleClick(event)"
                >${letter}</div
                ></div>
            `;
            data[`cell-${column},${row}`] = {
                letter: letter,
                // TODO: is this part of a word?
            }
        }
        y += yy;
    }

    
    // html = `<div style="position:relative; left: -5%; outline: 1px red solid;">${html}</div>`;
    that.gameData = JSON.parse(JSON.stringify(data));
    that.el.classList.add('paused'); 
    that.el.innerHTML = html;
}