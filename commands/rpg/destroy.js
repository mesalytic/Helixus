/* jshint esversion: 10 */
const Command = require("../../structures/Command");
const { Message } = require('discord.js');
const { rpgPlayer } = require("../../structures/DatabaseCollections");

module.exports = class DestroyCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'destroy',
            description: "Destroy buildings. You can either specify the name of the building or the grid coordinates of the building.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message, args) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id });
        
        const building = args.join(" ");
        
        this.destroy(dbUser, building).then((res) => {
            message.channel.send(`<@${message.author.id}>: ${res}`);
        });
    }

    async destroy(user, args) {
        const { response, message, building } = this.isDestroyPossible(user, args);
        if (!response) return message;

        const { name, level, position } = building;

        try {
            user.destroyBuilding(building);
        } catch {
            console.error(`${user.account.username} was not able to destroy building ${name} (level: ${level}), at the position ${position[0]}.${position[1]}. The arg: "${args}" was used`);
            return "Something went wrong and you were not able to destroy the building successfully. Please report the bug and it will be fixed at the speed of light!";
        }

        await user.save();
        return `You successfully destroyed ${name} (level: ${level}) at the coordinates ${position[0]}.${position[1]}`;
    }

    isDestroyPossible(user, args) {
        const building = args.match(/\d+\.\d+/) ? user.empire.find(
            (b) => b.position[0] === parseInt(args.split(".")[0]) && b.position[1] === parseInt(args.split(".")[1])
        ) : user.empire.filter((b) => { return b.name.toLowerCase() === args; }).sort((a, b) => a.levell - b.level)[0];

        if (!building) return { response: false, message: `There are no buildings with the coordinates or name '${args.toString()}' in your empire.` };
        return { response: true, building };
    }
};