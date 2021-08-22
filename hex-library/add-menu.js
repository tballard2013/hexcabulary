export function addMenu(that) {
    let html = '';
    const items = ['Play', 'Reset', 'Edit', 'Export', 'Generate Random'];
    items.forEach(item => { 
        html += `<button onclick="${that.me}.handleClick(event)" value="${item}">${item}</button>`
    });

    let el = document.createElement('div');
    el.className = 'playbar';
    el.innerHTML = html;

    return el;
}

