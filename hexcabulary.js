import { svg } from './hex-library/svg.js';
import { addMenu } from './hex-library/add-menu.js';
import { generateCSSClasses } from './hex-library/generate-css-classes.js';
import { drawBoard } from './hex-library/draw-board.js';
import {log} from './hex-library/log.js';

export default class Hexcabulary {
    constructor(myInstanceName, data = {}) {
        this.size = 80;
        this.unit = 'px';
        this.el = document.getElementById(myInstanceName); // reference DOM element where to inject the game
        this.el.classList.add('hexcabulary-enclosure')
        this.me = myInstanceName;
        this.gameData = data;
        this.isPlaying = false;
        this.isEditMode = false;
    
        generateCSSClasses(this.size, this.unit);
        drawBoard(this);
        this.el.appendChild(addMenu(this));
    }

    dataToUri(gameData) {
        // TODO: need to revisit this was a tiny url generator... the game data can be way too long for a url.
        return '';

        console.log('gameData: ', gameData);
        let data = encodeURIComponent(JSON.stringify(gameData));
        let url = location.protocol + '://' + location.host + '/hexcabulary?' + data;
        return url;
    }
    
    play() {
        this.isEditMode = false;
        this.isPlaying = true;
        this.gameData.startTime = new Date().getTime();
        this.el.classList.remove('paused'); 
        this.el.classList.remove('edit-mode'); 
        if (this.editButton) {
            this.editButton.classList.remove('edit-mode');
        }
    }

