export function addMenu(that) {
    let html = '';
    let buttons = '';
    const items = ['Play', 'Reset', 'Edit', 'Export', 'Generate Random', 'New Word'];
    items.forEach(item => { 
        buttons += `<button onclick="${that.me}.handleClick(event)" value="${item}">${item}</button>`
    });

    html += `
    <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        text-align: left;
        margin: 0; padding: 0;
    ">
    <div>
    Legend:
    <li>"." = empty cell (unusable cell, but visible)
    <li>"," = hidden cell (a hole in the board)
    <li>"*" = place random letter in cell
    </div>
    <div>
    ${buttons}
    </div>
    </div>
    `

    let el = document.createElement('div');
    el.id = 'playbar';
    el.classList.add('playbar');

    if (location.hash && location.hash.includes('edit-mode')) {
        // do nothing...leave the menu in edit-mode by default
    } else {
        console.log('add "#edit-mode" to the location to enable edit mode');
        el.classList.add('hidden');
    }
    el.innerHTML = html;

    window.addEventListener('hashchange',() => {
        let el = document.querySelector('#playbar');
        if (location.hash && location.hash.includes('edit-mode')) {
            // do nothing...leave the menu in edit-mode by default
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    return el;
}
