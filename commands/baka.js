module.exports.run = async (bot, message, args, con) => {
  const fetch = require("node-fetch");
  const Discord = require("discord.js");

  let member = message.mentions.members.first() || message.member;

  const imageFetch = await fetch("https://nekos.life/api/v2/img/baka");
  const image = await imageFetch.json();
  if (member.id === message.member.id) member = null;
  const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setDescription(
      member
        ? bot.lang.rp.baka.ment
            .replace(
              "${message.member.user.username}",
              message.member.user.username
            )
            .replace("${member.user.username}", member.user.username)
        : bot.lang.rp.baka.noment.replace(
            "${message.member.user.username}",
            message.member.user.username
          )
    )
    .setImage(image.url)
    .setFooter("Baka - Helixus")
    .setTimestamp();
  message.channel.send(embed);
};
module.exports.help = {
  name: "baka",
  catégorie: "RP",
  helpcaté: "rp"
};
