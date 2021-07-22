export function utility() {
    // for API 19 new node doesn't have startsWith and endsWith string prototypes
    if (typeof String.prototype.startsWith !== 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }

    if (typeof String.prototype.endsWith !== 'function') {
        // see below for better implementation!
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
}