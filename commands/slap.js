module.exports.run = async (bot, message, args, con) => {
  const fetch = require("node-fetch");
  const Discord = require("discord.js");

  let member = message.mentions.members.first() || message.member;

  const imageFetch = await fetch("https://nekos.life/api/v2/img/slap");
  const image = await imageFetch.json();
  if (member.id === message.member.id) member = null;
  const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setDescription(member ? bot.lang.rp.slap.ment.replace("${message.member.user.username}", message.member.user.username).replace("${member.user.username}", member.user.username) : bot.lang.rp.slap.noment.replace("${message.member.user.username}", message.member.user.username))
    .setImage(image.url)
    .setFooter("Slap - Helixus")
    .setTimestamp();
  message.channel.send(embed);
};
module.exports.help = {
  name: "slap",
  catégorie: "RP",
  helpcaté: "rp",
};
