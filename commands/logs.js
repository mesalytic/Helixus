module.exports.run = async (bot, message, args, con) => {
  const fs = require ('fs');

  if (!message.member.permissions.has ('MANAGE_CHANNELS'))
    return message.reply (bot.lang.admin.logs.noperms);
  con.query (
    `SELECT * FROM Logs WHERE guildID = '${message.guild.id}'`,
    (err, rows) => {
      if (!args[0]) return message.reply (bot.lang.admin.logs.noargs);

      if (args[0] === 'on') {
        if (!rows[0]) {
          con.query (
            `INSERT INTO Logs (guildID, channelID) VALUES ('${message.guild.id}', NULL)`
          );
          message.channel.send (bot.lang.admin.logs.on_success);
        } else {
          if (rows[0].activated === 'false') {
            con.query (
              `UPDATE Logs SET activated = "true" WHERE guildID='${message.guild.id}'`
            );
            message.channel.send (bot.lang.admin.logs.on_success);
          } else return message.reply (bot.lang.admin.logs.on_alreadyActivated);
        }
      } else if (args[0] === 'off') {
        if (!rows[0])
          return message.reply (bot.lang.admin.logs.off_alreadyDisabled);
        else {
          if (rows[0].activated === 'false')
            return message.reply (bot.lang.admin.logs.off_alreadyDisabled);
          else {
            con.query (
              `UPDATE Logs SET activated = "false" WHERE guildID='${message.guild.id}'`
            );
            message.channel.send (bot.lang.admin.logs.off_success);
          }
        }
      } else if (args[0] === 'ignore') {
        const channels = message.mentions.channels;
        if (!channels.first ())
          return message.reply (bot.lang.admin.logs.ignore_nochans);
        let m = bot.lang.admin.logs.ignore_m;
        let s = bot.lang.admin.logs.ignore_s;

        con.query (
          `SELECT * FROM LogsIgnore WHERE channelID='${channels.first ().id}'`,
          (err, liRows) => {
            if (!liRows[0]) {
              con.query (
                `INSERT INTO LogsIgnore (guildID, channelID, ignored) VALUES ('${message.guild.id}', '${channels.first ().id}', 'true')`
              );
              m += `${channels.first ()}, `;
            } else if (liRows[0].ignored === 'false') {
              con.query (
                `UPDATE LogsIgnore SET ignored = "true" WHERE channelID='${channels.first ().id}'`
              );
              m += `${channels.first ()}, `;
            } else {
              con.query (
                `UPDATE LogsIgnore SET ignored = "false" WHERE channelID='${channels.first ().id}'`
              );
              s += `${channels.first ()}, `;
            }
            if (m === bot.lang.admin.logs.ignore_m) m = '';
            m += bot.lang.admin.logs.ignore_madd;
            const rm = m.replace (
              bot.lang.admin.logs.ignore_mrep1,
              bot.lang.admin.logs.ignore_mrep2
            );
            if (s === bot.lang.admin.logs.ignore_s) s = '';
            s += bot.lang.admin.logs.ignore_sadd;
            const rs = s.replace (
              bot.lang.admin.logs.ignore_srep1,
              bot.lang.admin.logs.ignore_srep2
            );
            const ms = rm + rs;
            message.channel.send (ms);
          }
        );
      } else if (args[0] === 'channel') {
        const channel = message.mentions.channels.first ();
        if (!channel)
          return message.reply (bot.lang.admin.logs.channel_nochans);
        if (!rows[0])
          return message.reply (bot.lang.admin.logs.channel_['not-activated']);
        else if (rows[0].activated === 'false')
          return message.reply (bot.lang.admin.logs.channel_['not-activated']);
        else {
          con.query (
            `UPDATE Logs SET channelID = '${channel.id}' WHERE guildID = '${message.guild.id}'`
          );
          const str = bot.lang.admin.logs.channel_success
            .replace ('${channel.id}', channel.id)
            .replace ('${channel.id}', channel.id);
          message.channel.send (str);
        }
      } else if (args[0] === 'mods') {
        if (!rows[0])
          return message.reply (bot.lang.admin.logs.mods_notActivated);
        if (!args[1])
          return logsList (con, message.guild.id, message.channel, bot);
        const mods = [
          'channelcreate',
          'channeldelete',
          'emojicreate',
          'emojidelete',
          'emojiupdate',
          'guildbanadd',
          'guildbanremove',
          'guildmemberupdate',
          'guildmemberadd',
          'guildmemberremove',
          'messagedelete',
          'messagedeletebulk',
          'messageupdate',
          'rolecreate',
          'roledelete',
          'voicestateupdate',
        ];
        if (mods.includes (args[1].toLowerCase ())) {
          if (rows[0][args[1].toLowerCase ()] === 'true') {
            con.query (
              `UPDATE Logs SET ${args[1].toLowerCase ()} = "false" WHERE guildID = '${message.guild.id}'`
            );
            message.channel.send (
              bot.lang.admin.logs['mods_disabled'].replace (
                '${args[1].toLowerCase()}',
                args[1].toLowerCase ()
              )
            );
          } else {
            con.query (
              `UPDATE Logs SET ${args[1].toLowerCase ()} = "true" WHERE guildID = '${message.guild.id}'`
            );
            message.channel.send (
              bot.lang.admin.logs['mods_activated'].replace (
                '${args[1].toLowerCase()}',
                args[1].toLowerCase ()
              )
            );
          }
        } else return logsList (con, message.guild.id, message.channel, bot);
      }
    }
  );
};
module.exports.help = {
  name: 'logs',
  catégorie: 'Administration',
  helpcaté: 'admin',
};
function logsList (con, guildID, channel, bot) {
  con.query (`SELECT * FROM Logs WHERE guildID='${guildID}'`, (err, rows) => {
    if (!rows[0]) throw err;
    const str = bot.lang.admin.logs.mods_noArgs
      .replace ('${one()}', rows[0].channelcreate === 'true' ? '✅' : '❌')
      .replace ('${two()}', rows[0].channeldelete === 'true' ? '✅' : '❌')
      .replace ('${three()}', rows[0].emojicreate === 'true' ? '✅' : '❌')
      .replace ('${four()}', rows[0].emojidelete === 'true' ? '✅' : '❌')
      .replace ('${five()}', rows[0].emojiupdate === 'true' ? '✅' : '❌')
      .replace ('${six()}', rows[0].guildbanadd === 'true' ? '✅' : '❌')
      .replace ('${seven()}', rows[0].guildbanremove === 'true' ? '✅' : '❌')
      .replace ('${eight()}', rows[0].guildmemberupdate === 'true' ? '✅' : '❌')
      .replace ('${nine()}', rows[0].guildmemberadd === 'true' ? '✅' : '❌')
      .replace ('${ten()}', rows[0].guildmemberremove === 'true' ? '✅' : '❌')
      .replace ('${eleven()}', rows[0].messagedelete === 'true' ? '✅' : '❌')
      .replace ('${twelve()}', rows[0].messageupdate === 'true' ? '✅' : '❌')
      .replace (
        '${thirteen()}',
        rows[0].messagedeletebulk === 'true' ? '✅' : '❌'
      )
      .replace ('${fourteen()}', rows[0].rolecreate === 'true' ? '✅' : '❌')
      .replace ('${fifteen()}', rows[0].roledelete === 'true' ? '✅' : '❌')
      .replace (
        '${sixteen()}',
        rows[0].voicestateupdate === 'true' ? '✅' : '❌'
      );
    channel.send (str);
  });
}
