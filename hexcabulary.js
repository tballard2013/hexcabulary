import { svg } from './hex-library/svg.js';
import { addMenu } from './hex-library/add-menu.js';
import { generateCSSClasses } from './hex-library/generate-css-classes.js';
import { drawBoard } from './hex-library/draw-board.js';

export default class Hexcabulary {
    constructor(myInstanceName, data = {}) {
        this.size = 80;
        this.unit = 'px';
        this.el = document.getElementById(myInstanceName); // reference DOM element where to inject the game
        this.me = myInstanceName;
        this.gameData = data;
        this.isPlaying = false;
        this.isEditMode = false;
    
        generateCSSClasses(this.size, this.unit);
        drawBoard(this);
        this.el.appendChild(addMenu(this));
    }
    

    handleClick(ev) {
        const evEl = ev.srcElement;
        const action = evEl.value;
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
===================================================
To use this board data in a game...


<div id="myGame"><!-- game will appear here --></div>
<script type="module">
import Hexcabulary from './hexcabulary.js';
const $boardData = ${JSON.stringify(this.gameData)};
const $instance = 'myGame';
document[$instance] = new Hexcabulary($instance, $boardData);
</script>
===================================================
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
                let bk = svg("rgb(0,0,0)");
                let el = ev.srcElement.parentNode;
                console.log('bk=', bk);
                el.classList.toggle('clicked');
        }
        
    }

}
