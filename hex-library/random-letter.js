export function randomLetter() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rnd = Math.random() * chars.length;
    return chars.charAt(rnd);
}
