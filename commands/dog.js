module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const fetch = require("node-fetch");

  const imageFetch = await fetch("https://nekos.life/api/v2/img/woof");
  const image = await imageFetch.json();
  const catembed = new Discord.MessageEmbed()
    .setColor("#B9121B")
    .setTitle("Woof ! 🐶")
    .setImage(image.url);
  message.channel.send(catembed);
};
module.exports.help = {
  name: "dog",
  helpcaté: "fun",
  catégorie: "Fun"
};
