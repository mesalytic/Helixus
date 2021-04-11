const Canvas = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const Command = require("../../structures/Command");

module.exports = class SteamPlayingCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'steamplaying',
            usage: 'steamplaying <game>',
            description: 'Lets you create a customized `Steam Playing` card.',
            type: 'images'
        });
    }

    async run(message, args) {
        let game = args.join(" ");
        if (!game) return this.bot.commands.get("help").run(message, ["steamplaying"]);
        if (game.length > 20) return message.reply(message.guild.lang.COMMANDS.STEAMPLAYING.tooLong);

        const m = await message.channel.send(message.guild.lang.COMMANDS.STEAMPLAYING.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/steam-now-playing-classic.png`);

        const {
            body
        } = await request.get(message.author.displayAvatarURL({ format: "png", size: 2048 }));
        const avatar = await Canvas.loadImage(body);

        const canvas = Canvas.createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');

        Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-Regular.ttf`, {
            family: 'Noto'
        });
        Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-CJK.otf`, {
            family: 'Noto'
        });
        Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-Emoji.ttf`, {
            family: 'Noto'
        });

        ctx.drawImage(base, 0, 0);
        ctx.drawImage(avatar, 21, 21, 32, 32);
        ctx.fillStyle = '#90ba3c';
        ctx.font = '10px Noto';
        ctx.fillText(message.author.username, 63, 26);
        ctx.fillText(this.shortenText(ctx, game, 160), 63, 54)

        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({
            files: [{
                attachment: new Buffer(attachment, 'base64'),
                name: "steamplaying.png"
            }]
        });
    }
    shortenText(ctx, text, maxWidth) {
        let shorten = false;
        while (ctx.measureText(`${text}...`).width > maxWidth) {
            if (!shorten) shorten = true;
            text = text.substr(0, text.length - 1);
        }
        return shorten ? `${text}...` : text;
    }
}