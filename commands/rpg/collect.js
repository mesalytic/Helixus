const Command = require("../../structures/Command");
const { Message } = require('discord.js');

module.exports = class CollectCommand extends Command {
    constructor(bot) {
            super(bot, {
                name: 'collect',
                description: "Collect resources from buildings.",
                type: 'rpg'
            });
        }
        /**
         * @param {Message} message
         */
    async run(message, args) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })

        let collect = args[0] ? args[0] : "all"
        if (!["mine", "lumbermill", "all"].includes(collect)) collect = "all";

        const canBeCollected = this.checkIfPossibleToCollect(dbUser, collect);
        if (!canBeCollected.response) return message.channel.send(canBeCollected.message);

        const toBeCollected = collect === "all" ? ["mine", "lumbermill"] : [collect];
        const totalCollected = await dbUser.collectResource(toBeCollected, new Date());

        let msg = "";

        for (const resource in totalCollected) msg += `${totalCollected[resource]} ${resource}, `;

        message.channel.send(`You have collected ${msg}`);
    }

    checkIfPossibleToCollect(user, collect) {
        if (!user.empire.find(building => building.name === collect || collect == "all")) {
            let msg;

            if (collect === "all") msg = "You have no production buildings in your empire. Please use the `am!build` command to get started!";
            else msg = `You have no ${collect}s.`

            return { response: false, message: msg }
        }

        return { response: true, message: "success!" }
    }
}