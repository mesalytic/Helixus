module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 512 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 512 }); }

  const m = await message.channel.send("Please wait...");

  try {
    const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');

    function distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
      const data = ctx.getImageData(x, y, width, height);
      const temp = ctx.getImageData(x, y, width, height);
      const stride = width * strideLevel;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
          const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
          const dest = (j * stride) + (i * strideLevel);
          const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
          data.data[dest] = temp.data[src];
          data.data[dest + 1] = temp.data[src + 1];
          data.data[dest + 2] = temp.data[src + 2];
        }
      }
      ctx.putImageData(data, x, y);
      return ctx;
    }

    const { body } = await request.get(url);
    const data = await Canvas.loadImage(body);
    const canvas = Canvas.createCanvas(data.width, data.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(data, 0, 0);
    distort(ctx, 15, 0, 0, data.width, data.height);

    message.channel.send({ files: [{ attachment: await canvas.toBuffer(), name: "distort.png" }] })
  } catch (err) {
    throw err;
  }
};
module.exports.help = {
  name: "distort",
  catégorie: "Images",
  helpcaté: "images",
};
