module.exports.run = async (bot, message, args, con) => {
  const request = require("node-superfetch");
  
  try {
    const { body } = await request
      .get("https://api.qrserver.com/v1/create-qr-code/")
      .query({
        data: args.join(" ")
      });
    return message.channel.send({
      files: [
        {
          attachment: body,
          name: "qr-code.png"
        }
      ]
    });
  } catch (err) {
    const str = bot.lang.images.qrcode.error.replace("${err.message}", err.message);
    return message.reply(str);
  }
};
module.exports.help = {
  name: "qrcode",
  catégorie: "Images",
  helpcaté: "images"
};
