module.exports.run = async (bot, message, args, con) => {
  const { MessageEmbed } = require('discord.js');
  const request = require('node-superfetch');
  const { shorten, base64, eURL } = require('../util/Util');
  const config = require('../config.json');

  try {
    const { body } = await request
    .get(`https://api.github.com/repos/${config.github.repo_username}/${config.github.repo_name}/commits`)
    .set({ Authorization: `Basic ${base64(`${config.github.username}:${config.github.password}`)}` });

  const commits = body.slice(0, 4);
  const embed = new MessageEmbed()
    .setTitle(`[${config.github.repo_name}:master]`)
    .setColor("RANDOM")
    .setURL(`https://github.com/${config.github.repo_username}/${config.github.repo_name}/commits/master`)
    .setDescription(commits.map(commit => {
      const hash = eURL(`\`${commit.sha.slice(0, 7)}\``, commit.html_url);
      return `${hash} ${shorten(commit.commit.message.split('\n')[0], 50)} - ${commit.author.login}`;
    }).join('\n'));

    return message.channel.send(embed);
  } catch (e) {
    throw e;
  }
};
module.exports.help = {
  name: "changelog",
  catégorie: "Membres",
  helpcaté: "membres",
};
