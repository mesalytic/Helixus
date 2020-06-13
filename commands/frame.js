module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 512 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 512 }); }

  const m = await message.channel.send("Please wait...");

  const { createCanvas, loadImage } = require('canvas');
  const request = require('node-superfetch');
  const path = require('path');

  const base = await loadImage(`${process.cwd()}/assets/images/frame.png`);
  const { body } = await request.get(url);
  const data = await loadImage(body);
  const canvas = createCanvas(data.width, data.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(data, 0, 0);
  ctx.drawImage(base, 0, 0, data.width, data.height);
  const attachment = canvas.toBuffer();

  message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: "frame.png" }] })
};
module.exports.help = {
  name: "frame",
  catégorie: "Images",
  helpcaté: "images",
};
