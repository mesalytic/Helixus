module.exports.run = async (bot, message, args, con) => {
  const fs = require("fs");

  if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply("Nope!");

  try {
    con.query(`SELECT * FROM Autorole WHERE guildID='${message.guild.id}'`, (err, rows) => {
      if (args[0] === "off") {
        if (!rows[0].roleID) return message.reply(bot.lang.admin.autorole["off_not-activated"]);

        con.query(`DELETE FROM Autorole WHERE guildID='${message.guild.id}'`);
        return message.reply(bot.lang.admin.autorole.off_succeess);
      }

      const rArgs = args.join(" ");
      const role = message.guild.roles.resolve(rArgs) || message.guild.roles.cache.find(r => r.name === rArgs) || message.mentions.roles.first();
      if (role) {
        con.query(`SELECT * FROM Autorole WHERE guildID='${message.guild.id}'`, (err, rows) => {
          if (!rows[0]) {
            con.query(`INSERT INTO Autorole (roleID, guildID) VALUES ('${role.id}', '${message.guild.id}')`);
          } else {
            con.query(`UPDATE Autorole SET roleID='${role.id}' WHERE guildID='${message.guild.id}'`);
          }
          const str = bot.lang.admin.autorole.roleAdd_success;
          const res = str.replace("${role.name}", role.name);
          return message.reply(res);
        });
      } else {
        return message.reply(bot.lang.admin.autorole.roleAdd_failure);
      }
    });
  } catch (err) {
    throw err;
  }

};
module.exports.help = {
  name: "autorole",
  catégorie: "Administration",
  helpcaté: "admin",
};
