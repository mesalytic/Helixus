const yes = ["o", "oui", "yep", " yes", "y", "ye", "yeah", "yup", "yea", "ya"];
const no = ["non", "nan", "nn", "no", "n", "nah", "nope", "nop"];

module.exports = class Util {
  static async verify(channel, user, time = 30000) {
    const filter = res => {
      const value = res.content.toLowerCase();
      return (
        res.author.id === user.id && (yes.includes(value) || no.includes(value))
      );
    };
    const verify = await channel.awaitMessages(filter, {
      max: 1,
      time
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice)) return true;
    if (no.includes(choice)) return false;
    return false;
  }
};
