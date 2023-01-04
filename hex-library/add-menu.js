export function addMenu(that) {
    let html = '';
    const items = ['Play', 'Reset', 'Edit', 'Export', 'Generate Random'];
    items.forEach(item => { 
        html += `<button onclick="${that.me}.handleClick(event)" value="${item}">${item}</button>`
    });

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
