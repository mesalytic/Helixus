const Command = require("../../structures/Command");
const { Message, MessageEmbed } = require('discord.js');
const allBuilds = require('../../structures/allBuilds');
const { capitalize, getIcon } = require("../../structures/Utils");
const { checkBuildQuests } = require("../../structures/Quests/questUtils");

module.exports = class BuildCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'build',
            description: "Linked with `am!grid`. Build or upgrade structures.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     * @param {String[]} args
     */
    async run(message, args) {
        let name = args[0];

        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })

        if (!args[0]) return message.channel.send(this.availableBuilds(dbUser));
        const building = Object.values(allBuilds).find(building => name === building.name)
        
            if (args.includes("-u") && building) {
            const gridCoords = args.find(el => el.match(/\d+\.\d+/g));
            const userBuildings = dbUser.empire.filter(b => {
                gridCoords
                ? b.name === building.name
                && b.position[0] === parseInt(gridCoords.split(".")[0])
                && b.position[1] === parseInt(gridCoords.split(".")[1])
                : b.name === building.name
            }).sort((a, b) => a.level - b.level)
            if (userBuildings.length > 0) {
                args[args.length - 1] = userBuildings[0].position.join(".");
            }
        }

        const coords = args[args.length - 1].split(".").map(cord => parseInt(cord));
        this.constructBuilding(dbUser, building, coords).then((res) => {
            message.channel.send(`${message.author}: ${res}`)
        })
    }

    availableBuilds(user) {
        const fields = [];

        for (const building in allBuilds) {
            const userBuildings = user.empire.filter(b => b.name === allBuilds[building].name)
                .sort((a, b) => b.level - a.level);
            fields.push(this.addBuildingField(allBuilds[building], userBuildings));
        }

        if (fields.length === 0) {
            fields.push({
                name: "An error has occured with displaying buildings",
                value: "\u200B",
            });
        }

        if ((fields.length + 2) % 3) {
            fields.push({
                name: "\u200B",
                value: "\u200B",
                inline: true,
            });
        }

        const embedBuilding = new MessageEmbed()
            .setTitle(`${user.account.username}'s available buildings`)
            .setColor("RANDOM")
            .addFields(...fields);

        return embedBuilding;
    }


    addBuildingField(building, userBuildings) {
        const { name, levels } = building;
        const nextLevel = userBuildings[0] ? levels.find(l => userBuildings[0].level + 1 === l.level) : levels[0];
        if (!nextLevel) {
            return {
                name: capitalize(name),
                value: "Max level reached",
                inline: true
            }
        }

        const field = {
            name: capitalize(name),
            value: `Next level is ${nextLevel.level}:\n ${this.costsMessage(nextLevel.cost)}`,
            inline: true
        };

        return field;
    }

    costsMessage(costs) {
        let msg = "";

        for (const cost in costs) {
            msg += `${getIcon[cost] || ""} ${capitalize(cost)}: ${costs[cost]} \n`
        }

        return msg;
    }

    async constructBuilding(user, building, coords) {
        if (!coords[0] && coords[0] !== 0) {
            coords = this.findAvailableSpot(user);
            if (!coords) return "You don't have an available spot in your empire!"
        }

        const { response, message, buildingCost } = this.checkIfBuildIsPossible(user, building, coords);
        if (!response) return message;

        const newBuild = {
            name: building.name,
            position: coords,
            level: buildingCost.level
        }

        await user.buyBuilding(newBuild, buildingCost);

        if (building.execute) await building.execute(user);
        
        let msg = `You have successfully created ${newBuild.name} level ${newBuild.level}!`;
        
        // const questIntro = await checkBuildQuests(user, newBuild);
        // if (questIntro) msg += `\n\n**New Quest:**\n`

        await user.save();
        return msg;
    }

    findAvailableSpot(user) {
        const gridSize = Math.ceil(Math.sqrt(user.maxBuildings));
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (!user.empire.find(b => b.position[0] === x && b.position[1] === y)) {
                    return [x, y];
                }
            }
        }

        return false;
    }

    checkIfBuildIsPossible(user, building, coords) {
        if (coords.find(el => !el) || !coords) {
            return {
                response: false,
                message: "You have one or more faulty coordinate."
            }
        }

        if (coords.find(cord => cord > Math.ceil(Math.pow(user.maxBuildings, 1 / 2)) || cord < 0) || coords.length !== 2) {
            return {
                response: false,
                message: "Please enter two coordinates between 0-2 divided by a punctuation, e.g: `am!build barracks 1.1`"
            }
        } else if (!building) return { response: false, message: "Unknown building command."}

        const userBuildings = user.empire.find(structure => structure.position[0] === coords[0] && structure.position[1] === coords[1]);
        if (!userBuildings && user.empire.length >= user.maxBuildings) return { response: false, message: "In order to get additional building spots, level up your Senate!"}

        const upgradeBuilding = !(userBuildings && userBuildings.name !== building.name);
        if (!upgradeBuilding) return { response: false, message: `This building position is occupied by ${userBuildings.name} !`}
        if (!upgradeBuilding && building.unique && user.empire.find(structure => structure.name === building.name)) return { response: false, message: "You can only have one of this building" }

        const buildingCost = building.levels.find(b => userBuildings ? b.level === userBuildings.level + 1 : b.level === 0);
        if (!buildingCost) return { response: false, message: "You already reached max level for this building." }

        for (const resource in buildingCost.cost) {
            const userRes = user.resources[resource];
            const buildRes = buildingCost.cost[resource];

            if (!(userRes >= buildRes)) {
                let msg = "";
                if (resource === "Copper Ore" || resource === "Iron Ore") msg += "Build a Mine to gather ore."
                else if (resource === "Oak Wood" || resource === "Yew Wood") msg += "Build a Lumbermill to gather wood.";
                else if (resource === "Gold") msg += "You can gather gold by hunting, raiding, fishing, or duel players.";
                
                return { response: false, message: `You are missing ${userRes ? buildRes - userRes : buildRes} of ${resource} to build a ${capitalize(building.name)} level ${buildingCost.level}. ` + msg }
            }
        }

        return { response: true, buildingCost }
    }
}