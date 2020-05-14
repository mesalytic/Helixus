module.exports.run = async (bot, message, args, con) => {
  if (!message.channel.permissionsFor (message.author).has ('MANAGE_ROLES'))
    return message.channel.send (bot.lang.mods.mute.unotperm);
  if (!message.channel.permissionsFor (bot.user).has ('MANAGE_ROLES'))
    return message.channel.send (bot.lang.mods.mute.bnotperm);

  var muteRole = message.guild.roles.cache.find (r => r.name === 'HMuted');

  let member = message.mentions.members.first ();
  if (!member) return message.channel.send (bot.lang.mods.mute.noment);
  if (member.permissions.has ('MANAGE_ROLES'))
    return message.reply (bot.lang.mods.mute.notposs);

  if (!muteRole) {
    let m = await message.channel.send (bot.lang.mods.mute.first1);
    message.guild.roles
      .create ({
        data: {
          name: 'HMuted',
          permissions: 0,
        },
      })
      .then (role => {
        m.edit (bot.lang.mods.mute.first2);
        message.guild.channels.forEach (chan => {
          if (
            chan.type === 'dm' ||
            chan.type === 'group' ||
            chan.type === 'category' ||
            chan.type === 'unknown'
          )
            return;
          if (chan.type === 'voice') {
            chan.createOverwrite (role.id, {
              SPEAK: false,
            });
          }
          if (chan.type === 'text') {
            chan.createOverwrite (role.id, {
              SEND_MESSAGES: false,
            });
          }
        });
      });
    m.edit (bot.lang.mods.mute.first3);
  }
  let rolearray = [];
  member.roles.map (roles => {
    if (roles.managed) return;
    if (roles.id === message.guild.id) return;
    rolearray.push (roles.id);
    con.query (
      `SELECT * FROM MuteRoles WHERE mutedID='${member.id}' AND roleID='${roles.id}' AND guildID='${message.guild.id}'`,
      (err, rows) => {
        if (!rows[0])
          con.query (
            `INSERT INTO MuteRoles (roleID, mutedID, guildID) VALUES ('${roles.id}', '${member.id}', '${message.guild.id}')`,
          );
      },
    );
  });
  member.roles.remove (rolearray).then (() => {
    var mRole = message.guild.roles.cache.find (r => r.name === 'HMuted');
    member.roles.add (mRole.id, 'Mute Helixus');
    let str = bot.lang.mods.mute.muted
      .replace ('${member.user.tag}', member.user.tag)
      .replace ('${member.id}', member.id)
      .replace ('${message.author.tag}', message.author.tag)
      .replace ('${message.author.id}', message.author.id);
    message.channel.send (str);
  });
};
module.exports.help = {
  name: "mute",
  catégorie: "Modération",
  helpcaté: "mods",
};
