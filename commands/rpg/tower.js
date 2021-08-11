const Command = require("../../structures/Command");
const { Message, MessageEmbed } = require('discord.js');
const { onCooldown, getIcon } = require("../../structures/Utils");
const { getArmyTowerEnemies } = require("../../structures/Tower/TowerEnemies");
const { calculatePveFullArmyResult } = require("../../structures/Combat/combat");
const { getTowerItem, removeTowerItem } = require("../../structures/Items/items/towerItems/functions");

module.exports = class TowerCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'tower',
            description: "Fight in the tower.",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message, args) {
        let dbUser = await this.bot.mongoDB.Rpg.findOne({ "account.userId": message.author.id })

        if (args.length === 0) return message.channel.send(this.towerInfoEmbed(dbUser));

        const cooldown = onCooldown("tower", dbUser);
        if (cooldown.response) return message.channel.send(cooldown.embed);

        const result = await this.towerHandler(dbUser, args, message);

        return message.channel.send(result);
    }

    towerInfoEmbed(user) {
        const fields = [
            {
                name: "Solo Full-Army",
                value: `Command: \`am!tower solo full-army\`\nLevel: ${user.tower["solo full-army"].level}`,
                inline: true
            }
        ]

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${user.account.username}'s tower progress`)
            .addFields(...fields);
        
        return embed;
    }

    async towerHandler(user, args) {
        let allResults;
        if (args[0] === "solo") {
            if (args[1] === "full-army") {
                allResults = await this.armyTowerFight([user], "solo")
            }
        }

        if (allResults) {
            const { embed } = this.towerResultEmbed(allResults);
            return embed;
        } else { return "Something went wrong, most likely because the command you typed was incorrect. "; }
    }

    async armyTowerFight(users, category) {
        const allResults = {
            users,
            combatResults: [],
            drops: [],
            enemy: {},
            highestLevel: 0,
            newLevel: 0,
            won: false,
        };

        const highestLevel = users.reduce((acc, cur) => {
            return cur.tower[`${category} full-army`].level > acc ? cur.tower[`${category} full-army`].level : acc;
        }, 0);

        const originalEnemy = getArmyTowerEnemies(highestLevel);
        const enemy = {...originalEnemy, stats: { ...originalEnemy.stats } };

        allResults.enemy = enemy;

        const enemyCombatModifier = Math.pow(highestLevel, 1.4) * 0.5 * (1 + Math.random() * 0.5);

        for (const stat in enemy.stats) {
            enemy.stats[stat] = Math.floor(enemy.stats[stat] * enemyCombatModifier)
        }

        const combatResults = users.map(user => calculatePveFullArmyResult(user, enemy));

        users.forEach(user => {
            const userCombatResults = combatResults.find(cr => cr.userId === user.account.userId);

            user.unitLoss(userCombatResults.lossPercent, true);
            user.alternativeGainXp(userCombatResults.expReward);
        });

        let losingCombatResults = combatResults.filter(cr => !cr.win);
        let winningCombatResults = combatResults.filter(cr => cr.win);
        
        let healthLeft = users.filter(user => this.healthLeftOnArmy(user)).length > 0;

        while (!(losingCombatResults.length === 0 || !healthLeft)) {
            losingCombatResults = losingCombatResults.map(cr => {
                const remainingUsers = users.filter(user => this.healthLeftOnArmy(user));
                const randomUser = Math.floor(Math.random() * remainingUsers.length);

                const newEnemy = { ...enemy }
                const statsLength = Object.keys(newEnemy.stats).length;
                for (const stat in newEnemy.stats) newEnemy[stat] = newEnemy[stat] - Math.floor(cr.remainingForces / statsLength);

                const remainingFightResult = calculatePveFullArmyResult(remainingUsers[randomUser]);
                combatResults.push(remainingFightResult);

                if (remainingFightResult.win) {
                    winningCombatResults.push(remainingFightResult);
                    return false;
                } else return remainingFightResult;
            }).filter(el => el);

            const remainingUsers = users.filter(user => this.healthLeftOnArmy(user));
            healthLeft = remainingUsers.filter(user => this.healthLeftOnArmy(user)).length > 0
        }

        if (losingCombatResults.length === 0) {
            const newLevel = highestLevel + 1;

            users.forEach(user => user.changeTowerLevel(`${category} full-army`, newLevel));

            allResults.highestLevel = highestLevel;
            allResults.newLevel = newLevel;
            allResults.won = true;

            users.filter(user => winningCombatResults.find(wcr => wcr.userId === user.account.userId)).forEach(user => {
                const dropChance = Math.random() * ((winningCombatResults.filter(wcr => wcr.userId === user.account.userId).length / 2) + 0.5);
                let itemDrop;
                if (dropChance > 0.85) {
                    itemDrop = getNewTowerItem(highestLevel);
                    const itemObject = { ...getTowerItem(itemDrop) };

                    const resultTower = removeTowerItem(user, itemObject);
                    if (!resultTower) return;

                    user.addItem(itemObject);

                    const userDrop = {
                        user,
                        item: itemDrop
                    };

                    allResults.drops.push(userDrop);
                }
            })
        } else {
            let newLevel = highestLevel + "";
            newLevel = parseInt(newLevel.slice(0, newLevel.length - 1) + 1);

            users.forEach(user => {
                user.changeTowerLevel(`${category} full-army`, newLevel);
            });

            allResults.highestLevel = highestLevel;
            allResults.newLevel = newLevel;
        }

        users.forEach(user => user.setNewCooldown("tower", new Date()));

        await Promise.all(users.map(user => user.save()));

        allResults.combatResults = combatResults;

        return allResults;
    }

    healthLeftOnArmy(user) {
        const totalUnitsArray = Object.values(user.army.units).map(unitBuild => Object.values(unitBuild)).flat();
        const totalUnits = totalUnitsArray.filter(unitNumbers => typeof unitNumbers === "number").reduce((acc, cur) => acc + cur);
        return totalUnits > 0 || user.currentHealth > 0;
    }

    towerResultEmbed(results) {
        const { combatResults, users, drops, enemy, highestLevel, newLevel, won } = results;
        const username = `${users.map(user => user.account.username).join(", ")} fought ${getIcon("tower header")}${enemy.name}${getIcon("tower header")} in tower level ${highestLevel}!`;
        const sideColor = "#45b6fe";

        const combatResultsField = combatResults.map((cr, index) => {
            const { username: usernameCr, win, lossPercent } = cr;

            const field = {
                name: `${getIcon("tower fight")}Round ${index + 1}${getIcon("tower fight")}`,
                value: `${usernameCr} ${win ? "won" : "lost"} the battle with ${Math.floor((1 - lossPercent) * 100)}% of the army getting killed.`
            }
            
            return field;
        });

        const wonString = `Congratulations! You won the battle at level ${highestLevel} and are now able to advance to the next level: __**${newLevel}**__`;
        const lostString = `You lost the battle at level ${highestLevel}. You go down to level __**${newLevel}**__\n\nRemaining enemy power: ${combatResults.reduce((acc, cur) => acc + cur.remainingForces, 0)}`;

        const resultsField = [{
            name: `${won ? getIcon("tower won") : getIcon("lostIcon")}Results${won ? getIcon("tower won") : getIcon("lostIcon")}`,
            value: won ? wonString : lostString
        }];

        if (drops.length > 0) drops.forEach(drop => resultsField[0].value += `\n\n__${drop.user.account.username} got a drop!__\n${drop.item}`)

        resultsField.push({
            name: `${getIcon("xp")}Exp Rewards${getIcon("xp")}`,
            value: users.map(user => `${user.account.username}: ${combatResults.filter(cr => cr.userId === user.account.userId).reduce((acc, cur) => acc + cur.expReward, 0)} exp`)
        })

        const embed = new MessageEmbed()
            .setTitle(username)
            .setColor(sideColor)
            .addFields(...combatResultsField, ...resultsField);

        return { embed }
    }
}