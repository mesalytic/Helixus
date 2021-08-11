const { icons, cooldowns } = require("./Constants");
const ms = require('enhanced-ms');
const { MessageEmbed } = require('discord.js');

const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui', 'はい', 'correct'];
const no = ['no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off'];

/**
 * Capitalizes a string
 * @param {string} string 
 */
exports.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts timestamps or DateResolvables to current TZ
 * @param {DateResolvable} data
 */
exports.timeZoneConvert = function(data) {
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

exports.compareArrays = function(a, b) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
    }
    return true
}

exports.parseEmoji = function(text) {
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

exports.base64 = function(text, mode = 'encode') {
    if (mode === 'encode') return Buffer.from(text).toString('base64');
    if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
    throw new TypeError(`${mode} is not a supported base64 mode.`);
}

exports.randomInt = function(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

// Credits: Xiao
exports.verify = async function(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
    const filter = res => {
        const value = res.content.toLowerCase();
        return (user ? res.author.id === user.id : true) &&
            (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
    };
    const verify = await channel.awaitMessages(filter, {
        max: 1,
        time
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice) || extraYes.includes(choice)) return true;
    if (no.includes(choice) || extraNo.includes(choice)) return false;
    return false;
}

exports.list = function(arr, conj = 'and') {
        const len = arr.length;
        if (len === 0) return '';
        if (len === 1) return arr[0];
        return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
}

exports.getIcon = function (type, style = "name") {
    return icons[type] ? icons[type][style] : "⚠️";
}

exports.getPlayerPosition = async function (id, criteria = "currentExp", bot) {
    const bestPlayers = await bot.mongoDB.Rpg
        .find({})
        .select("account")
        .sort({ [criteria]:-1 })
        .lean();
    const position = bestPlayers.findIndex(p=> p.account.userId === id) + 1;
    if (position > 100) {
        return ">100";
    }
    return position;
};

exports.onCooldown = (type, user) => {
    if (!type || !user) throw "Missing Arguments.";
    if (!Object.keys(cooldowns).includes(type)) throw `Cooldown for ${type} is not configured.`

    const previousTime = user.cooldowns[type];
    const now = new Date();
    let cooldown = cooldowns[type];

    const timePassed = Math.abs(previousTime - now);

    if (timePassed < cooldown) {
        const timeLeftMs = Math.ceil((cooldown - timePassed));
        const timeFormat = ms(timeLeftMs);

        return {
            response: true,
            timeLeftMs,
            timeFormat,
            message: `You're on cooldown for ${type}! Wait ${ms(timeFormat)} before you can perform this again!`,
            embed: this.generateCooldownEmbed(timeLeftMs, user)
        }
    }
    return {
        reponse: false
    }
}

exports.generateCooldownEmbed = (timeMs, user) => {
    const timeLeftSentence = timeMs > 60000 ?
    `You can't use this command for ${ms(timeMs)}`
    : `You can't use this command for ${Math.ceil(timeMs / 1000)} seconds`;

    const donatorsInformation = user.account.premium ?
    "Your cooldown is lowered due to your premium subscription"
    : "If you don't want to wait this much, subscribe to our premium! Donators get in game benefits.";

    const cooldownEmbed = new MessageEmbed()
    .setTitle("Cooldown")
    .setColor("RANDOM")
    .addField(timeLeftSentence, donatorsInformation, true);

    return cooldownEmbed;
}

exports.allCooldowns = (user) => {
    const { username } = user.account;
    const cooldownsNames = Object.keys(cooldowns);
    const allOnCooldowns = cooldownsNames.map(c => {
        const info = this.onCooldown(c, user);
        return info.response ? info.timeLeftMs : false
    });

    const status = allOnCooldowns.map((c, i) => {
        const formattedName = `am!${cooldownsNames[i][0].toLowerCase() + cooldownsNames[i].slice(1)}`
        if (!c) return `✅ - ${formattedName}`

        return `🕘 - ${formattedName} **(${ms(c)})**`
    });

    const embed = new MessageEmbed()
        .setTitle(`${username}'s cooldowns`)
        .setColor("RANDOM")
        .addFields({
            name: "Current Status",
            value: status,
            inline: false
        })

    return embed;
}

exports.objectFilter = (obj, predicate) => {
    return Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});
}

exports.objectMessage = (costs) => {
    let message = "";
    for (const cost in costs) message += `${this.getIcon[cost] || ""} ${this.capitalize(cost)}: ${costs[cost]} \n`

    return message;
}