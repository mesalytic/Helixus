module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");

  if (!args[0]) {
    const info = bot.lang.membres.help.info.replace("${prefix}", "am!");

    const helpEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(info)
      .addField(
        `${bot.lang.membres.help.adm}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Administration")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.fun}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Fun")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.images}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Images")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.infos}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Infos")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.levels}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Levels")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.members}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Membres")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.moderation}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Modération")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.music}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "Musique")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `${bot.lang.membres.help.nsfw}`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "NSFW")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .addField(
        `🛂 RP`,
        bot.commands
          .filter(cmd => cmd.help.catégorie === "RP")
          .map(cmd => `\`${cmd.help.name}\``)
          .join(", ")
      )
      .setTimestamp();
    message.channel.send(helpEmbed);
  } else {
    const command = args[0];
    if (bot.commands.has(command) || bot.aliases.has(command)) {
      const rcommand = bot.commands.get(command) || bot.aliases.get(command);

      const str = bot.lang.membres.help.cmd_help.replace(
        "${command.help.name}",
        rcommand.help.name
      );

      const embedcommand = new Discord.MessageEmbed()
        .setColor(0x3498db)
        .setTitle(str)
        .setDescription(bot.lang.membres.help.cmd_obligfalc)
        .addField(
          bot.lang.membres.help.cmd_desc,
          bot.lang[rcommand.help.helpcaté][rcommand.help.name].help_description
        )
        .addField(
          bot.lang.membres.help.cmd_usage,
          bot.lang[rcommand.help.helpcaté][rcommand.help.name].help_usage
        );
      if (rcommand.help.aliases)
        embedcommand.addField("Aliases", rcommand.help.aliases[0]);
      message.channel.send(embedcommand);
    } else return message.channel.send(bot.lang.membres.help.invalid);
  }
};
module.exports.help = {
  name: "help",
  aliases: ["h"],
  catégorie: "Membres",
  helpcaté: "membres"
};
