module.exports.run = async (bot, message, args, con) => {
  const fs = require("fs");

  if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(bot.lang.admin.lang.noperms);
  if (!args[0]) return message.reply(bot.lang.admin.lang.noargs);

  if (["en", "fr", "it"].includes(args[0].toLowerCase())) {
    con.query(
      `SELECT * FROM Langs WHERE guildID='${message.guild.id}'`,
      (err, rows) => {
        if (!rows[0]) {
con.query(
            `INSERT INTO Langs (guildID, lang) VALUES ('${
              message.guild.id
            }', '${args[0].toLowerCase()}')`,
          );
} else {
 con.query(
            `UPDATE Langs SET lang = '${args[0].toLowerCase()}' WHERE guildID='${
              message.guild.id
            }'`,
          );
}
        message.channel.send(bot.lang.admin.lang[args[0].toLowerCase()]);
      },
    );
  } else { return message.reply(bot.lang.admin.lang.noargs); }
};
module.exports.help = {
  name: "lang",
  catégorie: "Administration",
  helpcaté: "admin",
};
