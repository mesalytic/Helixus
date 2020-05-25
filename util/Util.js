const yes = ["o", "oui", "yep", " yes", "y", "ye", "yeah", "yup", "yea", "ya"];
const no = ["non", "nan", "nn", "no", "n", "nah", "nope", "nop"];

module.exports = class Util {
  static random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static async verify(channel, user, time = 30000) {
    const filter = res => {
      const value = res.content.toLowerCase();
      return (
        res.author.id === user.id && (yes.includes(value) || no.includes(value))
      );
    };
    const verify = await channel.awaitMessages(filter, {
      max: 1,
      time,
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice)) return true;
    if (no.includes(choice)) return false;
    return false;
  }

  static parseEmoji(text) {
    if (text.includes("%")) text = decodeURIComponent(text);
    if (!text.includes(":")) return { animated: false, name: text, id: null };
    const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
    if (!m) return null;
    return { animated: Boolean(m[1]), name: m[2], id: m[3] || null };
  }

  static formatNumber(number) {
    return Number.parseFloat(number).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  }

  static base64(text, mode = 'encode') {
		if (mode === 'encode') return Buffer.from(text).toString('base64');
		if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
		throw new TypeError(`${mode} is not a supported base64 mode.`);
  }

  static shorten(text, maxLen = 2000) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
  }

  static eURL(title, url, display = url) {
    return `[${title}](${url.replace(/\)/g, '%27')})`;
  }
};
