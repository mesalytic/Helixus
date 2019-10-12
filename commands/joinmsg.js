module.exports.run = async (bot, message, args, con) => {
  const fs = require("fs");

  con.query(
    `SELECT * FROM JoinMessages WHERE guildID='${message.guild.id}'`,
    (err, rows) => {
      if (!message.member.permissions.has("MANAGE_CHANNELS"))
        return message.reply(bot.lang.admin.joinmsg.noperms);
      const filter = m => m.author.id === message.author.id;
      if (args[0] === "reset") {
        if (!rows)
          return message.channel.send(bot.lang.admin.joinmsg.reset_success);
        con.query(`DELETE FROM JoinMessages WHERE guildID='${message.guild.id}'`);
        return message.channel.send(bot.lang.admin.joinmsg.reset_success);
      }

      const channel = message.mentions.channels.first();
      if (!channel) return message.reply(bot.lang.admin.joinmsg.nochannels);

      const str = bot.lang.admin.joinmsg.first;
      const res = str.replace("${channel}", channel);
      message.channel.send(res);
      message.channel
        .awaitMessages(filter, {
          max: 1
        })
        .then(collected => {
          if (!rows[0])
            con.query(
              `INSERT INTO JoinMessages (guildID, channelID, joinmsg) VALUES ('${
                message.guild.id
              }', '${channel.id}', '${collected.first().content}')`
            );
          else
            con.query(
              `UPDATE JoinMessages SET joinmsg = '${
                collected.first().content
              }', channelID = '${channel.id}' WHERE guildID = '${message.guild.id}'`
            );
          const astr = bot.lang.admin.joinmsg.second;
          const ares = astr.replace("${channel}", channel);
          message.channel.send(ares);
        });
    }
  );
};
module.exports.help = {
  name: "joinmsg",
  catégorie: "Administration",
  helpcaté: "admin"
};
