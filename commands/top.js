module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const fetch = require("node-fetch");
  const qbin = (q, e, s) =>
    fetch("https://qbin.io", {
      method: "PUT",
      body: q,
      headers: {
        e,
        s,
      },
    }).then(y => y.text());

  con.query(
    `SELECT * FROM LevelsConfig WHERE guildID='${message.guild.id}'`,
    (err, cRows) => {
      con.query(
        `SELECT * FROM Levels WHERE guild = ${message.guild.id} ORDER BY level DESC, points DESC LIMIT 10;`,
        (err, rows) => {
          con.query(
            `SELECT * FROM Levels WHERE guild = ${message.guild.id} ORDER BY points DESC, level DESC LIMIT 99999999;`,
            (err, top) => {
              if (!cRows[0] || cRows[0].activated === "false")
                return message.reply(bot.lang.levels.top.disabled);
              let msgtop = "";
              const n = 0;

              for (let i = 0; i < rows.length; i++) {
                const diff = 5 * (rows[i].level ^ 2) + 50 * rows[i].level + 100;
                const u = bot.users.resolve(rows[i].user);
                if (i == 0) {
                  if (!u)
                    msgtop += `[${i + 1}] :first_place: **${
                      bot.lang.levels.top.notfound
                    }** - Level ${rows[i].level} | (${
                      rows[i].points
                    }/${diff} XP)\n`;
                  else
                    msgtop += `[${i + 1}] :first_place: **${u.tag}** - Level ${
                      rows[i].level
                    } | (${rows[i].points}/${diff} XP)\n`;
                } else if (i == 1) {
                  if (!u)
                    msgtop += `[${i + 1}] :second_place: **${
                      bot.lang.levels.top.notfound
                    }** - Level ${rows[i].level} | (${
                      rows[i].points
                    }/${diff} XP)\n`;
                  else
                    msgtop += `[${i + 1}] :second_place: **${u.tag}** - Level ${
                      rows[i].level
                    } | (${rows[i].points}/${diff} XP)\n`;
                } else if (i == 2) {
                  if (!u)
                    msgtop += `[${i + 1}] :third_place: **${
                      bot.lang.levels.top.notfound
                    }** - Level ${rows[i].level} | (${
                      rows[i].points
                    }/${diff} XP)\n`;
                  else
                    msgtop += `[${i + 1}] :third_place: **${u.tag}** - Level ${
                      rows[i].level
                    } | (${rows[i].points}/${diff} XP)\n`;
                } else {
                  if (!u) {
                    msgtop += `[${i + 1}] :military_medal: **${
                      bot.lang.levels.top.notfound
                    }** - Level ${rows[i].level} | (${
                      rows[i].points
                    }/${diff} XP) \n`;
                  } else
                    msgtop += `[${i + 1}] :military_medal: **${
                      u.tag
                    }** - Level ${rows[i].level} | (${
                      rows[i].points
                    }/${diff} XP)\n`;
                }
              }

              con.query(
                `SELECT * FROM Levels WHERE guild = ${message.guild.id} ORDER BY level DESC, points DESC;`,
                (err, top) => {
                  var topall = "";

                  for (let k = 0; k < top.length; k++) {
                    const topDiff =
                      5 * (top[k].level ^ 2) + 50 * top[k].level + 100;
                    const user = bot.users.resolve(top[k].user);
                    if (!user)
                      topall += `[${k + 1}] ${
                        bot.lang.levels.top.notfound
                      } - Level ${top[k].level} | (${
                        top[k].points
                      }/${topDiff} XP)\n`;
                    else
                      topall += `[${k + 1}] ${user.tag} - Level ${
                        top[k].level
                      } | (${top[k].points}/${topDiff} XP)\n`;
                  }

                  qbin(topall, 0, "none").then(m => {
                    const embed = new Discord.MessageEmbed()
                      .setTitle(
                        `${bot.lang.levels.top.top10} **${message.guild.name}** !`,
                      )
                      .setAuthor(message.guild.name, message.guild.iconURL())
                      .setDescription(`${msgtop}\n[Guild Leaderboard](${m})`)
                      .setColor("RANDOM");
                    return message.channel.send({
                      embed,
                    });
                  });
                },
              );
            },
          );
        },
      );
    },
  );
};

module.exports.help = {
  name: "top",
  catégorie: "Levels",
  helpcaté: "levels",
};
