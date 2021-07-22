const Command = require("../../structures/Command");
const { MessageEmbed, Message } = require('discord.js');

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
        this.bot.db.query(`SELECT * FROM rpg WHERE userID='${message.author.id}'`, (err, rows) => {
            if (err) throw err;
            if (rows[0]) return message.channel.send("❌ **|** Adventurer, you are already registered!")

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
                this.bot.db.query(`INSERT INTO rpg (userID, class) VALUES ('${message.author.id}', '${option}')`)
            }
        })
    }
}