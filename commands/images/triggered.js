const Canvas = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const GIFEncoder = require('gifencoder');
const Command = require("../../structures/Command");

module.exports = class TriggeredCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'triggered',
            usage: 'triggered [url]',
            description: 'Sends a GIF with the Triggered effect.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) {
            url = message.attachments.first().url;
        } else if (message.mentions.users.first()) {
            url = message.mentions.users.first().avatarURL({
                format: "png",
                size: 512
            });
        } else {
            url = args[0] ? args[0] : message.author.avatarURL({
                format: "png",
                size: 512
            });
        }

        const m = await message.channel.send(message.guild.lang.COMMANDS.TRIGGERED.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/triggered.png`);

        const {
            body
        } = await request.get(url);
        const avatar = await Canvas.loadImage(body);

        const encoder = new GIFEncoder(base.width, base.width);

        const canvas = Canvas.createCanvas(base.width, base.width);
        const ctx = canvas.getContext('2d');

        const stream = encoder.createReadStream();

        const coord1 = [-25, -33, -42, -14];
  const coord2 = [-25, -13, -34, -10];

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, base.width, base.width);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(50);
        encoder.setQuality(200);
        for (let i = 0; i < 4; i++) {
            this.drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
            ctx.drawImage(base, 0, 218, 256, 38);
            encoder.addFrame(ctx);
        }

        encoder.finish();
        const buffer = await this.streamToArray(stream);

        m.delete();
        message.channel.send({
            files: [{
                attachment: new Buffer.concat(buffer),
                name: "triggered.gif"
            }]
        });
    }
    drawImageWithTint(ctx, image, color, x, y, width, height) {
        const { fillStyle, globalAlpha } = ctx;
        ctx.fillStyle = color;
        ctx.drawImage(image, x, y, width, height);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = fillStyle;
        ctx.globalAlpha = globalAlpha;
    }
    streamToArray(stream) {
        if (!stream.readable) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            const array = [];
            function onData(data) {
                array.push(data);
            }
            function onEnd(error) {
				if (error) reject(error);
				else resolve(array);
				cleanup();
			}
			function onClose() {
				resolve(array);
				cleanup();
			}
			function cleanup() {
				stream.removeListener('data', onData);
				stream.removeListener('end', onEnd);
				stream.removeListener('error', onEnd);
				stream.removeListener('close', onClose);
			}
			stream.on('data', onData);
			stream.on('end', onEnd);
			stream.on('error', onEnd);
			stream.on('close', onClose);
        })
    }
}