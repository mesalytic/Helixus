module.exports.run = async (bot, message, args, con) => {
  const fs = require("fs");

  con.query(
    `SELECT * FROM ModlogsChannel WHERE guildID='${message.guild.id}'`,
    (err, rows) => {
      if (!message.member.permissions.has("ADMINISTRATOR"))
        return message.reply(bot.lang.admin.modlogs.noperms);
      if (args[0] === "reset") {
        if (rows[0]) {
          con.query(
            `DELETE FROM ModlogsChannel WHERE guildID='${message.guild.id}'`,
          );
          return message.channel.send(bot.lang.admin.modlogs.reset_success);
        } else return message.reply(bot.lang.admin.modlogs.reset_notattributed);
      }
      const chan = message.mentions.channels.first();
      if (!chan) return message.reply(bot.lang.admin.modlogs.nochans);
      if (!rows[0])
        con.query(
          `INSERT INTO ModlogsChannel (guildID, channelID) VALUES ('${message.guild.id}', '${chan.id}')`,
        );
      else con.query(`UPDATE ModlogsChannel SET channelID='${chan.id}'`);
      message.channel.send(
        bot.lang.admin.modlogs.success.replace("${chan}", chan),
      );
    },
  );
};
module.exports.help = {
  name: "modlogs",
  catégorie: "Administration",
  helpcaté: "admin",
};
