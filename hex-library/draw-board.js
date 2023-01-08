import { buildWordListHTML } from "./draw-wordlist.js";
import { randomLetter } from "./random-letter.js";
import { svg } from "./svg.js";

export function drawBoard(that) {
    let html = '';
    let y = 0, x = 0;
    // let xx = 94, yy = 49;
    let xx = that.size - 6;
    let yy = that.size / 2 - 2;
    let boardEnclosureLeft = xx * -1; // trying to help centering effect with the hex offset
    let styles = document.styleSheets[0];
    let data = JSON.parse(JSON.stringify(that.gameData || {}));
    let ROWS = that.gameData.rows || 10;
    let COLUMNS = that.gameData.columns || 10;
    let boardHeight = yy * ROWS;

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

            // support empty cells (',') and holes ('.') in the board 
            let isClickable = (letter !== ',' && letter !== '.');
            let isHole = letter === '.';

            // "." means don't draw the cell (leaves a hole in the board)
            html += `<div 
                    class="${!isHole ? 'cell slow-reveal' : '' }" 
                    id="${name}"
                    data-letter="${letter}"
                    style="
                        top: ${y}px; left: ${x}px; 
                        ${!isHole ? `animation-duration: ${(Math.random() * 1.5) + .05}s;`:''}
                    "
                ><div 
                    class="${isClickable ? 'click-zone' : ''}"
                    data-editable="true"
                    data-id="${name}"
                    data-column = "${column}"
                    data-row = "${row}"
                    data-letter="${letter}"
                    ${isClickable ? `onclick="${that.me}.handleClick(event)"` : 'data-clickable="false"'}
                >${(!isHole && isClickable) ? letter : `${isClickable ? '=' : ' '}`}</div
                ></div>`;
            data[name] = {
                letter: letter,
                // TODO: is this part of a word?
            }
        }
        y += yy;
    }

    html += buildWordListHTML(that);

    html = `<div style="
        position:relative; 
        left: ${boardEnclosureLeft}px;
        width: ${COLUMNS * that.size}px;
        margin: auto;
        height: 100vh;
    ">${html}</div>`;
    that.gameData = JSON.parse(JSON.stringify(data));
    that.el.innerHTML = html;

    document.addEventListener('DOMContentLoaded', function() {
        that.el.classList.add('reveal-board');
     });

    // start play? (TODO: revisit... clean up paused?)
    // if (that.gameData.mode !== 'play') {
    //     that.el.classList.add('paused'); 
    // } else {
        that.play();
    // }

    calculateCellReuse();

    function calculateCellReuse() {
        // build map of reused cells one time (we need this to avoid hiding cells/letters that are shared... until
        // the last use case/reference count goes to zero)
        // if (that.gameData.hasCalculatedCellUsageCounts === undefined) {
        if (that.gameDataExtraInfo === undefined) {
            that.gameDataExtraInfo = {}; // don't want to store these with "export" default game data after edit.
                                         // instead, we discover these during board draw, and use when clearing cells
            that.gameData.words.forEach(word => {
                word.coords.forEach(coord => {
                    if (that.gameDataExtraInfo[coord] === undefined) {
                        that.gameDataExtraInfo[coord] = {};
                    }

                    // if (that.gameData[coord].usedBy === undefined) {
                    if (that.gameDataExtraInfo[coord].usedBy === undefined) {
                        that.gameDataExtraInfo[coord].usedBy = []; 
                    }
                    that.gameDataExtraInfo[coord].usedBy.push(word.word);
                })
            })
            that.gameData.hasCalculatedCellUsageCounts = true;
        }
    }
}
