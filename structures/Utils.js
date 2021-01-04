/**
 * Capitalizes a string
 * @param {string} string 
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts timestamps or DateResolvables to current TZ
 * @param {DateResolvable} data
 */
function timeZoneConvert(data) {
    var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d1 = new Date(data);
    let date = d1.getDate();
    let year = d1.getFullYear();
    let month = months[d1.getMonth() + 1];
    let h = d1.getHours();
    let m = d1.getMinutes();
    let tz = "AM";
    if (m < 10) m = `0${m}`;
    if (h > 12) {
        h = h - 12;
        tz = "PM";
    }
    return `${month} ${date}, ${year} ${h}:${m} ${tz}`;

}

function compareArrays(a, b) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
    }
    return true
}

function parseEmoji(text) {
    if (text.includes("%")) text = decodeURIComponent(text);
    if (!text.includes(":")) return {
        animated: false,
        name: text,
        id: null
    };
    const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
    if (!m) return null;
    return {
        animated: Boolean(m[1]),
        name: m[2],
        id: m[3] || null
    };
}

function base64(text, mode = 'encode') {
    if (mode === 'encode') return Buffer.from(text).toString('base64');
    if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
    throw new TypeError(`${mode} is not a supported base64 mode.`);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

module.exports = {
    capitalize,
    timeZoneConvert,
    compareArrays,
    parseEmoji,
    base64,
    randomInt
};