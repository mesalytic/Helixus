const Discord = require("discord.js");
const mysql = require("mysql");
const fs = require("fs");
const config = require("./config.json");

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.lang;
bot.config = config;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: config.dbpassword,
  database: "HelixusV2"
});
con.connect(err => {
  if (err) throw err;
  console.log("Connected to database !");
});

bot.on("ready", async () => {
  const wb = new Discord.WebhookClient(
    config.webhook_status.id,
    config.webhook_status.password
  );
  wb.send(`:white_check_mark: Shard ${bot.shard.id + 1} connecté !`);
  console.log(
    `[READY (Shard ${bot.shard.id + 1}/2)] Shard ${bot.shard.id +
      1}/2 connecté avec ${bot.users.size} utilisateurs et ${
      bot.guilds.size
    } serveurs..`
  );
  bot.shard.broadcastEval("this.guilds.size").then(s => {
    bot.shard.broadcastEval("this.users.size").then(u => {
      if (!u[0] || isNaN(u[0])) u[0] = 0;
      if (!u[1] || isNaN(u[1])) u[1] = 0;
      if (!s[0] || isNaN(u[0])) s[0] = 0;
      if (!s[1] || isNaN(u[1])) s[1] = 0;
      bot.shard.broadcastEval(`this.user.setActivity('cc c le test !')`);
    });
  });
  bot.shard.broadcastEval("this.guilds.size").then(sh => {
    bot.shard.broadcastEval("this.users.size").then(us => {
      var shstr = String(sh).split("\n");
      var sharray = JSON.parse("[" + shstr + "]");
      var usstr = String(us).split("\n");
      var usarray = JSON.parse("[" + usstr + "]");
    });
  });
});

bot.on("reconnecting", () => {
  const wb = new Discord.WebhookClient(
    config.webhook_status.id,
    config.webhook_status.password
  );
  wb.send(`:warning: Le shard ${bot.shard.id + 1} se reconnecte !`);
});

