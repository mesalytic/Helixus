module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const { version } = require("discord.js");
  const moment = require("moment");
  require("moment-duration-format");
  const os = require("os");
  const cpuStat = require("cpu-stat");

  let cpuLol;
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }

    function genBytes(amt) {
      const endings = ["B", "KB", "MB", "GB", "TB"];
      const end = "GB";
      for (const i in endings) {
        if (amt / 1000 < 1 || endings[i] === endings.slice(-1)[0])
          return amt.toFixed(2) + ` ${endings[i]}`;
        else amt /= 1000;
      }
    }
    genBytes(process.memoryUsage().rss);
    const duration = moment
      .duration(bot.uptime)
      .format("D [d], H[h] m[m] s[s]");
    bot.shard.broadcastEval("this.guilds.size").then(sh => {
      bot.shard.broadcastEval("this.users.size").then(us => {
        bot.shard.broadcastEval("this.channels.size").then(ch => {
          bot.shard.broadcastEval("process.memoryUsage().rss").then(ram => {
            let sn = 0;
            let un = 0;
            let cn = 0;
            let ramn = 0;
            for (let i = 0; i < bot.shard.count; i++) {
              var shstr = String(sh).split("\n");
              var sharray = JSON.parse("[" + shstr + "]");
              sn += sharray[i];
            }
            for (let k = 0; k < bot.shard.count; k++) {
              var usstr = String(us).split("\n");
              var usarray = JSON.parse("[" + usstr + "]");
              un += usarray[k];
            }
            for (let j = 0; j < bot.shard.count; j++) {
              var chstr = String(ch).split("\n");
              var charray = JSON.parse("[" + chstr + "]");
              cn += charray[j];
            }
            for (let m = 0; m < bot.shard.count; m++) {
              var ramstr = String(ram).split("\n");
              var ramarray = JSON.parse("[" + ramstr + "]");
              ramn += ramarray[m];
            }
            const embedStats = new Discord.MessageEmbed()
              .setAuthor(bot.user.username, bot.user.avatarURL())
              .setColor("RANDOM")
              .addField(bot.lang.infos.botinfo.creator, "Alicia#7044", true)
              .addField(bot.lang.infos.botinfo.onlinesince, `${duration}`, true)
              .addField(
                bot.lang.infos.botinfo.langage,
                `NodeJS ${process.version}`,
                true
              )
              .addField(
                bot.lang.infos.botinfo.wrapper,
                `Discord.JS v${version}`,
                true
              )
              .addField(bot.lang.infos.botinfo.ramusage, `${genBytes(ramn)}`, true)
              .addField(
                bot.lang.infos.botinfo.servers,
                `${sn.toLocaleString()}`,
                true
              )
              .addField(
                bot.lang.infos.botinfo.users,
                `${un.toLocaleString()}`,
                true
              )
              .addField(
                bot.lang.infos.botinfo.shards,
                `Shard **${bot.shard.id + 1}**/${bot.shard.count}`,
                true
              )
              .addField(
                bot.lang.infos.botinfo.cpuusage,
                `\`${percent.toFixed(2)}%\``,
                true
              )
              .addField(
                bot.lang.infos.botinfo.cpu,
                `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``,
                true
              )
              .addField(
                bot.lang.infos.botinfo.support,
                "https://discord.gg/UKQNxzu",
                true
              )
              .addField(
                bot.lang.infos.botinfo.invitation,
                "https://is.gd/LienHelixus",
                true
              )
              .addField(
                bot.lang.infos.botinfo.website,
                "https://helixus.fr",
                true
              );
            message.channel.send(embedStats);
          });
        });
      });
    });
  });
};
module.exports.help = {
  name: "botinfo",
  aliases: ["infos"],
  catégorie: "Infos",
  helpcaté: "infos"
};
