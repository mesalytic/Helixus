module.exports.run = async (bot, message, args, con) => {
  con.query(
    `SELECT * FROM LevelsConfig WHERE guildID='${message.guild.id}'`,
    (err, rows) => {
      if (
        !message.channel
          .permissionsFor(message.author)
          .hasPermission("BAN_MEMBERS")
      )
        return message.reply(bot.lang.levels.levels.nopermission);
      if (!args[0]) return message.reply(bot.lang.levels.levels.noargs);

      if (args[0] === "off") {
        if (!rows[0] || rows[0].activated === "false")
          return message.reply(bot.lang.levels.levels.off_alrdisabled);
        con.query(
          `UPDATE LevelsConfig SET activated = "false" WHERE guildID='${message.guild.id}'`
        );
        message.channel.send(bot.lang.levels.levels.off_disabled);
      } else if (args[0] === "on") {
        if (!rows[0]) {
          con.query(
            `INSERT INTO LevelsConfig (activated, guildID, lvlupChannelID) VALUES ('true', '${message.guild.id}', 'msgChannel')`
          );
          message.channel.send(bot.lang.levels.levels.on_enabled);
        } else {
          if (rows[0].activated === "false") {
            con.query(
              `UPDATE LevelsConfig SET activated = "true" WHERE guildID='${message.guild.id}'`
            );
            message.channel.send(bot.lang.levels.levels.on_enabled);
          } else return message.reply(bot.lang.levels.levels.on_alrenabled);
        }
      } else if (args[0] === "message") {
        const m1 = "";
        const filter = m => m.author.id === message.author.id;
        message.channel.send(bot.lang.levels.levels.message_channel);
        if (!rows[0]) return message.reply(bot.lang.levels.top.disabled);
        message.channel.awaitMessages(filter, { max: 1 }).then(collected => {
          if (collected.first().content === "msgChannel") {
            con.query(
              `UPDATE LevelsConfig SET lvlupChannelID='msgChannel' WHERE guildID='${message.guild.id}'`
            );
            message.channel.send(bot.lang.levels.levels.message_message);
            message.channel
              .awaitMessages(filter, {
                max: 1
              })
              .then(collected => {
                con.query(
                  `UPDATE LevelsConfig SET lvlupMessage='${
                    collected.first().content
                  }' WHERE guildID='${message.guild.id}'`
                );
                return message.channel.send(
                  bot.lang.levels.levels.message_finished
                );
              });
          } else if (collected.first().mentions.channels) {
            const chan = collected.first().mentions.channels.first();
            con.query(
              `UPDATE LevelsConfig SET lvlupChannelID='${chan.id}' WHERE guildID='${message.guild.id}'`
            );
            message.channel.send(bot.lang.levels.levels.message_message);
            message.channel
              .awaitMessages(filter, {
                max: 1
              })
              .then(collected => {
                con.query(
                  `UPDATE LevelsConfig SET lvlupMessage='${
                    collected.first().content
                  }' WHERE guildID='${message.guild.id}'`
                );
                return message.channel.send(
                  bot.lang.levels.levels.message_finished
                );
              });
          } else return message.reply(bot.lang.levels.levels.message_error);
        });
      } else if (args[0] === "rewards") {
        const oArgs = args
          .slice(1)
          .join(" ")
          .split(" | ");

        if (!oArgs[0])
          return message.reply(bot.lang.levels.levels.rewards_norole);
        if (!oArgs[1] || isNaN(oArgs[1]))
          return message.reply(bot.lang.levels.levels.rewards_nolevel);

        const niveau = Number(oArgs[1]);

        con.query(
          `SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND level='${niveau}'`,
          (err, rRows) => {
            if (oArgs[0] === "reset") {
              if (rRows[0]) {
                con.query(
                  `DELETE FROM LevelsRewards WHERE guildId='${message.guild.id}' AND level='${niveau}'`
                );
                return message.channel.send(
                  bot.lang.levels.levels.rewards_reset_deleted.replace(
                    "${niveau}",
                    niveau
                  )
                );
              } else
                return message.reply(
                  bot.lang.levels.levels.rewards_reset_notfound.replace(
                    "${niveau}",
                    niveau
                  )
                );
            }
            const role =
              message.guild.roles.get(oArgs[0]) ||
              message.guild.roles.find(r => r.name === oArgs[0]) ||
              message.mentions.roles.first();
            if (!role)
              return message.reply(bot.lang.levels.levels.rewards_notfound);

            if (!rRows[0])
              con.query(
                `INSERT INTO LevelsRewards (guildID, roleID, level) VALUES ('${message.guild.id}', '${role.id}', '${niveau}')`
              );
            else
              con.query(
                `UPDATE LevelsRewards SET roleID='${role.id}' WHERE guildID='${message.guild.id}' AND level='${niveau}'`
              );

            message.channel.send(
              bot.lang.levels.levels.rewards_added
                .replace("${role}", role)
                .replace("${niveau}", niveau)
            );
          }
        );
      } else if (args[0] === "modify") {
        const u = message.mentions.users.first();
        if (!u) return message.reply(bot.lang.levels.levels.modify_nouser);
        con.query(
          `SELECT * FROM Levels WHERE id='${message.guild.id}-${u.id}'`,
          (err, lrows) => {
            if (!lrows)
              return message.reply(bot.lang.levels.levels.modify_norows);
            if (!args[1])
              return message.reply(bot.lang.levels.levels.modify_noargs);

            if (args[1] === "xp") {
              if (args[2] === "add") {
                con.query(
                  `UPDATE Levels SET points='${Number(lrows[0].points) +
                    Number(args[4])}' WHERE id='${message.guild.id}-${u.id}'`
                );
                message.channel.send(
                  bot.lang.levels.levels.modify_xpadded
                    .replace("${args[3]}", args[4])
                    .replace("${u}", u)
                );
              }

              if (args[2] === "remove") {
                con.query(
                  `UPDATE Levels SET points = '${Number(lrows[0].points) -
                    Number(args[4])}' WHERE id='${message.guild.id}-${u.id}'`
                );
                message.channel.send(
                  bot.lang.levels.levels.modify_xpremoved
                    .replace("${args[3]}", args[4])
                    .replace("${u}", u)
                );
              } else
                return message.reply(bot.lang.levels.levels.modify_noargs1);
            } else if (args[1] === "level") {
              if (args[2] === "add") {
                con.query(
                  `UPDATE Levels SET level='${Number(lrows[0].level) +
                    Number(args[4])}' WHERE id='${message.guild.id}-${u.id}'`
                );
                message.channel.send(
                  bot.lang.levels.levels.modify_xpadded
                    .replace("${args[3]}", args[4])
                    .replace("${u}", u)
                );
              } else if (args[2] === "remove") {
                con.query(
                  `UPDATE Levels SET level = '${Number(lrows[0].level) -
                    Number(args[4])}' WHERE id='${message.guild.id}-${u.id}'`
                );
                message.channel.send(
                  bot.lang.levels.levels.modify_xpremoved
                    .replace("${args[3]}", args[4])
                    .replace("${u}", u)
                );
              } else
                return message.reply(bot.lang.levels.levels.modify_noargs1);
            } else return message.reply(bot.lang.levels.levels.modify_noargs);
          }
        );
      } else if (args[0] === "reset") {
        con.query(
          `SELECT * FROM Levels WHERE id='${message.guild.id}-${u.id}'`,
          (err, lrows) => {
            const u = message.mentions.users.first();
            if (!u) return message.reply(bot.lang.levels.levels.reset_nouser);
            if (!lrows[0])
              return message.reply(bot.lang.levels.levels.reset_norows);
          }
        );

        message.channel.send(
          bot.lang.levels.levels.reset_resetted.replace("${u}", u)
        );
      } else return message.reply(bot.lang.levels.levels.noargs);
    }
  );
};
module.exports.help = {
  name: "levels",
  catégorie: "Levels",
  helpcaté: "levels"
};
