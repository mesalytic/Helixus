const fs = require("fs");

module.exports.run = async (bot, message, args, con) => {
  if (!message.member.permissions.has("MANAGE_CHANNELS"))
    return message.reply(bot.lang.admin.logs.noperms);

  const channel = message.mentions.channels.first();
  if (!channel) return message.reply(bot.lang.admin.ignore.nochans);

  con.query(
    `SELECT * FROM IgnoreChannels WHERE channelID='${channel.id}'`,
    (err, rows) => {
      let m = bot.lang.admin.ignore.m;
      let s = bot.lang.admin.ignore.s;
      if (!rows[0]) {
        con.query(
          `INSERT INTO IgnoreChannels (guildID, channelID, ignored) VALUES ('${message.guild.id}', '${channel.id}', "true")`
        );
        m += `${channel}, `;
      } else if (rows[0].ignored === "false") {
        con.query(
          `UPDATE IgnoreChannels SET ignored = "true" WHERE channelID = '${channel.id}'`
        );
        m += `${channel}, `;
      } else if (rows[0].ignored === "true") {
        con.query(
          `UPDATE IgnoreChannels SET ignored = "false" WHERE channelID = '${channel.id}'`
        );
        s += `${channel}, `;
      }

      if (m === bot.lang.admin.ignore.m) m = "";
      m += bot.lang.admin.ignore.madd;
      const rm = m.replace(
        bot.lang.admin.ignore.mrep1,
        bot.lang.admin.ignore.mrep2
      );
      if (s === bot.lang.admin.ignore.s) s = "";
      s += bot.lang.admin.ignore.sadd;
      const rs = s.replace(
        bot.lang.admin.ignore.srep1,
        bot.lang.admin.ignore.srep2
      );
      const ms = rm + rs;
      message.channel.send(ms);
    }
  );
};
module.exports.help = {
  name: "ignore",
  catégorie: "Administration",
  helpcaté: "admin"
};
