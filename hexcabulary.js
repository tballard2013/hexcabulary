drawBoard = () => {
    let html = '';
    let y = 0, x = 0;
    let xx = 94, yy = 49;
    for (let rows = 10; rows > 0; rows--) {
        x = rows % 2 ? 0 : (0 + xx / 2)
        for (let columns = 10; columns > 0; columns--) {
            x += xx;
            html += `
                <div 
                    class="cell" 
                    style="top: ${y}px; left: ${x}px;"
                >
                X
                </div>
            `;
        }
        y += yy;
    }
    console.log('html = ', html);
    document.querySelector('#board').innerHTML = html;
}

drawBoard();
