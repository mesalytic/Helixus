const allItems = require("../../Items/allItems");
const allUnits = require("../../Units/allUnits");
const { questHelper } = require("../questHelper")

module.exports = {
    buildMine: {
        name: "Build a Mine",
        description: "Welcome %username% !\n\nYour first objective is to __build a Mine__ and __collect 5 copper ore__. \n\nYou can build a Mine with the command `am!build mine` and it will passively collect ores depending on the level of the Mine. A level 0 Mine will collect 1 copper ore per minute, and can be collected with the command `am!collect`. Mines are crucial for rapid expansion and in production of an unbeatable army! \nType `am!quest` when you're finshed.",
        winDescription: "A Mine will help you build new structures in your empire! To see the different available buildings type the command `am!build`. If you are not pleased with one of your buildings you can remove it with the command `am!destroy <building_name>`.\n\n**A new quest is available**. To check it out, type `am!quest`",
        questKeySequence: ["gettingStarted", "buildMine"],

        execute: async function(user) {
            const questRes = questHelper(user, this.name);
            if (!questRes) return false;

            if (!user.empire.find(b => b.name === "mine")) return false;
            if (!(user.resources["copper ore"] >= 5)) return false;

            await user.gainManyResources({
                gold: 30,
                ["copper ore"]: 5
            });

            const newQ = {
                name: "Build a Lumbermill",
                started: false,
                questKeySequence: ["gettingStarted", "buildLumbermill"]
            }

            user.addNewQuest(newQ);
            user.removeQuest(this.name);

            user.save()

            return true;
        }
    },
    buildLumbermill: {
        name: "Build a Lumbermill",
        description: "You have now set up a production of copper ore, however some buildings, units and items require wood as well to be made. Your next goal is to __build a Lumbermill__ and collect __5 Oak wood__. \n\nYou can build a lumbermill with the command `am!build lumbermill` and it will passively collect wood depending on the level of the lumbermill. A level 0 lumbermill will collect 1 oak wood per minute, and can be collected with the command `am!collect`. Lumbermill are crucial in obtaining certain buildings, items or units!",
        winDescription: "With the Lumbermill set up you are now able to start expanding your kingdom! To see all buildings in your kingdom use the command `am!grid`.\n\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "buildLumbermill"],
        execute: async function(user) {
            const questRes = questHelper(user, this.name);
            if (!questRes) return false;

            if (!user.empire.find(b => b.name === "lumbermill")) return false;
            if (!(user.resources["oak wood"] >= 5)) return false;

            await user.gainManyResources({
                gold: 35,
                ["oak wood"]: 10,
            });

            const newQ = {
                name: "Explore your Surroundings",
                started: false,
                questKeySequence: ["gettingStarted", "exploreSurroundings"],
            };

            user.addNewQuest(newQ);
            user.removeQuest(this.name);

            user.save();

            return true;
        },
    },
    exploreSurroundings: {
        name: "Explore your Surroundings",
        description: "You have now successfully started production of ores and lumber in your empire and it is time to explore your empire's surroundings. Try and find some nearby sources of income. \n\nYou can explore with the command `am!explore` and you will have a chance of finding different areas that you can interact with around your empire.",
        winDescription: "With the 'River' explored you can go fishing in it with the command `am!fish`. This is an excellent source of gold! There are several available areas that you can explore and interact with, so keep exploring and see what you find! To see all your explored areas use the command `am!look`.\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "exploreSurroundings"],
        execute: async function(user) {
            const questRes = questHelper(user, this.name);
            if (!questRes) return false;

            if (!user.world.locations["Grassy Plains"].explored.find(area => area === "River")) return false;

            await user.gainManyResources({
                gold: 25,
                ["copper ore"]: 5,
            });

            const newQ = {
                name: "Build a shop",
                started: false,
                questKeySequence: ["gettingStarted", "buildShop"]
            }

            user.addNewQuest(newQ);
            user.removeQuest(this.name);

            user.save();

            return true;
        }
    },
    buildShop: {
        name: "Build a shop",
        description: "Your will lose hp when fighting, and thus need to get healed back up. To do this you can buy healing potions from a shop. Your goal is to build a shop and buy a small healing potion\n\nYou can build a shop with the command `am!build shop`, buy a small healing potion with the command `am!buy small healing potion`.",
        winDescription: "A higher leveled shop will contain several items. To see all the different items in the shop use the command `am!buy`. Your newly bought Healing potion can be used with the command `am!use small healing potions` if you took damage. You can also use shortcuts to save time like `am!buy shp`. See available shortcuts with the command `am!buy shortcuts`. Make sure to not die as you will lose experience and possibly ranks.\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "buildShop"],
        execute: async function(user) {
            const questRes = await questHelper(user, this.name);
            if (!questRes) return false;

            if (!user.empire.find(b => b.name === "shop")) return false;

            await user.gainManyResources({
                gold: 20
            });

            await user.addItem(allItems["bronze sword"], 1)

            const newQ = {
                name: "Preparing Yourself",
                started: false,
                questKeySequence: ["gettingStarted", "preparingYourself"],
            };

            user.addNewQuest(newQ);
            user.removeQuest(this.name);

            await user.save();

            return true;
        }
    },
    preparingYourself: {
        name: "Preparing Yourself",
        description: "The newly aquired weapon can be equipped to increase your combat potency. Equip the Bronze Sword with the command `am!equip bronze sword`.",
        winDescription: "You're an experienced fighter and wield weaponry more efficient and with higher combat capabilities compared to your army. You can see your stats with the command `am!profile` or `am!army`.\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "preparingYourself"],
        execute: async function(user) {
            const questRes = await questHelper(user, this.name);
            if (!questRes) return false;

            if (user.armor.weapon === "[NONE]") return false;

            await user.addItem(allItems["bronze platemail"], 1);

            const newQuest = {
                name: "Recruit an Army",
                started: false,
                questKeySequence: ["gettingStarted", "recruitArmy"],
            };

            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        }
    },
    recruitArmy: {
        name: "Recruit an Army",
        description: "With the exploration of the nearby areas you will find animals to hunt, hostile encampments, minibosses, dungeons or even new quests areas! To prepare you for the enemies around your empire you will have to recruit an army to deal with these dangers. Your objective is to build a Forge, Blacksmith and Barracks to produce an army that can raid nearby encampments. \n\nYou can build Forge, Blacksmith and Barracks with `am!build forge`, `am!build blacksmith` and `am!build barracks`, respectively. A Forge enables you to can craft bronze bars `am!craft bronze bar 1`, Blacksmith can use the bronze bars to craft weaponry `am!craft bronze sword 1` and a Barracks can be used to produce soldiers that can use the crafted equipment `am!recruit peasant 1`",
        winDescription: "The weaponry is automatically worn by your army so you dont have to worry about that, just make sure you have enough equipment for all your units to improve their fighting capabilities. Don't forget to also build some farms to increase your max population allowing more units to be recruited. With an army well prepared you can `am!explore` until you find an encampment to `am!raid` and gain valuable resources and experience! \n\nHint: To see all available crafts type `am!craft` and to see all available recruits type `am!recruit`.\n**A new quest is available**",
        questKeySequence: ["gettingStarted", "recruitArmy"],
        execute: async function(user) {
            const questRes = questHelper(user, this.name);
            if (!questRes) return false;

            if (!(user.army.armory.weapon["bronze sword"] >= 3)) return false;
            if (!(user.army.units.barracks.peasant >= 10)) return false;

            user.addOrRemoveUnits(allUnits["peasant"], 5, ture);
            user.addItem(allItems["bronze helmet"], 5);
            user.addItem(allItems["bronze leggings"], 5);

            const newQuest = {
                name: "Upgrade Mine",
                started: false,
                questKeySequence: ["gettingStarted", "upgradeMine"],
            };

            user.addNewQuest(newQuest);
            user.removeQuest(this.name);

            await user.save();

            return true;
        }
    },
    upgradeMine: {
        name: "Upgrade Mine",
        description: "Now that your empire is starting to take form, you can go ahead and aim towards upgrading your buildings. To upgrade a building you can type the command `am!build <buildingName> -u`. Upgrade your Mine to increase your ore production and to access new resources.",
        winDescription: "With the newly built Mine you can now start producing Iron Ore. You can do this with the command `am!produce iron`. To see all your available productions you can use the command `am!produce`.",
        questKeySequence: ["gettingStarted", "upgradeMine"],
        execute: async function(user) {
            const questRes = questHelper(user, this.name);
            if (!questRes) return false;

            if (!user.empire.find(b => b.name === "mine" && b.level === 1)) return false;

            await user.gainManyResources({
                gold: 90,
                "iron ore": 20
            });

            user.removeQuest(this.name);

            await user.save();

            return true;
        }
    }
}