module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");

  let xp;
  let lvl;
  con.query(
    `SELECT * FROM Levels WHERE id = '${message.guild.id}-${message.author.id}'`,
    (err, rows) => {
      if (!rows[0].points) xp = 0;
      else xp = rows[0].points;
      if (!rows[0].level) lvl = 1;
      else lvl = rows[0].level;
      const clvl = 5 * (rows[0].level ^ 2) + 50 * rows[0].level + 100;

      const difference =
        5 * (rows[0].level ^ 2) + 50 * rows[0].level + 100 - rows[0].points;
      const lvlEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.author.avatarURL())
        .setAuthor(message.author.username)
        .setDescription(
          `${bot.lang.levels.level.level
            .replace("${lvl}", lvl)
            .replace("${xp}", xp)
            .replace("${diffenrece}", clvl)}`
        )
        .setFooter(
          bot.lang.levels.level.difference.replace("${difference}", difference)
        );
      message.channel.send(lvlEmbed);
    }
  );
};
module.exports.help = {
  name: "level",
  catégorie: "Levels",
  helpcaté: "levels"
};
