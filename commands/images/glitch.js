const Canvas = require('canvas');
    const request = require('node-superfetch');
const Command = require("../../structures/Command");

module.exports = class GlitchCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'glitch',
            usage: 'glitch [url]',
            description: 'Glitches the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().displayAvatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.displayAvatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.GLITCH.pleaseWait);
        
        const { body } = await request.get(url);
        const avatar = await Canvas.loadImage(body);

        const canvas = Canvas.createCanvas(avatar.width, avatar.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(avatar, 0, 0);
        this.glitch(ctx, 20, 0, 0, avatar.width, avatar.height, 5)

        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "glitch.png" }] });
    }
    glitch(ctx, amplitude, x, y, width, height, strideLevel = 4) {
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
}