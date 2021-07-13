const {
    oneLine,
    stripIndent
} = require("common-tags");
const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");
const {
    capitalize
} = require("../../structures/Utils");



module.exports = class HelpCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'help',
            aliases: ['h'],
            usage: 'help [command]',
            description: `Displays a list of current commands, sorted by category.\nYou can also give an argument, to get more infos about a specific command.`,
            type: 'info',
            examples: ['help', 'help ping']
        });
    }

    async run(message, args) {
        const {
            INFO,
            GENERAL,
            OWNER,
            ADMINISTRATION,
            MUSIC,
            LEVELS,
            ECONOMY,
            FUN,
            IMAGES,
            NSFW,
            RP,
            MODERATION,
            TCG
        } = this.bot.types;
        this.bot.db.query(`SELECT * FROM Prefixes WHERE guildID='${message.guild.id}'`, (err, prefixes) => {
            if (err) throw err;

            const embed = new MessageEmbed()
            let prefix;

            if (prefixes[0]) prefix = prefixes[0].prefix;
            else prefix = "am!"

            const command = this.bot.commands.get(args[0]) || this.bot.aliases.get(args[0]);
            if (command && (command.type != OWNER)) {
                embed
                    .setTitle(message.guild.lang.COMMANDS.HELP.helpEmbedTitle(command))
                    .setDescription(`${message.guild.lang.COMMANDS[command.name.toUpperCase()] ? message.guild.lang.COMMANDS[command.name.toUpperCase()].description : command.description}\n\n${message.guild.lang.COMMANDS.HELP.reminder}`)
                    .addField(message.guild.lang.COMMANDS.HELP.helpEmbedUsage, `\`${prefix}${command.usage.replace(/am!/g, prefix)}\``, true)
                    .addField(message.guild.lang.COMMANDS.HELP.helpEmbedType, `\`${capitalize(command.type)}\``, true)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                    .setColor(message.guild.me.displayHexColor);

                if (command.aliases) embed.addField(message.guild.lang.COMMANDS.HELP.helpEmbedAliases, command.aliases.map(c => `\`${c}\``).join(' '));
                if (command.examples) embed.addField(message.guild.lang.COMMANDS.HELP.helpEmbedExamples, command.examples.map(c => `\`${prefix}${c}\``).join('\n'));
                if (command.notes) embed.addField(message.guild.lang.COMMANDS.HELP.helpEmbedNotes, message.guild.lang.COMMANDS[command.name.toUpperCase()] ? message.guild.lang.COMMANDS[command.name.toUpperCase()].notes : command.notes)
            } else {
                const commands = {};
                for (const type of Object.values(this.bot.types)) {
                    commands[type] = [];
                }

                const emojiMap = {
                    [INFO]: `📇 ${message.guild.lang.COMMANDS.HELP.TYPES.info}`,
                    [GENERAL]: `👨 ${message.guild.lang.COMMANDS.HELP.TYPES.general}`,
                    [OWNER]: `${capitalize(OWNER)}`,
                    [ADMINISTRATION]: `⚒️ ${message.guild.lang.COMMANDS.HELP.TYPES.administration}`,
                    [MUSIC]: `🎵 ${message.guild.lang.COMMANDS.HELP.TYPES.music}`,
                    [LEVELS]: `📈 ${message.guild.lang.COMMANDS.HELP.TYPES.levels}`,
                    [ECONOMY]: `🪙 ${message.guild.lang.COMMANDS.HELP.TYPES.economy}`,
                    [FUN]: `🎲 ${message.guild.lang.COMMANDS.HELP.TYPES.fun}`,
                    [IMAGES]: `🖼️ ${message.guild.lang.COMMANDS.HELP.TYPES.images}`,
                    [NSFW] : '🔞 NSFW',
                    [RP]: '🛂 RP',
                    [MODERATION]: '🔨 Moderation',
                }

                this.bot.commands.forEach(command => {
                    commands[command.type].push(`\`${command.name}\``);
                })

                embed
                    .setTitle(message.guild.lang.COMMANDS.HELP.embedTitle)
                    .setDescription(message.guild.lang.COMMANDS.HELP.embedDescription(prefix))
                    .setTimestamp()
                    .setColor(message.guild.me.displayhexColor)

                for (const type of Object.values(this.bot.types)) {
                    if (type === OWNER) continue;
                    if (commands[type][0])
                        embed.addField(`**${emojiMap[type]} [${commands[type].length}]**`, commands[type].join(', '));
                }
            }
            message.channel.send(embed);
        })
    }
}