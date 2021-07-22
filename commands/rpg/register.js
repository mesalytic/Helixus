const Command = require("../../structures/Command");
const { MessageEmbed, Message } = require('discord.js');
const abilitiesFile = require('../../assets/json/abilities.json')

module.exports = class RegisterCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'register',
            description: "Register",
            type: 'rpg'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message) {

        const user = await this.bot.mongoDB.Rpg.findById(message.author.id);
        if (user) return message.channel.send("❌ **|** Adventurer, you are already registered!")

        const classes = [
            "Assassin",
            "Barbarian",
            "C̴̢̡̮̹̩̰̔̌̌̄̑͊̉̊̕͝͝͝͝͝l̶̹̣̪̦̞̰̼̲̉̾́̀̕͘̕̚͘͜͝e̷̩͖̳͓̤͔̿̂͂̇̀͆r̷̪͇͔̈́͆̔̂́̕͜i̵̛̻̖͆̏̓̉̔͆̓̓͒͜͝͝͝ċ̵̙̮͈͚̖̦̣́̈́̈́̑͒̔͑̀̔̒̉̂͜͜͝͝",
            "D̴͕̼̞̝̅̑̍̉̄́̾̀̃̄͋̋͒͝r̵̬͗̑̓ư̴̹̝͇̻̥̮͍̠͎̱̝̓̍̔̂͌͆͑͗͌̔̽͝ĩ̴̛͇̤̘͕̂͊͐͋̾̾̑͆d̵̨̗̙̳̒̿̑̄̃̔͂͝͠",
            "S̷̛̭̙̳̍́̒́͋̄̐̊̈̅͊̚͜͠͠w̴̲̗̯̰̤̹̺͙͍͍̯̹̮͕̒͜o̷̼͎̖͓̲͇͙̥͍̲͆̏͠ͅr̴̨̡̩̞̲̤̟͙̖̜͔̥͓͈̎͌͋̓͐̄̄̄̑̒̂̚d̵̻̘̖͔̯̦̹̮̞̮͚͓̯̔̆̃́͘̕ş̵̥̟̞̬̹̟͚̦̮͇̻̗̂͛͐͛̍͋͠m̸̢̢̡̠͚̦͍͕̼͇̫͇̫̣̏̇̇̌̈̔̚͠͝ͅa̸̛̤̲͇̝͙̹̦͂̂n̴̨̢̻͎͖͖̺̞̻͓̭̰̔͒̽̔̈́̒̑̐͛͊͘͘͝͠",
            "S̶̰̟̳͇̪̦̖̤̥̻͎͐͆͒̑̂͒̓͑͘ơ̷̧͉̱̖̖̪̈́̿̓̒͂̅̐̌̃̆̆̒͠͝ŗ̶̛̤͓̼̘̉̉̂̽̀̓̓́̔͝c̴̮̙̮̺͚̤̖̭̺̘͋̾̊͛̎̈́̈́̽̉̏͠ḙ̶̓́̋̾͗̾̂̒̎̄̓͐r̵̨̡̟͙͎͎̭͚̮̳̣̜͚̄̿̌͌̅͛̒͗͝e̶̡̙̲̹͇͈̮̤̣̞͛̾̏̌̀̏̕͘r̴̺͎͉͓̙̩̻̈́͒̊̽̊̅̐̄̐̊̓͘",
            "M̷̦̘̔͆̈́͑̓̎͆̓̉͊ở̴̢͚̼̞̮̞͎͚͖̳̥̘̰̯͂͊͂́̔̉͐́͆͝͝n̷̢̙̺̋͑̎̽̈́̈́͊͘͜͝k̴̡̨̧̞̯̱̩̮̹̪̟̟͋͑̊͋̈́̂̅̀̃͜͝͝͠",
            "N̷͍̬̱̉͂͋̍̽͝ë̸̢̧̳̱̥͙̞́̍c̷̛̘̗̥͛̐́̆͂́̀̔͂̿̒̅̚̕r̸̡̧̬̤̥̱̜̭̲̜̟̹̱̤̪͑̑̔̀̂̐̀̒̀̚ơ̶͓͒̆̽m̶̡̜̺̥̘̲͖̪͖͕̫͍̓̔̃͊̈́͝a̸̢̬̲͙̬͍͕̗̬̠̗̮̰̦̯͆͗̃̓̾́̂́̈́̊̈ṋ̶̢͙͚͔͓̭̒̆̌̏̈́͐̕͠c̸̛̪͙͍̾̽͒e̶̼̟͈̟͔͖͎̔́ŕ̷̛̺͓͖͆̒̽́̈́̄̾̐"
        ]

        let description = "Hey there!\nSo, you want to be an adventurer, huh? Great! Great..\nJust, choose the class you want to be already.\n"

        const embed = new MessageEmbed()
            .setTitle("🍻 | Class Choice")
            .setColor('#ffec02')
            .setFooter("Type in the chat option of your choice");

        for (let i = 0; i < classes.length; i++) {
            description += `\n${i + 1} - **${classes[i]}**`;
        }

        embed.setDescription(description);
        message.channel.send(embed);

        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, { max: 1 })

        collector.on('collect', (m) => {
            if (classes[Number(m.content) - 1]) this.confirm(message, classes[Number(m.content) - 1]);
            else message.reply("❌ **|** Adventurer, it's not a valid class!")
        })
    }
    /**
     * @param {Message} message
     * @param {string} option
     */
    confirm(message, option) {
        message.channel.send(`⚠️ **|** ${message.author}, do you really want to be a ${option}? This choice is __**IRREVERSIBLE**__!\n\nType \`yes\` to confirm your choice!`);

        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, { max: 1 });

        collector.on('collect', async (m) => {
            if (m.content.toLowerCase() === 'yes') {
                message.channel.send(`✅ **|** Well, welcome aboard, ${option}! Do \`am!help\`, and search for the category \`RPG\` to see all the available commands!`)
                const user = await new this.bot.mongoDB.Rpg({
                    _id: message.author.id,
                    class: option,
                }).save();

                this.confirmRegister(message, user);
            }
        })
    }

    confirmRegister(message, user) {
        setTimeout(async () => {
            switch (user.class) {
                case 'Assassin': {
                    const unicPowersAssassin = abilitiesFile.assassin.uniquePowers;
                    const powerRandom = Math.floor(Math.random() * unicPowersAssassin.length);
                    const choiceAssassin = unicPowersAssassin[powerRandom];
                    user.armor = 5;
                    user.damage = 25;
                    user.mana = 20;
                    user.maxMana = 20;
                    user.abilityPower = 1;
                    user.abilities.push(abilitiesFile.assassin.normalAbilities[0]);
                    user.weapon = {
                        name: 'Dagger',
                        damage: 5,
                        type: 'Arme',
                    };
                    user.uniquePower = choiceAssassin;
                    await user.save();
                    message.channel.send(`✅ **|** rpg:registered`)
                }
            }
        }, 1000)
    }
}