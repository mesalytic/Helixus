module.exports.run = async (bot, message, args, con) => {
  const ms = require("ms");

  if (!message.member.permissions.has("MANAGE_CHANNELS"))
    return message.channel.send(bot.lang.mods.lockdown.noperm);

  con.query(
    `SELECT * FROM LockdownChannels WHERE channelID='${message.channel.id}'`,
    (err, rows) => {
      let lockit = [];

      let time = args.join(" ");
      let validUnlocks = ["release", "unlock", "debloque", "débloque", "reset"];

      if (!time) return message.channel.send(bot.lang.mods.lockdown.usage);
      if (validUnlocks.includes(time)) {
        if (!rows[0]) return message.reply("bot.lang.mods.lockdown.notlocked");
        message.channel
          .createOverwrite(message.guild.id, {
            SEND_MESSAGES: null
          })
          .then(() => {
            message.channel.send(bot.lang.mods.lockdown.unlocked);
            clearTimeout(lockit[message.channel.id]);
            con.query(
              `DELETE FROM LockdownChannels WHERE channelID='${message.channel.id}'`
            );
          })
          .catch(error => {
            throw error;
          });
      } else {
        message.channel
          .createOverwrite(message.guild.id, {
            SEND_MESSAGES: false
          })
          .then(() => {
            let str = bot.lang.mods.lockdown.locked;
            let res = str.replace(
              "${ms(ms(time), { long:true })}",
              ms(ms(time), {
                long: true
              })
            );
            con.query(
              `INSERT INTO LockdownChannels (channelID, time) VALUES ('${
                message.channel.id
              }', '${Number(new Date().getTime()) + Number(ms(time))}')`
            );
            message.channel
              .send(res)
              .then(() => {
                lockit[message.channel.id] = setTimeout(() => {
                  message.channel
                    .createOverwrite(message.guild.id, {
                      SEND_MESSAGES: null
                    })
                    .then(message.channel.send(bot.lang.mods.lockdown.unlocked))
                    .catch(console.error);
                  con.query(
                    `DELETE FROM LockdownChannels WHERE channelID='${message.channel.id}'`
                  );
                }, ms(time));
              })
              .catch(error => {
                console.log(error);
              });
          });
      }
    }
  );
};
module.exports.help = {
  name: "lockdown",
  aliases: ["lock"],
  catégorie: "Modération",
  helpcaté: "mods"
};
