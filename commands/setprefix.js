module.exports.run = async (bot, message, args, con) => {
  con.query(
    `SELECT * FROM Prefixes WHERE guildID='${message.guild.id}'`,
    (err, rows) => {
      let prefix;

      if (!rows[0]) {
        con.query(
          `INSERT INTO Prefixes (guildID, prefix) VALUES ('${message.guild.id}', 'am!')`
        );
        prefix = "am!";
      } else {
        prefix = rows[0].prefix;
      }

      if (!message.member.hasPermission("MANAGE_GUILD"))
        return message.reply(bot.lang.admin.setprefix.nopermission);
      if (!args[0]) {
        const str = bot.lang.admin.setprefix.noargs.replace("${prefix}", prefix);
        return message.reply(str);
      }
      if (args[0].length > 5)
        return message.reply(bot.lang.admin.setprefix.prefixtoolong);
      con.query(
        `UPDATE Prefixes SET prefix = '${args[0]}' WHERE guildID='${
          message.guild.id
        }'`
      );
      const str = bot.lang.admin.setprefix.newprefix.replace(
        "${args[0]}",
        args[0]
      );
      return message.channel.send(str);
    }
  );
};
module.exports.help = {
  name: "setprefix",
  aliases: ["prefix"],
  catégorie: "Administration",
  helpcaté: "admin"
};
