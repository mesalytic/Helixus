const Canvas = require('canvas');
    const request = require('node-superfetch');
    const path = require('path');
const Command = require("../../structures/Command");

module.exports = class SpotifyNowPlayingCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'spotifynowplaying',
            usage: 'spotifynowplaying <songName> | <artist>',
            description: 'Allows you to create a customized Spotify Now Playing card.',
            type: 'images',
            examples: ["spotifynowplaying girl in red | we fell in love in october"]
        });
    }

    async run(message, args) {

        if (!args[0]) return this.bot.commands.get("help").run(message, ["spotifynowplaying"]);
        
        let spotifyArgs = args.join(" ").split(" | ");
        if (!spotifyArgs[0] || !spotifyArgs[1]) return this.bot.commands.get("help").run(message, ["spotifynowplaying"]);

        const m = await message.channel.send(message.guild.lang.COMMANDS.SPOTIFYNOWPLAYING.pleaseWait);

        const base = await Canvas.loadImage(`${process.cwd()}/assets/images/spotify.png`);
        
        const { body } = await request.get(message.author.displayAvatarURL({ format: "png", size: 512 }));
        const avatar = await Canvas.loadImage(body);
        
        const canvas = Canvas.createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d');

        const height = 504 / avatar.width;

        Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-Regular.ttf`, {
            family: 'Noto'
        });
        Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-CJK.otf`, {
            family: 'Noto'
        });
        Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-Emoji.ttf`, {
            family: 'Noto'
        });
        Canvas.registerFont(`${process.cwd()}/assets/fonts/Noto-Bold.ttf`, {
            family: 'Noto'
        });

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, base.width, base.height);
        ctx.drawImage(avatar, 66, 132, 504, height * avatar.height);
        ctx.drawImage(base, 0, 0);
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.font = 'normal bold 25px Noto';
        ctx.fillStyle = 'white';
        ctx.fillText(spotifyArgs[0], base.width / 2, 685);
        ctx.fillStyle = '#bdbec2';
        ctx.font = '20px Noto';
        ctx.fillText(spotifyArgs[1], base.width / 2, 720);
        ctx.fillText("Helixus's Picks", base.width / 2, 65);

        const attachment = canvas.toBuffer();

        m.delete();
        message.channel.send({ files: [{ attachment: new Buffer(attachment, 'base64'), name: "spotifynowplaying.png" }] });
    }
}