export function showLetterHint(search, that) {
    // find the word in the data store
    // pick a letter in the word
    // flash the cell where the letter is briefly
    // reduce the score by the cost of the hint (or add the penalty)

    const _word = search.replace(/wordlist-/, ''); // pull "wordlist-" off the front.
    let letterIndex = Math.floor(Math.random() * _word.length);
    const data = that.gameData.words.filter(word => word.word == _word);
    let cell = data[0].coords[letterIndex]; // easiest way, just grab any letter from the word
    let el = document.querySelector(`[data-id="${cell}"]`).parentNode; // "

    // don't show the same hinted letter until all letters have been hinted (by keeping track of the hints)
    if (!data[0].hints || !data[0].hints.length) {
        data[0].hints = [];
        data[0].coords.forEach(coord => {
            el = document.querySelector(`[data-id="${coord}"]`).parentNode;
            if (!el.classList.contains('clicked')) {
                data[0].hints.push(coord);
            }
        });
    }
    // pick a letterIndex from the remembered hints
    // and only highlight it if the cell isn't already selected
    letterIndex = Math.floor(Math.random() * data[0].hints.length);
    cell = data[0].hints.splice(letterIndex, 1);
    el = document.querySelector(`[data-id="${cell}"]`).parentNode;

    el.classList.add('hint');
    el.classList.add('hint-background');

    setTimeout(() => {
        el.classList.remove('hint');
        el.classList.remove('hint-background');
    }, 1000);
}
