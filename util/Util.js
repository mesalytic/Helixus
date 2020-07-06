const yes = ["yes", "oui", "yep", "o", "y", "ye", "yeah", "yup", "yea", "ya"];
const no = ["no", "non", "nan", "nn", "n", "nah", "nope", "nop"];

module.exports = class Util {
  static random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static async insertChar(str, char, length) {
    var split = str.split(char),
        regex = RegExp('(.{' + length + '})','g');

    split[split.length-1] = split[split.length - 1].replace(regex, '$1' + char);
    return split.join(char);
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

  static shortenText(ctx, text, maxWidth) {
    let shorten = false;
    while (ctx.measureText(`${text}...`).width > maxWidth) {
      if (!shorten) shorten = true;
      text = text.substr(0, text.length - 1);
    }
    return shorten ? `${text}...` : text;
  }

  static eURL(title, url, display = url) {
    return `[${title}](${url.replace(/\)/g, '%27')})`;
  }

  static shuffle(array) {
    const arr = array.slice(0);
    for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  static streamToArray(stream) {
    if (!stream.readable) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const array = [];
      function onData(data) {
        array.push(data);
      }
      function onEnd(error) {
        if (error) reject(error);
        else resolve(array);
        cleanup();
      }
      function onClose() {
        resolve(array);
        cleanup();
      }
      function cleanup() {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        stream.removeListener('close', onClose);
      }
      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onEnd);
      stream.on('close', onClose);
    })
  }

  static drawImageWithTint(ctx, image, color, x, y, width, height) {
    const { fillStyle, globalAlpha } = ctx;
    ctx.fillStyle = color;
    ctx.drawImage(image, x, y, width, height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = fillStyle
    ctx.globalAlpha = globalAlpha;
  }
};
