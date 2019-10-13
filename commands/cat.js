module.exports.run = async (bot, message, args, con) => {
  const fetch = require("node-fetch");
  const fs = require("fs");
  const Discord = require("discord.js");

  const imageFetch = await fetch("https://nekos.life/api/v2/img/meow");
  const image = await imageFetch.json();
  const catembed = new Discord.RichEmbed()
    .setColor("#B9121B")
    .setTitle("Meow ! 🐱")
    .setImage(image.url);
  message.channel.send(catembed);
};
module.exports.help = {
  name: "cat",
  catégorie: "Fun",
  helpcaté: "fun"
};
