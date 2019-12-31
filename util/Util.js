const yes = ['o', 'oui', 'yep', ' yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya'];
const no = ['non', 'nan', 'nn', 'no', 'n', 'nah', 'nope', 'nop'];

module.exports = class Util {
  static async verify (channel, user, time = 30000) {
    const filter = res => {
      const value = res.content.toLowerCase ();
      return (
        res.author.id === user.id &&
        (yes.includes (value) || no.includes (value))
      );
    };
    const verify = await channel.awaitMessages (filter, {
      max: 1,
      time,
    });
    if (!verify.size) return 0;
    const choice = verify.first ().content.toLowerCase ();
    if (yes.includes (choice)) return true;
    if (no.includes (choice)) return false;
    return false;
  }

  static parseEmoji (text) {
    if (text.includes ('%')) text = decodeURIComponent (text);
    if (!text.includes (':')) {
      return {
        animated: false,
        name: text,
        id: null,
      };
    }
    const m = text.match (/<?(a:)?(\w{2,32}):(\d{17,19})>?/);
    if (!m) return null;
    return {
      animated: Boolean (m[1]),
      name: m[2],
      id: m[3],
    };
  }

  static formatNumber (number) {
    return Number.parseFloat (number).toLocaleString (undefined, {
      maximumFractionDigits: 2,
    });
  }
};
