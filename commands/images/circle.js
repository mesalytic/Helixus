const Canvas = require('canvas');
    const request = require('node-superfetch');
const Command = require("../../structures/Command");

module.exports = class CircleCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'circle',
            usage: 'circle [url]',
            description: 'Adds a circle around the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().displayAvatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.displayAvatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.CIRCLE.pleaseWait);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);

        const dimensions = avatar.width <= avatar.height ? avatar.width : avatar.height

        const canvas = Canvas.createCanvas(dimensions, dimensions);
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, (canvas.width / 2) - (avatar.width / 2), (canvas.height / 2) - (avatar.height / 2));
        
        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "circle.png" }] });
    }
}