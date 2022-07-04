export function log() {
    if(sessionStorage.getItem('debug')) {
        console.log(arguments);
    }
}