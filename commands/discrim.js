module.exports.run = async (bot, message, args, con) => {
  const Discord = require ('discord.js');

  const embed = new Discord.MessageEmbed ().setColor ('RANDOM');

  if (isNaN (args[0]) || args[0] > 9999 || args[0] < 1) {
    embed.setFooter (bot.lang.membres.discrim.noargs);
    return message.channel.send (embed);
  }

  let resp = '';
  bot.users.map (function (user) {
    if (user.discriminator == args[0]) return (resp += `${user.username}\n`);
    else return;
  });

  embed.setTitle (`Discrim: ${args[0]}`).setDescription (resp);

  message.channel.send (embed);
};
module.exports.help = {
  name: 'discrim',
  catégorie: 'Membres',
  helpcaté: 'membres',
};
