const Canvas = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const GIFEncoder = require('gifencoder');
const Command = require("../../structures/Command");

module.exports = class FireCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'fire',
            usage: 'fire [url]',
            description: 'Sends a GIF with a fire effect.',
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
                size: 2048
            });
        } else {
            url = args[0] ? args[0] : message.author.avatarURL({
                format: "png",
                size: 2048
            });
        }

        const m = await message.channel.send(message.guild.lang.COMMANDS.FIRE.pleaseWait);

        const {
            body
        } = await request.get(url);
        const avatar = await Canvas.loadImage(body);

        const encoder = new GIFEncoder(avatar.width, avatar.width);
        const canvas = Canvas.createCanvas(avatar.width, avatar.height);
        const ctx = canvas.getContext('2d');
        const stream = encoder.createReadStream();

        encoder.start();
        encoder.setRepeat(100);
        encoder.setDelay(100);
        encoder.setQuality(200);
        for (let i = 0; i < 31; i += 2) {
            const frameID = `frame-${i.toString().padStart(2, '0')}.png`;
            const frame = await Canvas.loadImage(`${process.cwd()}/assets/images/fire/${frameID}`)
            const ratio = frame.width / frame.height;
            const height = Math.round(avatar.width / ratio);
            this.drawImageWithTint(ctx, avatar, '#fc671e', 0, 0, avatar.width, avatar.height);
            ctx.drawImage(frame, 0, avatar.height - height, avatar.width, height);
            encoder.addFrame(ctx);
        }
        encoder.finish();
        const buffer = await this.streamToArray(stream);

        m.delete();
        message.channel.send({
            files: [{
                attachment: new Buffer.concat(buffer),
                name: "fire.gif"
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