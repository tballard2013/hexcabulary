handleClick = (ev) => {
    console.log('event = ', ev);
    let bk = svg("rgb(0,0,0)");
    let el = ev.srcElement;
    console.log('bk=', bk);
    el.classList.toggle('clicked');
    // el.style.backgroundImage = bk;
    // ev
}

generateCSSClasses = () => {
    // create styles once so they can be reused in board interactions
    let style = document.createElement('style');
    // style.type = 'text/css';
    style.innerHTML = `
    .cell {
        background-image: ${svg()};
    }
    .clicked {
        color: #fff;
        background-image: ${svg("rgb(0,0,0)")};
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
}

drawBoard = () => {
    let html = '';
    let y = 0, x = 0;
    let xx = 94, yy = 49;
    let styles = document.styleSheets[0];
    console.log('styles = ', styles);
    
    for (let rows = 10; rows > 0; rows--) {
        x = rows % 2 ? 0 : (0 + xx / 2)
        for (let columns = 10; columns > 0; columns--) {
            x += xx;
            let letter = randomLetter();
            html += `
                <div 
                    onclick="handleClick(event)"
                    _nmouseover="this.style.backgroundImage = ${svg(`rgb('255,0,0')`)}"
                    class="cell" 
                    style="top: ${y}px; left: ${x}px;
                    "
                >
                ${letter}
                </div>
            `;
        }
        y += yy;
    }
    console.log('html = ', html);
    document.querySelector('#board').innerHTML = html;
}

svg = (
    fill = 'rgb(235,235,235)', 
    stroke = 'rgb(51,51,51)'
) => {
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

randomLetter = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rnd = Math.random() * chars.length;
    return chars.charAt(rnd);
}

// init
generateCSSClasses();
drawBoard();
