module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const moment = require("moment");
  con.query(`SELECT * FROM ModlogsChannel WHERE guildID='${message.guild.id}'`, (err, modlogs) => {
    con.query(`SELECT * FROM WarnConfig WHERE guildID='${message.guild.id}'`, (err, config) => {
      con.query(`SELECT * FROM Cases WHERE guildID='${message.guild.id}'`, (err, cases) => {
        if (!message.member.permissions.has(["KICK_MEMBERS", "BAN_MEMBERS"])) return message.reply(bot.lang.mods.warn.notperm);
        if (["remove", "mods"].includes(args[0])) return message.reply("Not available yet.");
        if (args[0] === "list") {
          let u = message.mentions.members.first();
          if (u) {
            con.query(`SELECT * FROM Warns WHERE memberID='${u.id}' ORDER BY number ASC`, (err, rows) => {
              if (rows[0]) {
                let m = `Here is ${u.user.username}'s warns:\n`;
                rows.forEach(r => {
                  m += `[${r.number}] - \`Reason: ${r.reason}\` - ${moment(r.date).format("DD-MM-Y [at] h:mm:SS A",)}\n`;
                });
                return message.channel.send(m);
              } else { return message.reply("This user has no active warns."); }
            });
          } else {
            return message.reply("Listing server warns is not available for now.");
          }
        } else if (args[0] === "config") {
          if (args[1] === "kick") {
            if (!args[2] || isNaN(args[2])) return message.reply("Please specify a number.");
            if (!config[0]) {
              con.query(`INSERT INTO WarnConfig (guildID, kicks, bans) VALUES ('${message.guild.id}', '${args[2]}', '6')`);
            } else {
              con.query(`UPDATE WarnConfig SET kicks='${args[2]}' WHERE guildID='${message.guild.id}'`);
            }

            return message.channel.send(bot.lang.mods.warn.kick_success.replace("${kicks.fetch(`kicks_${message.guild.id}`)}", args[2]));
          } else if (args[1] === "ban") {
            if (!args[2] || isNaN(args[2])) return message.reply("Please specify a number.");
            if (!config[0]) {
              con.query(`INSERT INTO WarnConfig (guildID, kicks, bans) VALUES ('${message.guild.id}', '3', '${args[2]}')`);
            } else {
              con.query(`UPDATE WarnConfig SET bans='${args[2]}' WHERE guildID='${message.guild.id}'`);
            }

            return message.channel.send(bot.lang.mods.warn.ban_success.replace("${bans.fetch(`bans_${message.guild.id}`)}", args[2],));
          }
        } else {
          try {
            const mod = message.author;
            let user = message.mentions.members.first();

            if (!user) return message.reply(bot.lang.mods.warn.noment);
            let reason = message.content.split(" ").slice(2).join(" ");
            if (!reason) return message.reply(bot.lang.mods.warn.noreason);
            let bansn = config[0] ? config[0].bans : 6;
            let kicksn = config[0] ? config[0].kicks : 3;
            let chans = modlogs[0].channelID;
            let chan;

            if (!chans) chan = message.channel;
            else chan = message.guild.channels.resolve(chans);

            let caseNumber;
            if (!cases[0]) caseNumber = 0;
            else caseNumber = cases[0].caseN;

            let caseGuild = caseNumber + 1;

            con.query(`SELECT * FROM Warns WHERE guildID='${message.guild.id}' AND memberID='${user.id}' ORDER BY number DESC`, (err, warns) => {
              let id;
              if (!warns[0]) id = 1;
              else id = warns[0].number + 1;

              con.query(`INSERT INTO Warns (number, guildID, memberID, reason, date) VALUES ('${Number(id,)}', '${message.guild.id}', '${user.id}', '${reason}', '${new Date().getTime()}')`);

              if (!cases[0]) {
                con.query(`INSERT INTO Cases (guildID, caseN) VALUES ('${message.guild.id}', '${caseGuild}')`,);
              } else {
                con.query(`UPDATE Cases SET caseN = '${caseGuild}' WHERE guildID='${message.guild.id}'`);
              }

              if (id == kicksn) {
                let str = bot.lang.mods.warn.warn1.replace("${guildcasenumber}", caseGuild).replace("${user.id}", user.id).replace("${kicksn}", kicksn).replace("${reason}", reason);
                let fstr = bot.lang.mods.warn.warn1_footer.replace("${mod.id}", mod.id).replace("${mod.tag}", mod.tag);

                let sstr = bot.lang.mods.warn.warn1_success.replace("${user.user.tag}", user.user.tag);
                let astr = bot.lang.mods.warn.warn1_mp.replace("${message.guild.name}", message.guild.name).replace("${reason}", reason).replace("${kicksn}", kicksn);
                const kickEmbed = new Discord.MessageEmbed()
                  .setAuthor("Warn")
                  .setDescription(str)
                  .setColor("DARK_RED")
                  .setTimestamp()
                  .setThumbnail(user.user.displayAvatarURL())
                  .setFooter(fstr);

                chan.send(kickEmbed);
                user.kick(reason);
                message.reply(sstr);
                user.send(astr);
              } else if (id >= bansn) {
                let str = bot.lang.mods.warn.warn2.replace("${guildcasenumber}", caseGuild).replace("${user.id}", user.id).replace("${bansn}", bansn).replace("${reason}", reason);
                let fstr = bot.lang.mods.warn.warn2_footer.replace("${mod.id}", mod.id).replace("${mod.tag}", mod.tag);
                let sstr = bot.lang.mods.warn.warn2_success.replace("${user.user.tag}", user.user.tag);
                let astr = bot.lang.mods.warn.warn2_mp.replace("${message.guild.name}", message.guild.name).replace("${reason}", reason).replace("${bansn}", bansn);

                const banEmbed = new Discord.MessageEmbed()
                  .setAuthor("Warn")
                  .setDescription(str)
                  .setColor("DARK_RED")
                  .setTimestamp()
                  .setThumbnail(user.user.displayAvatarURL())
                  .setFooter(fstr);

                message.reply(sstr);
                user.ban({ days: 7, reason: reason }).catch(() => message.reply(bot.lang.mods.warn.warn2_fail));
                chan.send(banEmbed);
                user.send(astr);
              } else {
                const warns = id;
                let str = bot.lang.mods.warn.warn3.replace("${guildcasenumber}", caseGuild).replace("${user.id}", user.id).replace("${reason}", reason).replace("${warns}", warns);
                let fstr = bot.lang.mods.warn.warn3_footer.replace("${mod.id}", mod.id).replace("${mod.tag}", mod.tag);
                let sstr = bot.lang.mods.warn.warn3_success.replace("${user.user.tag}", user.user.tag);
                let astr = bot.lang.mods.warn.warn3_mp.replace("${message.guild.name}", message.guild.name).replace("${reason}", reason);

                const warnEmbed = new Discord.MessageEmbed()
                  .setAuthor("Warn")
                  .setDescription(str)
                  .setColor("DARK_RED")
                  .setTimestamp()
                  .setThumbnail(user.user.displayAvatarURL())
                  .setFooter(fstr);
                chan.send(warnEmbed);

                message.reply(sstr);

                user.send(astr);
              }
            });
          } catch (e) {
            throw e;
          }
        }
      });
    });
  });
};
module.exports.help = {
  name: "warn",
  catégorie: "Modération",
  helpcaté: "mods",
};
