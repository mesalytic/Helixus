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

function canModifyQueue(member) {
    const {
        channelID
    } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel) {
        member.send("You need to join the voice channel first!").catch(console.error);
        return;
    }

    return true;
}
function compareArrays (a, b) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false
  
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

module.exports = {
    capitalize,
    timeZoneConvert,
    canModifyQueue,
    compareArrays
};