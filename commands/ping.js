module.exports.run = async (bot, message, args, con) => {
  const Discord = require ('discord.js');

  const m = await message.channel.send ('Pong !');
  const ping_embed = new Discord.MessageEmbed ()
    .setColor ('#333333')
    .setTitle ('Ping')
    .addField (
      bot.lang.membres.ping.latency,
      `${m.createdTimestamp - message.createdTimestamp}ms`
    )
    .addField (bot.lang.membres.ping.api, `${Math.round (bot.ws.ping)}ms`)
    .setTimestamp ();
  message.channel.send (ping_embed);
};
module.exports.help = {
  name: 'ping',
  catégorie: 'Membres',
  helpcaté: 'membres',
};
