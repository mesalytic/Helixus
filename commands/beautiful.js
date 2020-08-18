module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png" }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png" }); }

  const m = await message.channel.send("Please wait...");

  const { createCanvas, loadImage } = require('canvas');
  const request = require('node-superfetch');
  const path = require('path');

  try {
    const base = await loadImage('./assets/images/plate_beautiful.png');

    const { body } = await request.get(url);
    const avatar = await loadImage(body);

    const canvas = createCanvas(base.width, base.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, base.width, base.height);
    ctx.drawImage(avatar, 249, 24, 105, 105);
    ctx.drawImage(avatar, 249, 223, 105, 105);
    ctx.drawImage(base, 0, 0);

    message.channel.send({
      files: [{ attachment: canvas.toBuffer(), name: "beautiful.png" }],
    })
  } catch (err) {
    throw err;
  }

};
module.exports.help = {
  name: "beautiful",
  catégorie: "Images",
  helpcaté: "images",
};
