const Discord = require("discord.js");
const Canvas = require("canvas");
const jimp = require('jimp');
const ms = require('enhanced-ms');

const handleCaptcha = async(message, user, tries, now) => {
    const captcha = createCaptcha(message, tries);

    const filter = msg => msg.author.id === message.author.id
    const collector = message.channel.createMessageCollector(filter, { time: 15000 });

    let userAnswer = "";

    collector.on("collect", m => {
        userAnswer = m.content;
        collector.stop();
    });

    collector.on("end", async() => {

        if (tries <= 1) {
            const currentBans = parseInt(user.account.bans, 10) || 1;
            const banTime = currentBans <= 3 ? now + 1800000 : now + parseInt(Math.pow(50, currentBans), 10);
            user.account.bans += 1;
            user.account.banTime = banTime;

            await user.save();
            return message.channel.send(`Sorry <@${message.author.id}>, but rules are the rules. You are now banned for **${ms(banTime - now)}**.`);
        }

        if (captcha.join("") === userAnswer) {
            return message.channel.send(`<@${message.author.id}>, you passed the test successfully! You are free to go.`);
        }

        return await handleCaptcha(message, user, tries - 1, now);
    });
}

const createCaptcha = (message, tries) => {
    var captcha;
    const canvas = Canvas.createCanvas(500, 150);
    const ctx = canvas.getContext('2d');

    ctx.font = "italic 40px Arial";
    ctx.fillStyle = "#7491A8"

    const captchaNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    const spaceBetween = [0, 0, 0, 0].map((n, i) => 80 + (i * 100));
    const verticalAxis = Array.from({ length: 4 }, () => Math.floor(Math.random() * (150 - 30) + 30));

    captchaNumbers.forEach((n, i) => {
        ctx.fillText(captchaNumbers[i], spaceBetween[i], verticalAxis[i])
    });

    let bufferB64 = canvas.toDataURL();
    let buffer = new Buffer(bufferB64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    jimp.read(buffer).then(img => {
        img.pixelate(7)
            .getBuffer(jimp.MIME_PNG, async(err, res) => {
                const attachment = new Discord.MessageAttachment(new Buffer(res, 'base64'));
                await message.channel.send(`Hey there <@${message.author.id}>! We just need you to complete this verfication thingy, just to be sure that, you know, you're human.\n You have **${tries} ${tries > 1 ? "tries" : "try"}** left!`, attachment);

            })
    })

    return captchaNumbers;


}

module.exports = { handleCaptcha };