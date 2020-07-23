const { MessageEmbed } = require('discord.js');
const { setUnionDependencies } = require('mathjs');

module.exports.run = async (bot, message, args, con) => {
  const axios = require('axios');
  var color = Math.random()
    .toString(16)
    .slice(2, 8)
    .toUpperCase();

    axios({
      method: 'get',
      url: `http://thecolorapi.com/id?hex=${color}&format=json`
    }).then(res => {
      let e = new MessageEmbed()
        .setTitle(res.data.name.value)
        .setDescription(`[${bot.lang.membres.randomhexcolor.link}](https://www.colorhexa.com/${color})`)
        .setColor(`#${color}`)
        .setThumbnail(`https://www.colorhexa.com/${color}.png`)
        .addField("Hex", res.data.hex.value, true)
        .addField("RGB", res.data.rgb.value, true)
        .addField("HSL", res.data.hsl.value, true)
        .addField("HSV", res.data.hsv.value, true)
        .addField("CMYK", res.data.cmyk.value, true)
        .addField("XYZ", res.data.XYZ.value, true)
      console.log(res.data);
      message.channel.send(e);
    })


/*  const regex = /\${color}/g;
  const str = bot.lang.membres.randomhexcolor.res.replace(regex, color);
  message.channel.send(str);*/
};
module.exports.help = {
  name: "color",
  aliases: ["randomcolor"],
  catégorie: "Membres",
  helpcaté: "membres",
};
