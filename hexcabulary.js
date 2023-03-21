import { svg } from './hex-library/svg.js';
import { addMenu } from './hex-library/add-menu.js';
import { generateCSSClasses } from './hex-library/generate-css-classes.js';
import { drawBoard } from './hex-library/draw-board.js';
import { buildWordListHTML, buildWordsHTML } from "/hex-library/draw-wordlist.js";
import { showLetterHint } from '/hex-library/show-letter-hint.js';
import {log} from './hex-library/log.js';

export default class Hexcabulary {
    constructor(myInstanceName, data = {}) {
        this.debug = data.debug; 
        this.size = 80;
        this.unit = 'px';
        this.el = document.getElementById(myInstanceName); // reference DOM element where to inject the game
        this.el.classList.add('hexcabulary-enclosure')
        this.me = myInstanceName;
        this.gameData = data;
        this.isPlaying = false;
        this.isEditMode = false;
        this.el.style.visibility = 'hidden'; // start hidden
        this.gameType = data.gameType || 'default';
        this.difficulty = Math.floor(data.difficulty || 1);
    
        generateCSSClasses(this.size, this.unit);

        if (this.gameType === 'single-random') {
            this.pickAndHideWord(this);
        }

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

    pickAndHideWord(that) {
        // figure out the word and hide strategy before drawing the board

        // pick a random word from the list
        const words = [...that.gameData.words];
        const rnd = Math.floor(Math.random() * words.length);
        let _words = [words[rnd]];
        let _word = _words[0].word; 

        // find the first non-vowel in the word
        // start letter hunt from the back of the string
        let guardLetter = _word.split('').reverse().join('').match(/[BCDFGHJKLMNPQRSTVWXZ]/)[0]; 
        that.gameData.guardLetter = guardLetter;

        // hide it using an algorithm
        // first letter...
        let columns = that.gameData.columns;
        let rows = that.gameData.rows;
        let len = _word.length;
        let wx = Math.floor(Math.random() * columns) + 1;
        let wy = Math.floor(Math.random() * that.gameData.rows) + 1;
        let xx = 0, yy = 0;
        let direction = Math.floor(Math.random() * 6) + 1;

        // difficulty 1 - linear (left or right only), no boundary-cross
        if (that.difficulty < 4) {
            // error case: the word can't be longer than the cols or rows available
            // this shouldn't happen in the edit builder, but a manual code change could introduce it.
            if (len > columns) {
                this.messageUser(`
                    The word "${_word}" is longer than the ${columns} columns/spaces available for hiding it.
                    <br><br>This puzzle's author might need to fix (i.e. shorten words or add columns). 
                `, this.el, 'error');
            }

            if (that.difficulty === 1) {
                // hide word horizontally, left or right
                if (direction >= 3) {
                    direction = 1;
                    xx = -1;
                    if (wx - len < 1) wx = len;
                }
                else {
                    direction = 4;
                    xx = 1;
                    if (wx + len > columns) wx = (columns - len === 0 ? 1 : columns - len);
                }
            } else if (that.difficulty === 2 || that.difficulty === 3) {
                // hide word diagonally or horizontally, but don't cross boundary
                let owx = wx, owy = wy;
                switch(direction) {
                    case 1:
                        // right, no wrap
                        xx = -1; yy =0;
                        if (wx - len < 1) {
                            if (that.difficulty === 2) wx = len;
                        }
                        break;
                    case 2:
                        // right, down, no wrap
                        xx = -1;
                        if (wx - len < 1) {
                            if (that.difficulty === 2) wx = len;
                        }
                        yy = -1;
                        if (wy - len < 1) {
                            if (that.difficulty === 2) wy = len;
                        }
                        break;
                    case 3:
                        // left, down, no wrap
                        xx = 1; 
                        if (wx + len > columns) {
                            if (that.difficulty === 2) wx = columns - len;
                        }
                        yy = -1;
                        if (wy - len < 1) {
                            if (that.difficulty === 2) wy = len;
                        }
                        break;
                    case 4:
                        xx = 1;
                        if (wx + len > columns) {
                            if (that.difficulty === 2) wx = columns - len + 1;
                        }
                        yy = 0;
                        break;
                    case 5:
                        xx = 1; 
                        if (wx + len > columns) {
                            if (that.difficulty === 2) wx = columns - len + 1;
                        }
                        yy = 1;
                        if (wy + len > rows) {
                            if (that.difficulty === 2) wy = rows - len + 1;
                        }
                        break;
                    case 6:
                        xx = -1; 
                        if (wx - len < 1) {
                            if (that.difficulty === 2) wx = len;
                        }
                        yy = 1;
                        if (wy + len > rows) {
                            if (that.difficulty === 2) wy = rows - len + 1;
                        }
                        break;
                }
            }
            // console.log(`difficulty: ${that.difficulty}, dir: ${direction}, xx: ${xx}, yy: ${yy}, wx: ${wx}, wy: ${wy}, cols: ${columns}, rows: ${rows}`);
        }

        _words[0].coords = [];
        let word = _words[0].word;
        word.split('').forEach((letter, i) => {
            const name = `cell-${wx},${wy}`;
            // console.log(letter, i, name);
            _words[0].coords.push(name);
            that.gameData[name] = {letter: letter};
            if (
                direction === 1
                || (
                    (direction === 2 || direction === 6)
                    && !(wy % 2) /* every other row requires x to increment in the hex layout */
                )
                || (
                    (direction === 3 || direction === 5)
                    && (wy % 2) /* every other row requires x to increment in the hex layout */
                )
                || direction === 4
            ) {
                wx += xx; 
                if (wx > that.gameData.columns) { wx = 1; }
                else if (wx < 1) { wx = that.gameData.rows; }
            }
            wy += yy; 
            if (wy > that.gameData.rows) { wy = 1; }
            else if (wy < 1) { wy = that.gameData.columns; }
        })

        that.gameData.allWords = [...that.gameData.words];
        that.gameData.words = [..._words];

        // TODO: revisit and make non-mutating (?)
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
                    setTimeout(() => {
                        dispatchEvent(new HashChangeEvent("hashchange"));
                    }, 1000);
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
                this.highlightAllWordCells();
                return;
            case 'Play':
                location.hash = '';
                this.play();
                return;
            case 'New Word':
                let word = prompt('Enter new word');
                if (word) {
                    this.gameData.words.unshift({word, hint: '', coords: []});
                    let el = document.querySelector('#wordlist-container');
                    let html = buildWordsHTML(this);
                    el.innerHTML = html;
                }
                return;
            case 'Export':
                // clean up the game data to export
                console.clear();
                let newGameData = { ...this.gameData };
                delete newGameData['hasCalculatedCellUsageCounts'];
                delete newGameData['startTime'];
                // TODO: we should probably also remove all the "usedBy" added during draw board (not needed for edit)
                let sourceCode = `
<div id="myGame"><!-- game will appear here --></div>
<script type="module">
import Hexcabulary from '/hexcabulary.js';
const $boardData = ${JSON.stringify(newGameData, '', 4)};
const $instance = 'myGame';
document[$instance] = new Hexcabulary($instance, $boardData);
</script>
`;
                console.log(`
===================================================
To use this board data in a game...


${sourceCode}


Or, play it remotely using this link...
${this.dataToUri(this.gameData)}
===================================================
                `);
                alert(`See console.`);
                return;

            // handle game board clicks
            default:
                // console.log(`action is ${action}, isEditMode? ${this.isEditMode}`);
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
                        let column = evEl.dataset['column'];
                        let row = evEl.dataset['row'];
                        let name = `cell-${column},${row}`;
                        el = document.querySelector(`[data-id="${name}"]`);

                        if (window.event.ctrlKey) {
                            //ctrl was held down during the click
                            if (this.gameDataExtraInfo === undefined) {
                                this.gameDataExtraInfo = {};
                            }
                            if (this.gameDataExtraInfo.editWord === undefined) {
                                this.gameDataExtraInfo.editWord = {
                                    word: '',
                                    coords: [] // ['cell-3,5', 'cell-2,5', 'cell-1,5'],
                                };
                            }
                            if (this.gameDataExtraInfo.editWord.coords === undefined) {
                                this.gameDataExtraInfo.editWord.coords = [];
                            }
                            console.log(`adding cell ${column},${row} to word containing ${this.gameData[name].letter}`);
                            el.classList.add('edit-word-select');
                            this.gameDataExtraInfo.editWord.word += this.gameData[name].letter;
                            this.gameDataExtraInfo.editWord.coords.push(`cell-${column},${row}`);
                        } else {
                            // console.log('this.gameDataExtraInfo=', this.gameDataExtraInfo);
                            if (this.gameDataExtraInfo.editWord !== undefined) {
                                // if ctrl key is up, and we've been accumulating word data... 
                                // show the accumulated value, so we can manually copy it to the data list (TODO automate this)
                                // then clear it in prep for the next word selection sequence (CTRL+CLICK)
                                console.log('CLEARING WORD BUFFER: ', JSON.stringify(this.gameDataExtraInfo.editWord, null, 4));
                                this.gameData.words.unshift(this.gameDataExtraInfo.editWord);
                                let oldEl = document.querySelector('#wordlist-container');
                                let newEl = document.createElement('div');
                                    newEl.innerHTML = buildWordListHTML(this);
                                oldEl.parentElement.replaceChild(newEl, oldEl);
                                delete this.gameDataExtraInfo.editWord;
                                document.querySelectorAll('.edit-word-select')
                                    .forEach(e => e.classList.remove('edit-word-select'));
                            } 
                            else {
                                console.log('cell edit: ', evEl);
                            }

                        }

                        el.contentEditable = true;
                        el.onblur = (e) => {
                            if (this.gameData[name].letter !== e.srcElement.textContent) {
                                console.log(`updating ${name} to ${e.srcElement.textContent}`);
                                this.gameData[name].letter = e.srcElement.textContent;
                                e.srcElement.classList.add('edit-changed');
                            }
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
                    return showLetterHint(action, this); 
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

    messageUser(message, _el) {
        this.isPlaying = false;
        const el = document.createElement('dialog');
        el.style = 'visibility:visible;'
        el.innerHTML = `
            ${message}
            <form method="dialog">
            <div style="padding-top: 1rem; font-size: .8rem;">
                <button class="animated-button"
                    onclick="location.reload()"
                >Try Again</button>

                <button class="animated-button"
                onclick="location.href='/';"
                >More Puzzles</button>
            </form>
            <div>
        `;
        (_el || document.getElementById('wordlist-container')).append(el);
        throw(el.innerText.trim());
    }

    handleWin() {
        // show score, clicks, time
        // hide the rest of the board (reveal whatever is under it... if we're doing this as a puzzle)
        this.isPlaying = false;
        const el = document.getElementById('wordlist-container');
        el.innerHTML = `
            <center style="font-size: 1.2rem;">
                You won in ${(Math.floor((new Date().getTime() - this.gameData.startTime) / 1000))} seconds
                with ${this.gameData.clicks} clicks
                <div style="padding-top: 1rem; font-size: .8rem;">
                    <button class="animated-button"
                        onclick="location.reload()"
                    >Play Again</button>

                    <button class="animated-button"
                    onclick="location.href='/';"
                    >More Puzzles</button>
                <div>
            </center>
        `;
    }

    highlightAllWordCells() {
        this.gameData.words.forEach(w => {
            w.coords.forEach(c => {
                const el = document.querySelector(`[id="${c}"]`)
                el.classList.add('clicked');
            })
        })
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
                // console.log('this.gameDataExtraInfo=', this.gameDataExtraInfo);
                if (this.gameDataExtraInfo[coord].usedBy.length > 1) {
                    // remove the current word from shared list (reducing the reference count)
                    const arr = this.gameDataExtraInfo[coord].usedBy;
                    this.gameDataExtraInfo[coord].usedBy = arr.filter(str => str !== word.word);

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
