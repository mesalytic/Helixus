module.exports.run = async (bot, message, args, con) => {
  const moment = require ('moment');
  require ('moment-duration-format');

  const duration = moment
    .duration (bot.uptime)
    .format ('D [j], H[h] m[m] s[s]');

  const str = bot.lang.infos.uptime.r.replace ('${duration}', duration);
  message.channel.send (str);
};
module.exports.help = {
  name: 'uptime',
  catégorie: 'Infos',
  helpcaté: 'infos',
};
