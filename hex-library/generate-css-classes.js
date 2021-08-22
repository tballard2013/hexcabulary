import {svg} from './svg.js'

export function generateCSSClasses(size, unit) {
    // create styles once so they can be reused in board interactions
    const style = document.createElement('style');
    style.innerHTML = `
        .cell {
            background-image: ${svg()};
            background-size: ${size}${unit} ${size}${unit};
            width: ${size}${unit};
            height:${size}${unit};
            font-size: ${size * .02}em;
        }
        .clicked {
            color: #fff;
            background-image: ${svg("rgb(0,0,0)")};
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

