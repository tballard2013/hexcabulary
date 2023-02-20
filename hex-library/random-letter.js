export function randomLetter(guardLetter) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (guardLetter) {
        chars = chars.replace(guardLetter, '');
    }
    const rnd = Math.random() * chars.length;
    return chars.charAt(rnd);
}
