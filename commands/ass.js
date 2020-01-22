module.exports.run = async (bot, message, args, con) => {
  const Discord = require ('discord.js');

  if (!message.channel.nsfw) return message.reply (bot.lang.nsfw.ass.nonsfw);

  let m = await message.channel.send (bot.lang.nsfw.ass.wait);
  const g = require ('superagent')
    .get (`https://nekobot.xyz/api/image`)
    .query ({
      type: 'ass',
    })
    .end ((err, res) => {
      let astr = bot.lang.nsfw.ass.request.replace (
        '${message.author.tag}',
        message.author.tag
      );
      let bstr = bot.lang.nsfw.ass.notdisplay.replace (
        '${res.body.message}',
        res.body.message
      );
      const result = new Discord.MessageEmbed ()
        .setTitle (astr)
        .setDescription (bstr)
        .setImage (res.body.message)
        .setFooter (bot.lang.nsfw.ass.serviceby);
      m.edit (result);
    });
};
module.exports.help = {
  name: 'ass',
  catégorie: 'NSFW',
  helpcaté: 'nsfw',
};
