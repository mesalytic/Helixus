module.exports.run = async (bot, message, args, con) => {
  const fetch = require ('node-fetch');
  const Discord = require ('discord.js');

  let member = message.mentions.members.first () || message.member;

  const imageFetch = await fetch ('https://nekos.life/api/v2/img/hug');
  const image = await imageFetch.json ();
  if (member.id === message.member.id) member = null;
  const embed = new Discord.MessageEmbed ()
    .setColor ('RANDOM')
    .setDescription (
      member
        ? bot.lang.rp.hug.ment
            .replace (
              '${message.member.user.username}',
              message.member.user.username
            )
            .replace ('${member.user.username}', member.user.username)
        : bot.lang.rp.hug.noment.replace (
            '${message.member.user.username}',
            message.member.user.username
          )
    )
    .setImage (image.url)
    .setFooter ('Hug - Helixus')
    .setTimestamp ();
  message.channel.send (embed);
};
module.exports.help = {
  name: 'hug',
  catégorie: 'RP',
  helpcaté: 'rp',
};
