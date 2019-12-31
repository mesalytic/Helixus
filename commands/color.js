module.exports.run = async (bot, message, args, con) => {
  var color = Math.random ().toString (16).slice (2, 8).toUpperCase ();
  const regex = /\${color}/g;
  const str = bot.lang.membres.randomhexcolor.res.replace (regex, color);
  message.channel.send (str);
};
module.exports.help = {
  name: 'color',
  catégorie: 'Membres',
  helpcaté: 'membres',
};