    handleClick(ev) {
        const evEl = ev.srcElement;
        const action = evEl.value || evEl.getAttribute('data-value');
        switch(action) {

            // handle button clicks
            case 'Generate Random':
                // clear the old UI, repurpose it's container and create a new instance with X and Y
                let xy = prompt('Columns, Rows: ', '10,10');
                let v = xy.split(',');
                this.el.innerHTML = `Generating ${v[0]} x ${v[1]} grid...`;
                const $name = 'game' + new Date().getTime();
                this.el.id = $name;
                setTimeout(() => {
                    window[$name] = new Hexcabulary($name, { columns: v[0], rows: v[1] });
                }, 500);
                return;
            case 'Reset':
                location.reload();
                return;
            case 'Edit':
                this.isEditMode = true;
                this.el.classList.add('edit-mode');
                this.el.classList.remove('paused'); 
                this.editButton = evEl;
                this.editButton.classList.add('edit-mode');
                return;
            case 'Play':
                this.play();
                return;
            case 'Export':
                // clean up the game data to export
                let newGameData = { ...this.gameData };
                delete newGameData['hasCalculatedCellUsageCounts'];
                delete newGameData['startTime'];
                // TODO: we should probably also remove all the "usedBy" added during draw board (not needed for edit)
                console.log(`
===================================================
To use this board data in a game...


<div id="myGame"><!-- game will appear here --></div>
<script type="module">
import Hexcabulary from '/hexcabulary.js';
const $boardData = ${JSON.stringify(newGameData, '', 4)};
const $instance = 'myGame';
document[$instance] = new Hexcabulary($instance, $boardData);
</script>


Or, play it remotely using this link...
${this.dataToUri(this.gameData)}
===================================================
                `);
                alert(`See console.`);
                return;

            // handle game board clicks
            default:
                console.log(`action is ${action}, isEditMode? ${this.isEditMode}`);
                if (this.isEditMode) {
                    let el;
                    if (action && action.match(/wordlist/)) {
                        // edit word list item (or add wordlist item)
                        el = evEl;
                        el.contentEditable = true;
                        el.onblur = (e) => {
                            console.log('blurred wordlist edit', e);
                        }
                    
                    } else {
                        // edit cell
                        console.log('el = ', evEl);
                        let column = evEl.dataset['column'];
                        let row = evEl.dataset['row'];
                        let name = `cell-${column},${row}`;
                        el = document.querySelector(`[data-id="${name}"]`);
                        el.contentEditable = true;
                        el.onblur = (e) => {
                            console.log(`updating ${name} to ${e.srcElement.textContent}`);
                            this.gameData[name].letter = e.srcElement.textContent;
                        };
                    }

                    let range = document.createRange();
                    range.selectNodeContents(el);
                    let sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);

                    el.focus();
                    return;
                }

                if (action && action.match(/wordlist/)) {
                    return this.showLetterHint(action); 
                }

                if (!this.isPlaying) {
                    return;
                }

                // regular game play click...
                let el = ev.srcElement.parentNode;
                log(el); // help debugging word list
                if (el.classList.contains('fullWordFound')) {
                    log('already found, do nothing', el);
                } else if (el.classList.contains('sharedLetterClicked')) {
                    log('shared letter cannot be unselected once clicked');
                } else {
                    el.classList.toggle('clicked');

                    this.checkWorkCompleted(el);
                }
        }
        
    }

    checkWorkCompleted(el) {
        // scan for completed letters, words, and win/lose

        const cell = el.getAttribute('id');
        const letter = el.getAttribute('data-letter');
        const isClicked = el.classList.contains('clicked');

        if (this.gameData.clicks === undefined) this.gameData.clicks = 0;
        this.gameData.clicks += 1;
        // TODO: game over if level is hard and out of clicks.

        this.gameData[cell].isClicked = isClicked;

        let allWordsFound = true; // assume all found unless we discover otherwise
        this.gameData.words.forEach( word => {
            let allLettersInWordFound = true;

            word.coords.forEach( coord => {
                if (!this.gameData[coord].isClicked) {
                    allLettersInWordFound = allWordsFound = false;
                }
            })

            const el = document.getElementById(`wordlist-${word.word}`);
            if (allLettersInWordFound) {
                el.classList.add('found-word');
                this.clearCells(word);
            } else {
                el.classList.remove('found-word');
            }
        });

        if (allWordsFound) {
            console.log('WIN!')
            this.handleWin();
        } else {

        }

    }

    showLetterHint(search) {
        // find the word in the data store
        // pick a letter in the word
        // flash the cell where the letter is briefly
        // reduce the score by the cost of the hint (or add the penalty)
       
        const _word = search.replace(/wordlist-/, ''); // pull "wordlist-" off the front.
        const letter = _word.charAt(Math.random() * _word.length);
        const letterIndex = Math.floor(Math.random() * _word.length);
        const data = this.gameData.words.filter(word => word.word == _word);
        const cell = data[0].coords[letterIndex];
        const el = document.querySelector(`[data-id="${cell}"]`).parentNode;
        
        el.classList.add('hint');
        
        setTimeout(() => {
            el.classList.remove('hint');
        }, 1000);
    }

    handleWin() {
        // show score, clicks, time
        // hide the rest of the board (reveal whatever is under it... if we're doing this as a puzzle)
        this.isPlaying = false;
        const el = document.getElementById('wordlist-container');
        el.innerHTML = `
            <h1>You Win</h1>
            <ul style="margin:0; padding: 0;">
                <li>Clicks: ${this.gameData.clicks}
                <li>Time: ${(new Date().getTime() - this.gameData.startTime) / 1000} seconds
            </ul>
            <center>
                <button onclick="location.reload();">Play Again?</button>
            </center>
        `;
    }

    clearCells(word) {
        if (word.hasBeenCleared) {
            // avoids hiding letters from cells which are shared by multiple words
            return;
        } else {
            // hide the cells for completed words
            word.coords.forEach( coord => {
                // if all references to the current cell are marked, remove it
                const el = document.getElementById(coord);

                // cells with letters shared by more than one word stick around until the last usage.
                if (this.gameData[coord].usedBy.length > 1) {
                    // remove the current word from shared list (reducing the reference count)
                    const arr = this.gameData[coord].usedBy;
                    this.gameData[coord].usedBy = arr.filter(str => str !== word.word);

                    // disable the cell selection (to avoid reintroducing the cleared words for shared letters)
                    el.classList.add('sharedLetterClicked');
                } else {
                    el.classList.add('slow-out');
                    el.classList.add('fullWordFound');
                    word.hasBeenCleared = true;
                }
            });
        }
    }

}
