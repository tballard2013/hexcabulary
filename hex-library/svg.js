export function svg(
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
