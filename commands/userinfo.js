module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const moment = require("moment");

  const ment = message.mentions.users.first();
  const member = message.guild.member(message.author);
  const mentmember = message.guild.member(ment);

  if (!ment) {
    var rlist;
    var rmap = "";

    member.roles.cache.map(role => {
      if (role.id === message.guild.id) return;
      rmap += `<@&${role.id}>, `;
    });
    rmap = rmap.slice(0, -1);

    if (rmap.length > 1000) rlist = `(${member.roles.cache.size} roles)`;
    if (rmap.length < 1) rlist = "No role.";
    else rlist = rmap;

    let uPresence;
    if (message.author.presence.activities[0]) {
      if (message.author.presence.activities[0].type === "CUSTOM_STATUS") {
        uPresence = `Custom Status: ${message.author.presence.activities[0].state}`
      } else uPresence = message.author.presence.activities[0].name
    } else uPresence = bot.lang.infos.userinfo.none

    const nomentembed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField(":page_with_curl: Tag", message.author.tag, true)
      .addField(":id: ID", message.author.id, true)
      .addField(
        bot.lang.infos.userinfo.status,
        (status = bot.lang.infos.userinfo[message.author.presence.status]),
        true,
      )
      .addField(
        bot.lang.infos.userinfo.createdthe,
        `${moment(message.author.createdAt).format(
          bot.lang.infos.userinfo.createddate,
        )}`,
        true,
      )
      .addField(
        bot.lang.infos.userinfo.game,
        `${
          uPresence
        }`,
        true,
      )
      .addField(bot.lang.infos.userinfo.roles, rlist, true)
      .setThumbnail(message.author.avatarURL());
    return message.channel.send(nomentembed);
  } else if (ment) {
    let rlist;
    let rmap = "";
    mentmember.roles.cache.map(role => {
      if (role.id === message.guild.id) return;
      rmap += `<@&${role.id}>, `;
    });
    rmap = rmap.slice(0, -1);
    if (rmap.length < 1) rlist = "No role";
    if (rmap.length > 1000) rlist = `(${mentmember.roles.cache.size} roles)`;
    else rlist = rmap;
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField(":page_with_curl: Tag", ment.tag, true)
      .addField(":id: ID", ment.id, true)
      .addField(
        bot.lang.infos.userinfo.status,
        bot.lang.infos.userinfo[message.author.presence.status],
        true,
      )
      .addField(
        bot.lang.infos.userinfo.createdthe,
        `${moment(message.author.createdAt).format(
          bot.lang.infos.userinfo.createddate,
        )}`,
        true,
      )
      .addField(
        bot.lang.infos.userinfo.game,
        `${
          ment.presence.activity
            ? ment.presence.activity.name
            : bot.lang.infos.userinfo.none
        }`,
        true,
      )
      .addField(bot.lang.infos.userinfo.roles, rlist, true)
      .setThumbnail(ment.avatarURL());
    message.channel.send(embed);
  }
};
module.exports.help = {
  name: "userinfo",
  catégorie: "Infos",
  helpcaté: "infos",
};
