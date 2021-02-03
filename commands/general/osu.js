const { MessageEmbed } = require("discord.js");
const { evaluate } = require("mathjs");
const { get } = require("node-superfetch");
const Command = require("../../structures/Command");

module.exports = class OsuCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'osu',
            type: 'general',
            description: 'Displays informations about the specified player, in the specified game mode.',
            usage: 'osu <username> | <mode>',
            examples: ["osu Rafis | standard", "osu Jakads | mania", "osu ExGon | ctb"],
        });
    }

    async run(message, args) {
        let osuArgs = args.slice(0).join(" ").split(" | ");

        if (!osuArgs[0]) return this.bot.commands.get("help").run(message, ["osu"]);
        if (!osuArgs[1]) return this.bot.commands.get("help").run(message, ["osu"]);

        let mode;
        switch (osuArgs[1].toLowerCase()) {
            case "standard": mode = 0; break;
            case "taiko": mode = 1; break;
            case "ctb": mode = 2; break;
            case "mania": mode = 3; break;
        }

        let { body } = await get("https://osu.ppy.sh/api/get_user").query({ k: this.bot.config.osu, u: osuArgs[0], m: mode, type: "string" })

        if (!body.length) return message.reply(message.guild.lang.COMMANDS.OSU.notFound);

        let data = body[0];

        const embed = new MessageEmbed()
        .setAuthor(message.guild.lang.COMMANDS.OSU.stats(data.username, osuArgs[1].toLowerCase()), "https://i.imgur.com/hWrw2Sv.png", `https://osu.ppy.sh/u/${data.user_id}`)
    .setColor("RANDOM")
    .addField(message.guild.lang.COMMANDS.OSU.username, data.username, true)
    .addField("ID", data.user_id, true)
    .addField(message.guild.lang.COMMANDS.OSU.level, data.level || "???", true)
    .addField(message.guild.lang.COMMANDS.OSU.accuracy, data.accuracy ? `${Math.round(data.accuracy)}%` : "???", true)
    .addField(message.guild.lang.COMMANDS.OSU.rank, data.pp_rank ? this.formatNumber(data.pp_rank) : "???", true)
    .addField("PP", data.pp_raw ? this.formatNumber(data.pp_raw) : "???", true)
    .addField(message.guild.lang.COMMANDS.OSU.totalGames, data.playcount ? this.formatNumber(data.playcount) : "???", true)
    .addField(message.guild.lang.COMMANDS.OSU.country, data.country || "???", true)
    .addField(message.guild.lang.COMMANDS.OSU.totalRankedScore, data.ranked_score ? this.formatNumber(data.ranked_score) : "???", true)
    .addField(message.guild.lang.COMMANDS.OSU.totalScore, data.total_score ? this.formatNumber(data.total_score) : "???", true)
    .addField("SS (Hidden)", data.count_rank_ssh ? this.formatNumber(data.count_rank_ssh) : "???", true)
    .addField("SS", data.count_rank_ss ? this.formatNumber(data.count_rank_ss) : "???", true)
    .addField("S (Hidden)", data.count_rank_ssh ? this.formatNumber(data.count_rank_sh) : "???", true)
    .addField("S", data.count_rank_s ? this.formatNumber(data.count_rank_s) : "???", true)
    .addField("A", data.count_rank_a ? this.formatNumber(data.count_rank_a) : "???", true);

    message.channel.send(embed);
    }

    formatNumber(num) {
        return Number.parseFloat(num).toLocaleString(undefined, {
            maximumFractionDigits: 2
        })
    }
}