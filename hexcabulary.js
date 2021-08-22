class Hexcabulary {
    size = 80;
    unit = 'px';
    id; // the game board element identifier (probably the "id" attribute, but doesn't have to be)
    el; // the reference to the DOM element found using "id"
    isPlaying = false;
    isEditMode = false;

    constructor(id, myInstanceName, data = {}) {
        this.id = id;
        this.el = document.querySelector(this.id);
        this.me = myInstanceName;
        this.gameData = data;

        // init
        this.generateCSSClasses();
        this.drawBoard();
        this.addMenu();
        this.populateGame();
        this.userEdits();
    }
    
    generateCSSClasses() {
        // create styles once so they can be reused in board interactions
        let style = document.createElement('style');
        style.innerHTML = `
            .cell {
                background-image: ${Hexcabulary.svg()};
                background-size: ${this.size}${this.unit} ${this.size}${this.unit};
                width: ${this.size}${this.unit};
                height:${this.size}${this.unit};
                font-size: ${this.size * .02}em;
            }
            .clicked {
                color: #fff;
                background-image: ${Hexcabulary.svg("rgb(0,0,0)")};
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);


        // include static css file as well
        const link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = './hexcabulary.css';
        link.media = 'all';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    static svg(
        fill = 'rgb(235,235,235)', 
        stroke = 'rgb(51,51,51)'
    ) {
        let svg = `
        <svg width="100%" height="100%" 
            viewBox="0 0 46 32" version="1.1" 
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            xml:space="preserve" xmlns:serif="http://www.serif.com/" 
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
        <g transform="matrix(1,0,0,1,-1.19739,0.362659)">
            <g transform="matrix(0.865567,6.80571e-06,-5.16946e-06,0.657465,-88.4942,-79.8665)">
                <path d="M129.885,122.444L154.993,133.595L154.993,155.896L129.885,167.047L104.778,155.896L104.778,133.595L129.885,122.444Z" 
                style="fill:${fill};stroke:${stroke};stroke-width:2.6px;"/>
            </g>
        </g>
        </svg>
        `.replace(/\s+/gim,' ');
        return `url('data:image/svg+xml;utf8,${encodeURI(svg)}')`;
    }

    drawBoard() {
        let html = '';
        let y = 0, x = 0;
        // let xx = 94, yy = 49;
        let xx = this.size - 6;
        let yy = this.size / 2 - 2;
        let styles = document.styleSheets[0];
        console.log('styles = ', styles);
        let data = JSON.parse(JSON.stringify(this.gameData || {}));
        let ROWS = this.gameData.rows || 10;
        let COLUMNS = this.gameData.columns || 10;

        // store with data (in case we're generating the data here, we need to persist it)
        data.rows = ROWS;
        data.columns = COLUMNS;
        
        for (let row = ROWS; row > 0; row--) {
            x = row % 2 ? 0 : (0 + xx / 2)
            for (let column = COLUMNS; column > 0; column--) {
                x += xx;
                let name = `cell-${column},${row}`;
                let cell = this.gameData[name];
                let letter = (cell && cell.letter) || this.randomLetter();
                html += `
                    <div 
                        class="cell" 
                        id="${name}"
                        style="top: ${y}px; left: ${x}px;"
                    ><div class="click-zone"
                        data-id="${name}"
                        data-column = "${column}"
                        data-row = "${row}"
                        onclick="${this.me}.handleClick(event)"
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
        this.gameData = JSON.parse(JSON.stringify(data));
        this.el.classList.add('paused'); 
        this.el.innerHTML = html;
    }

    addMenu() {
        let html = '';
        const items = ['Play', 'Reset', 'Edit', 'Export', 'Generate Random'];
        items.forEach(item => { 
            html += `<button onclick="${this.me}.handleClick(event)" value="${item}">${item}</button>`
        });

        let _el = document.createElement('div');
        _el.className = 'playbar';
        _el.innerHTML = html;
        this.el.appendChild(_el);
    }

    handleClick(ev) {
        const evEl = ev.srcElement;
        const action = evEl.value;
        switch(action) {

            // handle button clicks
            case 'Generate Random':
                let xy = prompt('Columns, Rows: ', '10,10');
                let v = xy.split(',');
                window['_newGame'] = new Hexcabulary(this.id, '_newGame', { columns: v[0], rows: v[1] });
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
                this.isEditMode = false;
                this.isPlaying = true;
                this.el.classList.remove('paused'); 
                this.el.classList.remove('edit-mode'); 
                if (this.editButton) {
                    this.editButton.classList.remove('edit-mode');
                }
                return;
            case 'Export':
                console.log(`
==============================================================
To use this board data in a game...

const $boardData = ${JSON.stringify(this.gameData, null, 4)};
const myGame = new Hexcabulary('board', 'myGame', $boardData);

==============================================================
                `);
                alert(`See console.`);
                return;

            // handle game board clicks
            default:
                if (this.isEditMode) {
                    console.log('el = ', evEl);
                    let column = evEl.dataset['column'];
                    let row = evEl.dataset['row'];
                    let name = `cell-${column},${row}`;
                    let el = document.querySelector(`[data-id="${name}"]`);
                    el.contentEditable = true;
                    el.onblur = (e) => {
                        console.log(`updating ${name} to ${e.srcElement.textContent}`);
                        this.gameData[name].letter = e.srcElement.textContent;
                    };
                    el.focus();
                    return;
                }

                if (!this.isPlaying) {
                    return;
                }

                // else we're in play mode
                let bk = Hexcabulary.svg("rgb(0,0,0)");
                let el = ev.srcElement.parentNode;
                console.log('bk=', bk);
                el.classList.toggle('clicked');
        }
        
    }

    randomLetter() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const rnd = Math.random() * chars.length;
        return chars.charAt(rnd);
    }
    
    populateGame() {
        /*
            Take a structure that contains all the hidden words and their x,y values.
        */
    }

    userEdits() {
        /* 
            Listen for user to click in a cell.
            Allow user to enter the letter they want in that cell.
            Provide a way for the user to set which word the letter is a part of.
            Provide a way for user to provide a list of words and their associated "hints" and/or definitions
            Provide a way for user to name the theme of their word list/puzzle.
        */
    }
}
