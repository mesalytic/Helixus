const Discord = require("discord.js");
const snekfetch = require("snekfetch");
module.exports.run = async (bot, message, args, con) => {
  if (args.length > 0) {
    snekfetch
      .get("https://skimdb.npmjs.com/registry/" + args[0].toLowerCase())
      .then(body => {
        const time =
          Date.now() -
          new Date(body.body.time[body.body["dist-tags"].latest]).getTime();

        let embed = new Discord.RichEmbed()
          .setTitle(body.body.name)
          .setColor(3066993)
          .addField(bot.lang.membres.npm.desc, body.body.description, true)
          .addField(bot.lang.membres.npm.author, body.body.author.name, true)
          .addField(
            bot.lang.membres.npm.latest,
            body.body["dist-tags"].latest,
            true
          )
          .addField(
            bot.lang.membres.npm.github,
            body.body.repository
              ? body.body.repository.url
                  .replace("git+", "")
                  .replace(".git", "")
                  .replace("git://", "https://")
                  .replace("git@github.com:", "https://github.com/")
              : "No Repository",
            true
          )
          .addField(
            bot.lang.membres.npm.maintenors,
            body.body.maintainers.map(m => m.name).join(", "),
            true
          );

        message.channel.send(embed).catch(error => {
          const str = bot.lang.membres.npm.notfound.replace(
            "${args[0]}",
            args[0].toLowerCase()
          );
          if (error.status === 404) return message.reply(str);
          console.error(
            "Erreur pendant la récupération du package NPM",
            error.message
          );
        });
      });
  } else return message.channel.send(bot.lang.membres.npm.noargs);
};
module.exports.help = {
  name: "npm",
  catégorie: "Membres",
  helpcaté: "membres"
};
