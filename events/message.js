const {
  Collection,
  MessageEmbed,
  WebhookClient,
  Util
} = require("discord.js");
const {
  permissions
} = require("../structures/Constants");
const cooldowns = new Collection();

module.exports = (bot, message) => {
  if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;
  bot.db.query(`SELECT * FROM Prefixes WHERE guildID='${message.guild.id}'`, (err, prefixes) => {
    let prefix;
    if (err) bot.logger.error(err);

    if (!prefixes[0]) prefix = "am!"
    else prefix = prefixes[0].prefix;

    const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|am\!|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

    if (prefixRegex.test(message.content)) {
      const [, match] = message.content.match(prefixRegex);
      const args = message.content.slice(match.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      let command = bot.commands.get(cmd) || bot.aliases.get(cmd);

      if (!message.guild.lang) {
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${message.guild.id}'`, (err, rows) => {
          message.guild.lang = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`);
        })
      }

      if (command) {
        /* Owner Check */
        if (command.ownerOnly && message.author.id !== bot.config.ownerID) return;

        /* NSFW check */
        if (command.type === "nsfw" && !message.channel.nsfw) return message.reply(message.guild.lang ? message.guild.lang.EVENTS.MESSAGE.noNsfw : '❌ - Please execute this command in an NSFW channel.') // the latter solution is only a temporary rusty fix for a bug, patch will come later I hope.

        /* Permissions Check */
        let neededPermsBot = [];
        let neededPermsUser = [];

        command.userPermissions.forEach(uP => {
          if (!message.channel.permissionsFor(message.member).has(uP)) neededPermsUser.push(uP);
        })

        command.clientPermissions.forEach(uP => {
          if (!message.channel.permissionsFor(message.guild.me).has(uP)) neededPermsBot.push(uP);
        })

        if (neededPermsUser.length > 0) {
          return message.reply(message.guild.lang.EVENTS.MESSAGE.missingUserPerms(neededPermsUser.map((p) => `\`${permissions[`${p}`]}\``).join(", ")))
        }

        if (neededPermsBot.length > 0) {
          return message.reply(message.guild.lang.EVENTS.MESSAGE.missingBotPerms(neededPermsBot.map((p) => `\`${permissions[`${p}`]}\``).join(", ")))
        }

        /* Cooldowns */
        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown;

        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(message.guild.lang.EVENTS.MESSAGE.pleaseWait(timeLeft.toFixed(1)))
          }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
          bot.db.query(`SELECT * FROM IgnoreChannels WHERE channelID='${message.channel.id}'`, (err, rows) => {
            if (rows[0] && rows[0].ignored === "true" && !message.member.hasPermission("MANAGE_MESSAGES")) {
              message.delete();
              return message.channel.send(message.guild.lang.EVENTS.MESSAGE.restricted)
            } else {
              const wb = new WebhookClient(bot.config.webhook.commands.id, bot.config.webhook.commands.password)

              wb.send(`\`\`\`${Util.escapeMarkdown(`${message.author.tag} (${message.author.id}) - ${message.content} (${message.guild.name} | ${message.guild.id})`)}\`\`\``);

              command.run(message, args).catch(e => {
                const webhook = new WebhookClient(bot.config.webhook.error.id, bot.config.webhook.error.password)

                function makeid(length) {
                  var result = '';
                  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                  var charactersLength = characters.length;
                  for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                  }
                  return result;
                }

                let errorID = makeid(16);
                console.log(errorID);

                const embed = new MessageEmbed()
                  .setColor("RANDOM")
                  .setDescription(`Server: **${message.guild.name}** (\`${message.guild.id}\`)\nCommand: **${command.name}**\nMessage content: **${message.content}**\n\nError Stack:\n\`${e.stack}\``)
                  .setFooter(`ID: ${errorID}`);

                bot.logger.error(e);
                webhook.send(embed);
                return message.reply(message.guild.lang.EVENTS.MESSAGE.error(e, errorID))
              })
            }
          })

        } catch (e) {
          bot.logger.error(e);
          return message.reply(message.guild.lang.EVENTS.MESSAGE.error(e))
        }

      }
    } else {
      bot.db.query(`SELECT * FROM Afk WHERE userID = '${message.author.id}'`, (err, rows) => {
        if (rows[0]) {
          message.reply(message.guild.lang.EVENTS.MESSAGE.removedAFK);
          bot.db.query(`DELETE FROM Afk WHERE userID='${message.author.id}'`);
        }
      });
  
      const mentioned = message.mentions.members.first();
      if (mentioned) {
        bot.db.query(`SELECT * FROM Afk WHERE userID = '${mentioned.id}'`, (err, rows) => {
          if (rows[0]) {
            return message.reply(message.guild.lang.EVENTS.MESSAGE.isAFK(Util.escapeMarkdown(Util.removeMentions(mention.tag)), Util.escapeMarkdown(Util.removeMentions(rows[0].reason))))
          }
        });
      }
    }

    /* Levels */

    function generateXP(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    bot.db.query(`SELECT * FROM LevelsConfig WHERE guildID='${message.guild.id}'`, (err, rows) => {
      if (rows[0]) {
        if (rows[0].activated === "true") {
          bot.db.query(`SELECT * FROM Cooldowns WHERE userID='${message.author.id}'`, (err, cRows) => {
            if (!cRows[0]) bot.db.query(`INSERT INTO Cooldowns (userID, guildID, active) VALUES ('${message.author.id}', '${message.guild.id}', 'true')`);
            else return setTimeout(() => {
              bot.db.query(`DELETE FROM Cooldowns WHERE userID='${message.author.id}'`);
            }, 60 * 1000);

            bot.db.query(`SELECT * FROM Levels WHERE guild='${message.guild.id}' AND user='${message.author.id}'`, (err, lRows) => {
              if (err) throw err;

              if (!lRows[0]) {
                bot.db.query(`INSERT INTO Levels (user, guild, points, level) VALUES ('${message.author.id}', '${message.guild.id}', '${generateXP(5, 15)}', '1')`);
              } else {

                if (!message.guild.lang) {
                  bot.db.query(`SELECT * FROM Langs WHERE guildID='${message.guild.id}'`, (err, rows) => {
                    message.guild.lang = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`);
                  })
                }

                let xp;
                let xpToWin = generateXP(5, 15);

                if (!lRows[0]) xp = 0;
                else xp = Number(lRows[0].points);

                let xpFuture = lRows[0].points + xpToWin;
                let cLvl = (5 * (lRows[0].level ^ 2) + 50 * lRows[0].level + 100) * 1.20
                if (xpFuture >= cLvl) {
                  bot.db.query(`UPDATE Levels SET level = '${Number(lRows[0].level) + 1}', points = '0' WHERE guild='${message.guild.id}' AND user='${message.author.id}'`);

                  if (!rows[0].lvlupChannelID || rows[0].lvlupChannelID === "msgChannel") channel = message.channel.id;
                  else channel = rows[0].lvlupChannelID;

                  if (!rows[0].lvlupMessage) lvlupMsg = message.guild.lang.EVENTS.MESSAGE.lvlUpMessage;
                  else lvlupMsg = rows[0].lvlupMessage;

                  bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND level='${lRows[0].level + 1}'`, (err, rRows) => {
                    if (rRows[0]) {
                      const role = message.guild.roles.resolve(rRows[0].roleID);
                      if (!message.member.roles.cache.has(role)) message.member.roles.add(role);
                    }
                  });
                  for (let i = 0; i < Number(lRows[0].level); i++) {
                    bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND level='${i + 1}'`, (err, rRows) => {
                      if (rRows[0]) {
                        const role = message.guild.roles.resolve(rRows[0].roleID);
                        if (!message.member.roles.cache.has(role)) message.member.roles.add(role);
                      }
                    });
                  }

                  if (!channel) channel = message.channel.id;
                  if (!lvlupMsg) lvlupMsg = message.guild.lang.EVENTS.MESSAGE.lvlUpMessage;

                  const res = lvlupMsg.replace(/{user}/g, message.author).replace(/{level}/g, Number(lRows[0].level + 1)).replace(/{server}/g, message.guild.name).replace(/{username}/g, message.author.username);

                  let chan = bot.channels.cache.get(channel);
                  if (!chan) return;
                  chan.send(res).catch(() => {});
                } else bot.db.query(`UPDATE Levels SET points = '${lRows[0].points + xpToWin}' WHERE guild='${message.guild.id}' AND user='${message.author.id}'`);
              }
            })
          })
        }
      }
    })
    bot.db.query(`SELECT * FROM LevelsConfig WHERE guildID='${message.guild.id}'`, (err, rows) => {
      if (rows[0]) {
        if (rows[0].activated === "true") {



          bot.db.query(`SELECT * FROM Levels WHERE guild='${message.guild.id}' AND user='${message.author.id}'`, (err, lRows) => {
            var channel;
            var lvlupMsg;

            if (!lRows[0]) return;
            if (!Number(lRows[0].points)) return;
            const clvl = (5 * (lRows[0].level ^ 2) + 50 * lRows[0].level + 100) * 1.20;

            if (Number(lRows[0].points) >= clvl) {
              bot.db.query(`UPDATE Levels SET level = '${Number(lRows[0].level) + 1}', points = '0' WHERE guild='${message.guild.id}' AND user='${message.author.id}'`);

              if (!rows[0].lvlupChannelID || rows[0].lvlupChannelID === "msgChannel") channel = message.channel.id;
              else channel = rows[0].lvlupChannelID;

              if (!rows[0].lvlupMessage) lvlupMsg = message.guild.lang.EVENTS.MESSAGE.lvlUpMessage;
              else lvlupMsg = rows[0].lvlupMessage;

              bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND level='${lRows[0].level + 1}'`, (err, rRows) => {
                if (rRows[0]) {
                  const role = message.guild.roles.resolve(rRows[0].roleID);
                  if (!message.member.roles.cache.has(role)) message.member.roles.add(role);
                }
              });
              for (let i = 0; i < Number(lRows[0].level); i++) {
                bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND level='${i + 1}'`, (err, rRows) => {
                  if (rRows[0]) {
                    const role = message.guild.roles.resolve(rRows[0].roleID);
                    if (!message.member.roles.cache.has(role)) message.member.roles.add(role);
                  }
                });
              }

              if (!channel) channel = message.channel.id;
              if (!lvlupMsg) lvlupMsg = message.guild.lang.EVENTS.MESSAGE.lvlUpMessage;

              const res = lvlupMsg.replace(/{user}/g, message.author).replace(/{level}/g, Number(lRows[0].level + 1)).replace(/{server}/g, message.guild.name).replace(/{username}/g, message.author.username);

              let chan = bot.channels.cache.get(channel);
              if (!chan) return;
              chan.send(res).catch(() => {});
            }
          })
        }
      }
    })


    bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, rows) => {
      bot.db.query(`SELECT * FROM Cooldowns WHERE userID='${message.author.id}' AND type='coins'`, (err, cools) => {
        if (!cools[0]) bot.db.query(`INSERT INTO Cooldowns (userID, guildID, active, type) VALUES ('${message.author.id}', '${message.guild.id}', 'true', 'coins')`);
        else return setTimeout(() => {
          bot.db.query(`DELETE FROM Cooldowns WHERE userID='${message.author.id}' AND type='coins'`);
        }, 60 * 1000);

        if (!rows[0]) {
          bot.db.query(`INSERT INTO Economy (userID, balance) VALUES ('${message.author.id}', '${generateXP(5, 15)}')`);
        } else {
          bot.db.query(`UPDATE Economy SET balance = '${rows[0].balance + generateXP(5, 15)}' WHERE userID='${message.author.id}'`);
        }
      })
    })
  })
}