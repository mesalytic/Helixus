module.exports.run = async (bot, message, args, con) => {
  const Discord = require ('discord.js');

  const defineduser = message.mentions.users.first ();

  var embed = new Discord.MessageEmbed ()
    .setColor ('RANDOM')
    .setDescription (
      defineduser
        ? bot.lang.membres.pp.hisavatar
        : bot.lang.membres.pp.youravatar
    )
    .setImage (
      defineduser ? defineduser.avatarURL ({ dynamic: true, size: 512 }) : message.author.avatarURL ({ dynamic: true, size: 512 })
    );
  return message.channel.send (embed);
};
module.exports.help = {
  name: 'avatar',
  aliases: ['pp'],
  catégorie: 'Membres',
  helpcaté: 'membres',
};
