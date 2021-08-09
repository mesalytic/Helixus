const Command = require("../../structures/Command");
const { Message } = require('discord.js');
const { consumablesObject } = require("../../structures/Constants");
const { getIcon } = require("../../structures/Utils");

module.exports = class BuyCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'buy',
            description: "Buy consumable items from the shop.\nBought items can be used using `am!use <item>`",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message, args) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })
        
        const numArgs = args.filter(Number);
        const amt = numArgs.length && numArgs[0] !== 0 ? Math.abs(parseInt(numArgs[0])) : 1;

        const response = await this.handleBuy(args, dbUser, amt);
        message.channel.send(`${message.author}'s shop: \n ${response}`)
    }

    async handleBuy(args, user, amount) {
        if (args.length === 0) return this.displayShop(user);

        const joinedArgs = args.filter(a => typeof a === "string" && isNaN(a)).map(a => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join(" ");
        const item = consumablesObject[joinedArgs];

        const msg = await this.buyItem(user, item, amount);
        return msg;
    }

    displayShop(user) {
        let msg = "Try `am!buy <item>` to buy an item.\n\nAvailable items: \n";
        let noItems = true;

        Object.values(consumablesObject).forEach(item => {
            const { building, level } = item.requirement;
            if (user.empire.find(b => b.name === building && b.level >= level)) {
                msg += `${getIcon(item.name)} ${item.name}: ${item.price}g\n`;
                noItems = false;
            }
        })

        if (noItems) msg += "There's currently no available items for sale! Try building your shop to get started.";

        return msg;
    }

    async buyItem(user, item, amount) {
        const canBeBought = this.canBeBought(user, item, amount);
        if (!canBeBought.response) return canBeBought.message;

        user.buyItem(item, amount);
        await user.save();

        return `You have successfully bought ${amount}x ${item.name}!`
    }

    canBeBought(user, item, amount) {
        if (!item) return { response: false, message: "This item does not exist." };
        const { requirement, name, price } = item;
        const { building, level } = requirement;
        const { resources, empire } = user;

        if (resources.gold < price * amount) return { response: false, message: `Can not afford: ${amount}x ${name} costs ${price * amount} gold and you only have ${resources.gold} gold.` }
        if (!empire.find(b => b.name === building && b.level >= level)) return { response: false, message: `Your shop needs to be level ${level} to buy ${name}` };

        return { response: true }
    }
}