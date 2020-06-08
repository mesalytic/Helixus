module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png" }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png" }); }

  const m = await message.channel.send("Please wait...");

  try {
    const { createCanvas, loadImage } = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');

    const base = await loadImage(`${process.cwd()}/assets/images/bobross.png`);
    const { body } = await request.get(url);
    const avatar = await loadImage(body);
    const canvas = createCanvas(base.width, base.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, base.width, base.height);
    ctx.drawImage(avatar, 15, 20, 440, 440);
    ctx.drawImage(base, 0, 0);
    return message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'bobross.png' }] });
  } catch (err) {
    throw err;
  }
};
module.exports.help = {
  name: "bobross",
  aliases: ["bob"],
  catégorie: "Images",
  helpcaté: "images",
};
