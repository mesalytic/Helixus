module.exports.run = async (bot, message, args, con) => {
  if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png" }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png" }); }

  const m = await message.channel.send("Please wait...");

  try {
    const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
  
    const base = await Canvas.loadImage(`${process.cwd()}/assets/images/3000-years.png`);
    const { body } = await request.get(url);
    const data = await Canvas.loadImage(body);
    const canvas = Canvas.createCanvas(base.width, base.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(base, 0, 0);
    ctx.drawImage(data, 461, 127, 200, 200);
    const attachment = canvas.toBuffer();
  
    message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "3000years.png" }] })
  } catch (err){
    throw err;
  }
  
};
module.exports.help = {
  name: "3000years",
  catégorie: "Images",
  helpcaté: "images",
};
