const Discord = require("discord.js");
const fs = require("fs");

const Manager = new Discord.ShardingManager("./index.js");

module.exports.run = async (bot, message, args, con) => {
  if (message.author === bot.user) return;

  function clean(text) {
    if (typeof text === "string") {
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
      return text;
    }
  }
  const code = args.join(" ");
  if (message.author.id !== "604779545018761237")
    return message.channel.send(
      ":no_entry_sign: Accès refusé. :no_entry_sign:"
    );
  if (code.match("process.env.DISCORD_TOKEN"))
    return message.channel.send(
      ":no_entry_sign: Tentative de vol de token détecté. :no_entry_sign:"
    );
  if (code.match("discordtoken"))
    return message.channel.send(
      ":no_entry_sign: Tentative de vol de token détecté. :no_entry_sign:"
    );
  if (code.match("bot.token"))
    return message.channel.send(
      ":no_entry_sign: Tentative de vol de token détecté. :no_entry_sign:"
    );
  try {
    let evaled = eval(code);
    if (typeof evaled !== "string") {
      evaled = require("util").inspect(evaled);
    }
    const evalembed = new Discord.MessageEmbed()
      .setTitle("Eval")
      .addField("Entrée : ", `\`\`\`js\n ${code} \n\`\`\``)
      .addField("Sortie : ", `\`\`${clean(evaled)}\`\``)
      .addField("Succès !", "Le code a été éxécuté sans soucis !")
      .setColor("#47ff05");
    message.channel.send(evalembed);
  } catch (err) {
    const evalembed = new Discord.MessageEmbed()
      .setTitle("Eval")
      .addField("Entrée : ", `\`\`\`js\n ${code} \n\`\`\``)
      .addField("**Erreur :**", `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
      .addField(
        "Erreur !",
        "Une erreur a eu lieue, la commande n'a pas été éxécutée."
      )
      .setColor("#ff0505");
    message.channel.send(evalembed);
  }
};
module.exports.help = {
  name: "eval",
  catégorie: "Gestion Bot"
};
