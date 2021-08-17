const Command = require("../../structures/Command");
const { Message, MessageEmbed } = require('discord.js');
const { rpgPlayer } = require("../../structures/DatabaseCollections");
const allItems = require('../../structures/Items/allItems');
const { capitalize, objectMessage } = require("../../structures/Utils");

module.exports = class CraftCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'craft',
            description: "Craft items from the blacksmith, the armorer or the forge.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message, args) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })

        if (args.length === 0) return message.channel.send(this.showCrafts(dbUser));

        const item = Math.floor(args[args.length - 1]) ? args.slice(0, args.length - 1).join(" ") : args.slice(0, args.length).join(" ");
        const amount = Math.floor(args[args.length - 1]) || 1;

        this.craftItem(dbUser, item, amount).then((response) => {
			message.channel.send(`${message.author}: ${response}`);
		});
    }

    async craftItem(user, item, amount) {
        item = allItems[item];

        const canBeCrafted = this.canBeCrafted(user, item, amount);
        if (!canBeCrafted.response) return canBeCrafted.message;

        user.addItem(item, amount, true);
        await user.save()

        return `You successfully created ${amount} ${item.name}${amount === 1 ? "" : "s"}`
    }

    canBeCrafted(user, item, amount) {
        if (!item || amount < 1) return { response: false, message: "invalid item name or amount" };

        const { building:requirementBuilding, level:requirementLevel } = item.requirement;
        if (!user.empire.find(building => building.name === requirementBuilding && building.level >= requirementLevel)) return { response: false, message: `Your ${requirementBuilding} needs to be level ${requirementLevel} !` };

        for (const resource in item.cost) {
            if (!(user.resources[resource] >= item.cost[resource] * amount)) {
                return { 
                    response: false, 
                    message: `You are missing ${user.resources[resource] ? item.cost[resource] * amount - user.resources[resource] :item.cost[resource] * amount} of ${resource}`
                }
            }
        }

        return { response: true, message: "success" };
    }

    showCrafts(user) {
        const fields = Object.values(allItems).filter(item => {
            if (!item.requirement || item.towerItem) return false;
            const { building, level } = item.requirement;
            return user.empire.find(b => b.name === building && b.level >= level);
        }).map(item => { return this.addCraftsField(item) })

        if (fields.length === 0) {
            fields.push({
                name: "You need to build a Blacksmith, an Armorer or a Forge to craft items.",
                value: "See `am!build` to get started."
            })
        }

        if ((fields.length + 2) % 3) {
            fields.push({
                name: "\u200B",
                value: "\u200B",
                inline: true,
            });
        }

        const embed = new MessageEmbed()
            .setTitle(`${user.account.username}'s available crafts`)
            .setColor("RANDOM")
            .addFields(...fields);
        
        return embed;
    }

    addCraftsField(item) {
        const { name, typeSequence, cost, stats } = item;

        const field = {
            name: capitalize(name),
            value: `${capitalize(typeSequence[typeSequence.length - 1])} \n ${objectMessage(stats) ? "\n": ""} ${objectMessage(cost)}`,
            inline: true
        }

        return field;
    }
}