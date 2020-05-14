module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const { version } = require("discord.js");
  const moment = require("moment");
  require("moment-duration-format");
  const os = require("os");
  const cpuStat = require("cpu-stat");
  const { get } = require("axios");

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

    const promises = [
      bot.shard.fetchClientValues("guilds.cache.size"),
      bot.shard.broadcastEval(
        "this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)",
      ),
      bot.shard.broadcastEval("process.memoryUsage().rss"),
    ];

    Promise.all(promises).then(response => {
      get("http://api.github.com/repos/discordjs/discord.js/commits/master", {
        responseType: "json",
      }).then(res => {
        let commit = res.data.sha.substring(0, 6);
        let url = res.data.html_url;

        const embedStats = new Discord.MessageEmbed()
          .setAuthor(bot.user.username, bot.user.avatarURL())
          .setColor("RANDOM")
          .addField(bot.lang.infos.botinfo.creator, "Alicia#7044", true)
          .addField(bot.lang.infos.botinfo.onlinesince, `${duration}`, true)
          .addField(
            bot.lang.infos.botinfo.langage,
            `NodeJS ${process.version}`,
            true,
          )
          .addField(
            bot.lang.infos.botinfo.wrapper,
            `Discord.JS v${version} [[${commit}](${url})]`,
            true,
          )
          .addField(
            bot.lang.infos.botinfo.ramusage,
            genBytes(response[2].reduce((prev, ram) => prev + ram, 0)),
            true,
          )
          .addField(
            bot.lang.infos.botinfo.servers,
            response[0].reduce((prev, servers) => prev + servers, 0),
            true,
          )
          .addField(
            bot.lang.infos.botinfo.users,
            response[1].reduce((prev, users) => prev + users, 0),
            true,
          )
          .addField(
            bot.lang.infos.botinfo.shards,
            `Shard **${bot.shard.ids[0] + 1}**/${bot.shard.count}`,
            true,
          )
          .addField(
            bot.lang.infos.botinfo.cpuusage,
            `\`${percent.toFixed(2)}%\``,
            true,
          )
          .addField(
            bot.lang.infos.botinfo.cpu,
            `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``,
            true,
          )
          .addField(
            bot.lang.infos.botinfo.support,
            "https://discord.gg/UKQNxzu",
            true,
          )
          .addField(
            bot.lang.infos.botinfo.invitation,
            "https://is.gd/LienHelixus",
            true,
          )
          .addField(bot.lang.infos.botinfo.website, "https://aliceraina.moe/helixus/", true);
        message.channel.send(embedStats);
      });
    });
  });
};
module.exports.help = {
  name: "botinfo",
  aliases: ["infos"],
  catégorie: "Infos",
  helpcaté: "infos",
};
