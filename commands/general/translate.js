const {
    MessageEmbed
} = require("discord.js");
const translate = require("@k3rn31p4nic/google-translate-api");
const Command = require("../../structures/Command");
const { langs } = require("../../structures/Constants");

module.exports = class TranslateCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'translate',
            type: 'general',
            usage: 'translate <target lang> <text>',
            aliases: ["translation", "traduction"]
        });
    }

    async run(message, args) {
        if (args[0] === "list") {
            const langsList = "```Css\n"+(langs.map((l, i) => `#${i+1} - ${l}`).join("\n"))+"```";
			return message.author.send(langsList)
        }

        if (!args[0] || !langs.includes(args[0].toLowerCase())) return this.bot.commands.get("help").run(message, ["translate"])
        if (!args[1]) this.bot.commands.get("help").run(message, ["translate"])

        let target = args[0].toLowerCase();
        let content = args.slice(1).join(" ");

        let translated = await translate(content, { to: target });

        console.log(translated);

        const embed = new MessageEmbed()
            .setAuthor("Translate", this.bot.user.displayAvatarURL())
            .addField(`Translated from ${translated.from.language.iso}`, `\`\`\`${content}\`\`\``)
            .addField(`to ${target}`, "```"+translated.text+"```")
            .setColor("RANDOM")
            .setTimestamp();

        message.channel.send(embed);
        
    }
}