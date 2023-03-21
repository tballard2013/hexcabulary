export function buildWordListHTML(that) {
    let ROWS = that.gameData.rows || 10;
    let yy = that.size / 2 - 2;
    let boardHeight = yy * ROWS;

    const _top = that.gameData['menu-top'];
    const _right = that.gameData['menu-right'];
    const _style1 = `
        position: absolute;
        top: ${_top};
        right: ${_right};
        z-index: 9999;
    `;
    const _style2 = `
        position: absolute;
        top: ${boardHeight + that.size}px;
        left: ${that.size}px;
        width: 100%;
    `;
    
    let html = `<div id="wordlist-container" class="wordlist" 
        style="${_top || _right ? _style1 : _style2}"
        >`

    html += buildWordsHTML(that);
    
    html += '</div>';

    return html;
}

export function buildWordsHTML(that) {
    let html = '';
    let words = that.gameData.words || [];

    if (!words.length) {
        html += 'No word list provided.';
    }

    words.forEach(word => {

        let v = word.word;
        if (that.difficulty > 1) {
            if (word.hint) v = word.hint;
        }

        if (!word) {
            html += 'No word?'
        } else {
        html += `<a href="javascript:void(0)" 
                    id="wordlist-${word.word}"
                    data-value="wordlist-${word.word}"
                    data-name="wordlist-${word.word}"
                    data-editable="true"
                    onclick="${that.me}.handleClick(event)"
                >${v}</a>`
        }
    })

    return html;
}