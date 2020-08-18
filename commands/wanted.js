module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 512 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 512 }); }

  const m = await message.channel.send("Please wait...");

  const Canvas = require('canvas');
  const request = require('node-superfetch');
  const path = require('path');

  const base = await Canvas.loadImage(`${process.cwd()}/assets/images/wanted.png`);
  const { body } = await request.get(url);
  const avatar = await Canvas.loadImage(body);
  const canvas = Canvas.createCanvas(base.width, base.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(base, 0, 0);
  ctx.drawImage(avatar, 150, 360, 430, 430);
  sepia(ctx, 150, 360, 430, 430);

  message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: "wanted.png" }] })
};
module.exports.help = {
  name: "wanted",
  catégorie: "Images",
  helpcaté: "images",
};

function sepia(ctx, x, y, width, height) {
  const data = ctx.getImageData(x, y, width, height);
  for (let i = 0; i < data.data.length; i += 4) {
    const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
    data.data[i] = brightness + 100;
    data.data[i + 1] = brightness + 50;
    data.data[i + 2] = brightness
  }
  ctx.putImageData(data, x, y);
  return ctx;
}