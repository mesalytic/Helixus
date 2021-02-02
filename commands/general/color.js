const {
    MessageEmbed
} = require("discord.js");
const request = require('node-superfetch');

const Command = require("../../structures/Command");

module.exports = class ColorCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'color',
            type: 'general',
            description: 'Displays informations about a random color.',
            usage: 'color',
        });
    }

    async run(message, args) {

        let randomColor = Math.random().toString(16).slice(2, 8).toUpperCase();

        let {
            body: color
        } = await request.get(`http://thecolorapi.com/id?hex=${randomColor}&format=json`)

        let embed = new MessageEmbed()
            .setTitle(color.name.value)
            .setDescription(`[${message.guild.lang.COMMANDS.COLOR.link}](https://www.colorhexa.com/${randomColor})`)
            .setColor(`#${randomColor}`)
            .setThumbnail(`https://www.colorhexa.com/${randomColor}.png`)
            .addField("Hex", color.hex.value, true)
            .addField("RGB", color.rgb.value, true)
            .addField("HSL", color.hsl.value, true)
            .addField("HSV", color.hsv.value, true)
            .addField("CMYK", color.cmyk.value, true)
            .addField("XYZ", color.XYZ.value, true)

        message.channel.send(embed);
    }
}