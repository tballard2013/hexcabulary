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
    const words = that.gameData.words || ['missing word list'];
    words.forEach(word => {
        html += `<a href="javascript:void(0)" 
                    id="wordlist-${word.word}"
                    data-value="wordlist-${word.word}"
                    data-name="wordlist-${word.word}"
                    data-editable="true"
                    onclick="${that.me}.handleClick(event)"
                >${word.hint || word.word}</a>`
    })
    html += '</div>';

    return html;
}
