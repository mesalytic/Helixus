module.exports.run = async (bot, message, args, con) => {
  const fs = require("fs");

  con.query(`SELECT * FROM LeaveMessages WHERE guildID=${message.guild.id}`, (err, rows) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply(bot.lang.admin.leavemsg.noperms);
    const filter = m => m.author.id === message.author.id;
    if (args[0] === "reset") {
      if (!rows) return message.channel.send(bot.lang.admin.leavemsg.reset_success);
      con.query(`DELETE FROM LeaveMessages WHERE guildID=${message.guild.id}`);
      return message.channel.send(bot.lang.admin.leavemsg.reset_success);
    }

    const channel = message.mentions.channels.first();
    if (!channel) return message.reply(bot.lang.admin.leavemsg.nochannels);

    const str = bot.lang.admin.leavemsg.first;
    const res = str.replace("${channel}", channel);
    message.channel.send(res);
    message.channel.awaitMessages(filter, {
      max: 1,
    }).then(collected => {
      if (!rows[0]) {
        con.query(`INSERT INTO LeaveMessages (guildID, channelID, leavemsg) VALUES ('${message.guild.id}', '${channel.id}', '${collected.first().content}')`);
      } else {
        con.query(`UPDATE LeaveMessages SET leavemsg = ${collected.first().content}, channelID = ${channel.id} WHERE guildID = ${message.guild.id}`);
      }
      const astr = bot.lang.admin.leavemsg.second;
      const ares = astr.replace("${channel}", channel);
      message.channel.send(ares);
    });
  },
  );
};
module.exports.help = {
  name: "leavemsg",
  catégorie: "Administration",
  helpcaté: "admin",
};
