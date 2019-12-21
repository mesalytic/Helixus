module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");

  if (!args[0]) return message.channel.send(bot.lang.fun.rps.noargs);
  const rpsargs = message.content
    .split(" ")
    .slice(1)
    .join(" ");

  const computer_choice = rand(0, 2);
  let user_choice;
  var winner = "";
  var color = "";
  if (args[0].toLowerCase() === bot.lang.fun.rps.choice_rock)
    user_choice = 0;
  else if (
    args[0].toLowerCase() === bot.lang.fun.rps.choice_paper
  )
    user_choice = 1;
  else if (
    args[0].toLowerCase() === "ciseaux" === bot.lang.fun.rps.choice_scissors
  )
    user_choice = 2;
  else return message.channel.send(bot.lang.fun.rps.noargs);

  if (computer_choice == user_choice) {
    color = "#FFA500";
    winner = "Tie !";
  }
  if (computer_choice == 0 && user_choice == 2) {
    winner = "Helixus !";
    color = "#FF0000";
  }
  if (computer_choice == 2 && user_choice == 0) {
    winner = message.author.tag;
    color = "#008000";
  }
  if (computer_choice == 1 && user_choice == 0) {
    winner = "Helixus !";
    color = "#FF0000";
  }
  if (computer_choice == 0 && user_choice == 1) {
    winner = message.author.tag;
    color = "#008000";
  }
  if (computer_choice == 1 && user_choice == 2) {
    winner = message.author.tag;
    color = "#008000";
  }
  if (computer_choice == 2 && user_choice == 1) {
    winner = "Helixus !";
    color = "#FF0000";
  }

  const choices = {
    0: bot.lang.fun.rps.rock,
    1: bot.lang.fun.rps.paper,
    2: bot.lang.fun.rps.scissors
  };
  const tie = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(`${bot.lang.fun.rps.winner} : ${winner}`)
    .setAuthor(message.author.username, message.author.avatarURL())
    .addField(bot.lang.fun.rps.userchoice, choices[user_choice], true)
    .addField(bot.lang.fun.rps.botchoice, choices[computer_choice], true)
    .setTimestamp();
  message.reply(tie);
};
module.exports.help = {
  name: "rps",
  aliases: ["pfc"],
  catégorie: "Fun",
  helpcaté: "fun"
};
function rand(low, high) {
  return (Math.random() * (high + 1 - low) + low) | 0;
}
