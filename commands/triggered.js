module.exports.run = async (bot, message, args, con) => {
  const { get } = require("axios");

  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 512 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 512 }); }

  const m = await message.channel.send("Please wait...");

  const { createCanvas, loadImage } = require('canvas');
  const GIFEncoder = require('gifencoder');
  const request = require('node-superfetch');
  const path = require('path');
  const { streamToArray, drawImageWithTint } = require('../util/Util');
  const coord1 = [-25, -33, -42, -14];
  const coord2 = [-25, -13, -34, -10];

  const base = await loadImage(`${process.cwd()}/assets/images/triggered.png`);
  const { body } = await request.get(url);
  const avatar = await loadImage(body);
  const encoder = new GIFEncoder(base.width, base.width);
  const canvas = createCanvas(base.width, base.width);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, base.width, base.width);
  const stream = encoder.createReadStream();
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(50);
  encoder.setQuality(200);
  for (let i = 0; i < 4; i++) {
    drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
    ctx.drawImage(base, 0, 218, 256, 38);
    encoder.addFrame(ctx);
  }
  encoder.finish();
  const buffer = await streamToArray(stream);
  return message.channel.send({ files: [{ attachment: Buffer.concat(buffer), name: 'triggered.gif' }] });

};
module.exports.help = {
  name: "triggered",
  aliases: ["trigger"],
  catégorie: "Images",
  helpcaté: "images",
};