bot.on("channelCreate", channel => {
  if (channel.type === "dm") return;
  con.query(
    `SELECT * FROM Logs WHERE guildID='${channel.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${channel.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].channelcreate === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.channelCreate.replace(
                      "${channel.id}",
                      channel.id
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(channel.guild.name, channel.guild.iconURL)
                      .setDescription(str)
                      .setFooter(`ID: ${channel.id}`)
                      .setTimestamp()
                      .setColor("#c2a6eb");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("channelDelete", channel => {
  if (channel.type === "dm") return;
  con.query(
    `SELECT * FROM Logs WHERE guildID='${channel.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${channel.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].channeldelete === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.channelDelete.replace(
                      "${channel.name}",
                      channel.name
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(channel.guild.name, channel.guild.iconURL)
                      .setDescription(str)
                      .setFooter(`ID: ${channel.id}`)
                      .setTimestamp()
                      .setColor("#e7cd67");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("emojiCreate", emoji => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${emoji.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${emoji.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].emojicreate === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.emojiCreate.replace(
                      "${emoji.name}",
                      emoji.name
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(emoji.guild.name, emoji.guild.iconURL)
                      .setDescription(str)
                      .setThumbnail(emoji.url)
                      .setFooter(`ID: ${emoji.id}`)
                      .setTimestamp()
                      .setColor("RANDOM");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("emojiDelete", emoji => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${emoji.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${emoji.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].emojidelete === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.emojiDelete.replace(
                      "${emoji.name}",
                      emoji.name
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(emoji.guild.name, emoji.guild.iconURL)
                      .setDescription(str)
                      .setFooter(`ID: ${emoji.id}`)
                      .setTimestamp()
                      .setColor("RANDOM");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("emojiUpdate", (oldEmoji, newEmoji) => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${oldEmoji.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${oldEmoji.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].emojiupdate === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    if (oldEmoji.name === newEmoji.name) return;
                    const str = bot.lang.logs.emojiUpdate.desc.replace(
                      "${oldEmoji.name}",
                      oldEmoji.name
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(oldEmoji.guild.name, oldEmoji.guild.iconURL)
                      .addField(bot.lang.logs.emojiUpdate.old, oldEmoji.name)
                      .addField(bot.lang.logs.emojiUpdate.new, newEmoji.name)
                      .setDescription(str)
                      .setFooter(`ID: ${oldEmoji.id}`)
                      .setTimestamp()
                      .setColor("RANDOM");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("guildBanAdd", async (guild, user) => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${guild.id}'`,
    async (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${guild.id}'`,
        async (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].guildbanadd === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
                    const str = bot.lang.logs.guildBanAdd.desc.replace(
                      "${user.tag}",
                      user.tag
                    );
                    let entries = await guild
                      .fetchAuditLogs({
                        type: "MEMBER_BAN_ADD"
                      })
                      .then(audit => {
                        let reason;
                        if (!audit.entries.first().reason) {
                          reason = bot.lang.logs.guildBanAdd.noreason;
                        } else reason = audit.entries.first().reason;
                        const chanCr = new Discord.RichEmbed()
                          .setAuthor(guild.name, guild.iconURL)
                          .setDescription(str)
                          .addField(
                            bot.lang.logs.guildBanAdd.bannedby,
                            audit.entries.first().executor.tag
                          )
                          .addField(bot.lang.logs.guildBanAdd.reason, reason)
                          .setThumbnail(user.avatarURL)
                          .setFooter(`ID: ${user.id}`)
                          .setTimestamp()
                          .setColor("RANDOM");
                        logsChan.send(chanCr);
                      });
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("guildBanRemove", async (guild, user) => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${guild.id}'`,
    async (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${guild.id}'`,
        async (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].guildbanremove === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.guildBanRemove.desc.replace(
                      "${user.tag}",
                      user.tag
                    );
                    const entry = await guild
                      .fetchAuditLogs({
                        type: "MEMBER_BAN_REMOVE"
                      })
                      .then(audit => {
                        let reason;
                        if (!audit.entries.first().reason) {
                          reason = bot.lang.logs.guildBanRemove.noreason;
                        } else reason = audit.entries.first().reason;
                        const chanCr = new Discord.RichEmbed()
                          .setAuthor(guild.name, guild.iconURL)
                          .setDescription(str)
                          .addField(
                            bot.lang.logs.guildBanRemove.unbannedby,
                            audit.entries.first().executor.tag
                          )
                          .addField(bot.lang.logs.guildBanRemove.reason, reason)
                          .setThumbnail(user.avatarURL)
                          .setFooter(`ID: ${user.id}`)
                          .setTimestamp()
                          .setColor("RANDOM");
                        logsChan.send(chanCr);
                      });
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("guildMemberUpdate", async (oldMember, newMember) => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${oldMember.guild.id}'`,
    async (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${oldMember.guild.id}'`,
        async (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].guildmemberupdate === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    if (oldMember.nickname !== newMember.nickname) {
                      let oMemberNick;
                      if (oldMember.nickname === null) {
                        oMemberNick =
                          bot.lang.logs.guildMemberUpdate.nooldnickname;
                      } else {
                        oMemberNick = oldMember.nickname;
                      }
                      let nMemberNick;
                      if (newMember.nickname === null) {
                        nMemberNick =
                          bot.lang.logs.guildMemberUpdate.nonewnickname;
                      } else {
                        nMemberNick = newMember.nickname;
                      }
                      const entry = await newMember.guild
                        .fetchAuditLogs({
                          type: "MEMBER_UPDATE"
                        })
                        .then(audit => {
                          const str = bot.lang.logs.guildMemberUpdate.desc1;
                          const res = str.replace(
                            "${newMember.user.tag}",
                            newMember.user.tag
                          );
                          const nickEmbed = new Discord.RichEmbed()
                            .setAuthor(
                              newMember.user.tag,
                              newMember.user.avatarURL
                            )
                            .setDescription(res)
                            .addField(
                              bot.lang.logs.guildMemberUpdate.oldnickname,
                              oMemberNick
                            )
                            .addField(
                              bot.lang.logs.guildMemberUpdate.newnickname,
                              nMemberNick
                            )
                            .addField(
                              bot.lang.logs.guildMemberUpdate.changedby,
                              audit.entries.first().executor.tag
                            )
                            .setColor("RANDOM");
                          logsChan.send(nickEmbed);
                        });
                    }
                    var newrole =
                      "`" +
                      newMember.roles
                        .filter(
                          r =>
                            oldMember.roles
                              .map(r => r.id)
                              .join(", ")
                              .indexOf(r.id) == -1
                        )
                        .map(r => r.name) +
                      "`";
                    var oldrole =
                      "`" +
                      oldMember.roles
                        .filter(
                          r =>
                            newMember.roles.map(r => r.id).indexOf(r.id) == -1
                        )
                        .map(r => r.name) +
                      "`";
                    if (newrole !== "``") {
                      //
                      const entry = await newMember.guild
                        .fetchAuditLogs({
                          type: "MEMBER_ROLE_UPDATE"
                        })
                        .then(audit => {
                          const str = bot.lang.logs.guildMemberUpdate.desc2;
                          const res = str.replace(
                            "${newMember.user.tag}",
                            newMember.user.tag
                          );
                          const nickEmbed = new Discord.RichEmbed()
                            .setAuthor(
                              newMember.user.username,
                              newMember.user.avatarURL
                            )
                            .setDescription(res)
                            .addField(
                              bot.lang.logs.guildMemberUpdate.roleobtained,
                              newrole
                            )
                            .addField(
                              bot.lang.logs.guildMemberUpdate.givenby,
                              audit.entries.first().executor.tag
                            )
                            .setColor("RANDOM");
                          logsChan.send(nickEmbed);
                        });
                    }
                    if (oldrole !== "``") {
                      const entry = await newMember.guild
                        .fetchAuditLogs({
                          type: "MEMBER_ROLE_UPDATE"
                        })
                        .then(audit => {
                          const str = bot.lang.logs.guildMemberUpdate.desc3;
                          const res = str.replace(
                            "${newMember.user.tag}",
                            newMember.user.tag
                          );
                          const nickEmbed = new Discord.RichEmbed()
                            .setAuthor(
                              newMember.user.tag,
                              newMember.user.avatarURL
                            )
                            .setDescription(res)
                            .addField(
                              bot.lang.logs.guildMemberUpdate.lostrole,
                              oldrole
                            )
                            .addField(
                              bot.lang.logs.guildMemberUpdate.removedby,
                              audit.entries.first().executor.tag
                            )
                            .setColor("RANDOM");
                          logsChan.send(nickEmbed);
                        });
                    }
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("guildMemberAdd", member => {
  con.query(
    `SELECT * FROM JoinMessages WHERE guildID=${member.guild.id}`,
    (err, rows) => {
      if (rows[0]) {
        const str = rows[0].joinmsg;
        const userregex = /{user}/g;
        const usernameregex = /{username}/g;
        const guildregex = /{guild}/g;
        const res = str
          .replace(userregex, member)
          .replace(usernameregex, member.user.username)
          .replace(guildregex, member.guild.name);
        member.guild.channels.get(rows[0].channelID).send(res);
      }
    }
  );
  con.query(
    `SELECT * FROM Autorole WHERE guildId=${member.guild.id}`,
    (err, rows) => {
      if (rows[0]) {
        const role = member.guild.roles.get(rows[0].roleID);
        // console.log(`Debug : ${role.id}`)
        member.addRole(role).catch(err => {
          throw new Error(err);
        });
      }
    }
  );

  con.query(
    `SELECT * FROM Logs WHERE guildID='${member.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${member.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].guildmemberadd === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.guildMemberAdd.desc.replace(
                      "${member.user.tag}",
                      member.user.tag
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(member.user.username, member.user.avatarURL)
                      .setDescription(str)
                      .setThumbnail(member.user.avatarURL)
                      .setFooter(`ID: ${member.id}`)
                      .setTimestamp()
                      .setColor("RANDOM");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("guildMemberRemove", member => {
  con.query(
    `SELECT * FROM LeaveMessages WHERE guildID=${member.guild.id}`,
    (err, rows) => {
      if (rows[0]) {
        const str = rows[0].leavemsg;
        const usernameregex = /{username}/g;
        const guildregex = /{guild}/g;
        const res = str
          .replace(usernameregex, member.user.username)
          .replace(guildregex, member.guild.name);
        member.guild.channels.get(rows[0].channelID).send(res);
      }
    }
  );

  con.query(
    `SELECT * FROM Logs WHERE guildID='${member.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${member.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].guildmemberremove === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.guildMemberRemove.replace(
                      "${member.user.tag}",
                      member.user.tag
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(member.user.tag, member.user.avatarURL)
                      .setDescription(str)
                      .setThumbnail(member.user.avatarURL)
                      .setFooter(`ID: ${member.id}`)
                      .setTimestamp()
                      .setColor("RANDOM");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("messageDelete", message => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${message.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${message.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          con.query(
            `SELECT * FROM LogsIgnore WHERE guildID='${message.guild.id}'`,
            (err, ignore) => {
              if (rows[0]) {
                if (rows[0].channelID) {
                  if (rows[0].activated === "true") {
                    if (rows[0].messagedelete === "true") {
                      if (!ignore[0] || ignore[0].ignored === "false") {
                        const logsChan = bot.channels.get(rows[0].channelID);
                        if (logsChan) {
                          message.guild
                            .fetchAuditLogs({
                              type: "MESSAGE_DELETE"
                            })
                            .then(audit => {
                              const entry = audit.entries.first();
                              const fetch = require("node-fetch");
                              const qbin = (q, e, s) =>
                                fetch("https://qbin.io", {
                                  method: "PUT",
                                  body: q,
                                  headers: {
                                    e,
                                    s
                                  }
                                }).then(y => y.text());
                              if (
                                !message.attachments.first() &&
                                !message.content
                              )
                                return;
                              if (message.author.bot) return;
                              let author;
                              if (
                                entry.extra.channel.id === message.channel.id &&
                                entry.target.id === message.author.id &&
                                entry.createdTimestamp > Date.now() - 5000 &&
                                entry.extra.count >= 1
                              ) {
                                author = entry.executor.tag;
                              } else {
                                author = message.author.tag;
                              }
                              const str = bot.lang.logs.messageDelete.desc
                                .replace(
                                  "${message.author.tag}",
                                  message.author.tag
                                )
                                .replace(
                                  "${message.channel.id}",
                                  message.channel.id
                                );
                              const chanCr = new Discord.RichEmbed()
                                .setAuthor(
                                  message.author.tag,
                                  message.author.avatarURL
                                )
                                .setDescription(str)
                                .addField(
                                  bot.lang.logs.messageDelete.deletedby,
                                  author
                                )
                                .setFooter(`ID: ${message.id}`)
                                .setTimestamp()
                                .setColor("RANDOM");
                              // console.log(message.content.length);
                              // console.log(message.content);
                              const msg = `${message.content}`;
                              qbin(msg, 0, "none")
                                .then(m => {
                                  if (message.attachments.first()) {
                                    if (!message.content) {
                                      chanCr.addField(
                                        bot.lang.logs.messageDelete.attachment,
                                        message.attachments.first().proxyURL
                                      );
                                    } else {
                                      if (message.content.length > 1023) {
                                        console.log(m);
                                        chanCr.addField(
                                          bot.lang.logs.messageDelete.message,
                                          m
                                        );
                                        chanCr.addField(
                                          bot.lang.logs.messageDelete
                                            .attachment,
                                          message.attachments.first().proxyURL
                                        );
                                      } else {
                                        chanCr.addField(
                                          bot.lang.logs.messageDelete.message,
                                          message.content
                                        );
                                        chanCr.addField(
                                          bot.lang.logs.messageDelete
                                            .attachment,
                                          message.attachments.first().proxyURL
                                        );
                                      }
                                    }
                                  } else {
                                    if (message.content.length > 1023) {
                                      console.log(m);
                                      chanCr.addField(
                                        bot.lang.logs.messageDelete.message,
                                        m
                                      );
                                    } else {
                                      chanCr.addField(
                                        bot.lang.logs.messageDelete.message,
                                        message.content
                                      );
                                    }
                                  }
                                })
                                .then(() => logsChan.send(chanCr));
                            });
                        }
                      }
                    }
                  }
                }
              }
            }
          );
        }
      );
    }
  );
});

bot.on("messageDeleteBulk", messages => {
  const guild = messages.first().guild;
  const channel = messages.first().channel;
  con.query(`SELECT * FROM Logs WHERE guildID='${guild.id}'`, (err, rows) => {
    con.query(
      `SELECT * FROM Langs WHERE guildID='${guild.id}'`,
      (err, langs) => {
        if (!langs[0])
          bot.lang = JSON.parse(fs.readFileSync(`./languages/en.json`, "utf8"));
        else
          bot.lang = JSON.parse(
            fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
          );
        con.query(
          `SELECT * FROM LogsIgnore WHERE guildID='${guild.id}'`,
          (err, ignore) => {
            if (rows[0]) {
              if (rows[0].channelID) {
                if (rows[0].activated === "true") {
                  if (rows[0].messagedeletebulk === "true") {
                    if (!ignore[0] || ignore[0].ignored === "false") {
                      const logsChan = bot.channels.get(rows[0].channelID);
                      if (logsChan) {
                        const fetch = require("node-fetch");
                        const qbin = (q, e, s) =>
                          fetch("https://qbin.io", {
                            method: "PUT",
                            body: q,
                            headers: {
                              e,
                              s
                            }
                          }).then(y => y.text());
                        let haste;
                        let msg = bot.lang.logs.messageDeleteBulk.msg;
                        messages.forEach(m => {
                          let content;
                          if (m.attachments.first() && !m.content) {
                            const str =
                              bot.lang.logs.messageDeleteBulk.attachment;
                            const res = str.replace(
                              "${m.attachments.first().url}",
                              m.attachments.first().proxyURL
                            );
                            content = res;
                          } else if (m.attachments.first() && m.content) {
                            const str =
                              bot.lang.logs.messageDeleteBulk.attachmsg;
                            const res = str
                              .replace(
                                "${m.attachments.first().url}",
                                m.attachments.first().proxyURL
                              )
                              .replace("${m.content}", m.content);
                            content = res;
                          } else if (m.content) content = m.content;
                          else
                            content = bot.lang.logs.messageDeleteBulk.nocontent;
                          const moment = require("moment");
                          moment.locale("fr");
                          const m_time = moment(m.createdAt).format(
                            bot.lang.logs.messageDeleteBulk.timeformat
                          );
                          msg += `${m.author.tag} (${m.author.id}) | ${m.id} | ${m_time} | ${content}\n`;
                        });
                        qbin(msg, 0, "none").then(newGist => {
                          const str = bot.lang.logs.messageDeleteBulk.desc
                            .replace("${messages.size}", messages.size)
                            .replace(
                              "${messages.first().channel.id}",
                              messages.first().channel.id
                            );
                          const chanCr = new Discord.RichEmbed()
                            .setAuthor(bot.lang.logs.messageDeleteBulk.mass)
                            .setDescription(str)
                            .addField(
                              bot.lang.logs.messageDeleteBulk.deleted,
                              newGist
                            )
                            .setTimestamp()
                            .setFooter(messages.first().id)
                            .setColor("RANDOM");
                          logsChan.send(chanCr);
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        );
      }
    );
  });
});

bot.on("messageUpdate", (oldMessage, newMessage) => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${oldMessage.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${oldMessage.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].messageupdate === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    if (oldMessage.content !== newMessage.content) {
                      if (oldMessage.content.length !== 0) {
                        if (!oldMessage.author.bot) {
                          const str = bot.lang.logs.messageUpdate.desc
                            .replace(
                              "${oldMessage.author.tag}",
                              oldMessage.author.tag
                            )
                            .replace(
                              "${oldMessage.channel.id}",
                              oldMessage.channel.id
                            );
                          const chanCr = new Discord.RichEmbed()
                            .setAuthor(
                              oldMessage.author.tag,
                              oldMessage.author.avatarURL
                            )
                            .setDescription(str)
                            .addField(
                              bot.lang.logs.messageUpdate.old,
                              oldMessage.content
                            )
                            .addField(
                              bot.lang.logs.messageUpdate.new,
                              newMessage.content
                            )
                            .setTimestamp()
                            .setFooter(
                              `ID user : ${oldMessage.author.id} | ID msg : ${oldMessage.id}`
                            )
                            .setColor("RANDOM");
                          logsChan.send(chanCr);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("roleCreate", role => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${role.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${role.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].rolecreate === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.roleCreate.replace(
                      "${role.name}",
                      role.name
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(role.guild.name, role.guild.iconURL)
                      .setDescription(str)
                      .setTimestamp()
                      .setFooter(`ID: ${role.id}`)
                      .setColor("RANDOM");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("roleDelete", role => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${role.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${role.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].roledelete === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const str = bot.lang.logs.roleDelete.replace(
                      "${role.name}",
                      role.name
                    );
                    const chanCr = new Discord.RichEmbed()
                      .setAuthor(role.guild.name, role.guild.iconURL)
                      .setDescription(str)
                      .setTimestamp()
                      .setFooter(`ID: ${role.id}`)
                      .setColor("RANDOM");
                    logsChan.send(chanCr);
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

bot.on("voiceStateUpdate", (voiceOld, voiceNew) => {
  con.query(
    `SELECT * FROM Logs WHERE guildID='${voiceNew.guild.id}'`,
    (err, rows) => {
      con.query(
        `SELECT * FROM Langs WHERE guildID='${voiceNew.guild.id}'`,
        (err, langs) => {
          if (!langs[0])
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/en.json`, "utf8")
            );
          else
            bot.lang = JSON.parse(
              fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
            );
          if (rows[0]) {
            if (rows[0].channelID) {
              if (rows[0].activated === "true") {
                if (rows[0].voicestateupdate === "true") {
                  const logsChan = bot.channels.get(rows[0].channelID);
                  if (logsChan) {
                    const vcOld = voiceOld.voiceChannel;
                    const vcNew = voiceNew.voiceChannel;
                    if (!vcOld && vcNew) {
                      const str = bot.lang.logs.voiceStateUpdate.joined
                        .replace("${voiceNew.user.tag}", voiceNew.user.tag)
                        .replace("${vcNew.name}", vcNew.name);
                      const chanCr = new Discord.RichEmbed()
                        .setAuthor(
                          voiceNew.user.tag,
                          voiceNew.user.displayAvatarURL
                        )
                        .setDescription(str)
                        .setTimestamp()
                        .setFooter(`ID: ${vcNew.id}`)
                        .setColor("RANDOM");
                      logsChan.send(chanCr);
                    } else if (vcOld && !vcNew) {
                      const str = bot.lang.logs.voiceStateUpdate.leaved
                        .replace("${voiceNew.user.tag}", voiceNew.user.tag)
                        .replace("${vcOld.name}", vcOld.name);
                      const chanCr = new Discord.RichEmbed()
                        .setAuthor(
                          voiceNew.user.tag,
                          voiceNew.user.displayAvatarURL
                        )
                        .setDescription(str)
                        .setTimestamp()
                        .setFooter(`ID: ${vcOld.id}`)
                        .setColor("RANDOM");
                      logsChan.send(chanCr);
                    } else if (vcOld && vcNew && vcOld.id != vcNew.id) {
                      const str = bot.lang.logs.voiceStateUpdate.switch
                        .replace("${voiceNew.user.tag}", voiceNew.user.tag)
                        .replace("${vcOld.name}", vcOld.name)
                        .replace("${vcNew.name}", vcNew.name);
                      const chanCr = new Discord.RichEmbed()
                        .setAuthor(
                          voiceNew.user.tag,
                          voiceNew.user.displayAvatarURL
                        )
                        .setDescription(str)
                        .setTimestamp()
                        .setFooter(`ID: ${vcOld.id} -> ${vcNew.id}`)
                        .setColor("RANDOM");
                      logsChan.send(chanCr);
                    }
                  }
                }
              }
            }
          }
        }
      );
    }
  );
});

fs.readdir("./commands/", (err, files) => {
  if (err) throw err;
  const jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    return console.log("[COMMANDES] - Aucune commande n'a été trouvée.");
  }
  jsfile.forEach((f, i) => {
    const props = require(`./commands/${f}`);
    console.log(`[COMMANDES] - ${f} a été lancé.`);
    bot.commands.set(props.help.name, props);
    if (props.help.aliases) {
      props.help.aliases.forEach(alias => bot.aliases.set(alias, props));
    }
  });
});

bot.on("message", async message => {
  con.query(`SELECT * FROM Prefixes WHERE guildID='${message.guild.id}'`, (err, prefix) => {

  
  
  var mprefix;
  var prefix;

  if (!prefix[0]) prefix = "ab!";
  else prefix = prefix[0].prefix;

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (message.content.startsWith("ab!")) mprefix = "ab!";
  if (message.content.startsWith("helixusdev>")) mprefix = "helixusdev>";
  if (message.content.startsWith(prefix)) mprefix = prefix;

  const args = message.content.split(" ").slice(1);
  const cmd = message.content.split(" ")[0];
  con.query(
    `SELECT * FROM Langs WHERE guildID='${message.guild.id}'`,
    (err, langs) => {
      if (!langs[0])
        bot.lang = JSON.parse(fs.readFileSync(`./languages/en.json`, "utf8"));
      else
        bot.lang = JSON.parse(
          fs.readFileSync(`./languages/${langs[0].lang}.json`, "utf8")
        );
    }
  );

  con.query(
    `SELECT * FROM IgnoreChannels WHERE channelID = '${message.channel.id}'`,
    (err, rows) => {
      let auth;

      if (!rows[0]) auth = true;
      else if (rows[0].ignored === "false") auth = true;
      else if (rows[0].ignored === "true") {
        if (message.member.permissions.has("MANAGE_CHANNELS")) auth = true;
        else auth = false;
      }

      if (!mprefix || !message.content.startsWith(mprefix)) return;
      const commandfile =
        bot.commands.get(cmd.slice(mprefix.length)) ||
        bot.aliases.get(cmd.slice(mprefix.length));
      if (commandfile) {
        console.log(auth);
        if (auth === false) return;
        commandfile.run(bot, message, args, con);
      }
    }
  );
});
});

bot.login(config.token);
