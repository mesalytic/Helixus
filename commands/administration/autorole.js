const Command = require("../../structures/Command");

module.exports = class AutoroleCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'autorole',
            type: 'administration',
            description: 'Allows you to configure roles which will be given to new members.',
            usage: 'autorole "off"\nam! autorole <Role1> [role2]',
            examples: ['autorole off', 'autorole @Role1 @Role2', 'autorole Role1 Role2', 'autorole 437191604370145283'],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ["MANAGE_ROLES"]
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["autorole"]);

        this.bot.db.query(`SELECT * FROM Autorole WHERE guildID='${message.guild.id}'`, (err, rows) => {

            if (args[0] === "off") {
                if (!rows[0] || !rows[0].roleID) return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.OFF.noRoleConfigured);

                this.bot.db.query(`DELETE FROM Autorole WHERE guildID='${message.guild.id}'`);
                return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.OFF.removed);
            } 
            else if (args[0] === "remove") {
                args.shift();

                let roles;
                if (!message.mentions.roles.first()) roles = args.join(" ").split(" | ");
                else roles = message.mentions.roles;
    
                if (roles) {
                    roles.forEach(role => {
                        let cachedRole;
                        if (message.mentions.roles.first()) {
                            cachedRole = message.mentions.roles.get(role.id);
                        } else {
                            cachedRole = message.guild.roles.resolve(role) || message.guild.roles.cache.find(r => r.name === role);
                        }
                        
                        if (cachedRole) {
                            this.bot.db.query(`SELECT * FROM Autorole WHERE roleID='${cachedRole.id}'`, (err, crRows) => {
                                if (!crRows[0]) return message.reply(message.guild.lang.COMMANDS.AUTOROLE.notUsed(role))
                                else this.bot.db.query(`DELETE FROM Autorole WHERE roleID='${cachedRole.id}' `);    
                            });
                        } else return message.reply(message.guild.lang.COMMANDS.AUTOROLE.notFound(role));
                    })
                    message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.removed);
                }
            } else {
                let roles;
                if (!message.mentions.roles.first()) roles = args.join(" ").split(" | ");
                else roles = message.mentions.roles;
    
                if (roles) {
                    roles.forEach(role => {
                        let cachedRole;
                        if (message.mentions.roles.first()) {
                            cachedRole = message.mentions.roles.get(role.id);
                        } else {
                            cachedRole = message.guild.roles.resolve(role) || message.guild.roles.cache.find(r => r.name === role);
                        }
                        
                        if (cachedRole) {
                            this.bot.db.query(`SELECT * FROM Autorole WHERE roleID='${cachedRole.id}'`, (err, crRows) => {
                                if (!crRows[0]) this.bot.db.query(`INSERT INTO Autorole (roleID, guildID) VALUES ('${cachedRole.id}', '${message.guild.id}')`)
                                else this.bot.db.query(`UPDATE Autorole SET roleID='${cachedRole.id}' WHERE guildID='${message.guild.id}'`);
                            })
                            
                        } else return message.reply(message.guild.lang.COMMANDS.AUTOROLE.notFound(role));
                    })
                    message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.added);
                }
                //console.log(roles);
    
    //            const role = message.guild.roles.resolve(args.join(" ")) || message.guild.roles.cache.find(r => r.name === args.join(" ")) || message.mentions.roles.first();
                // if (role) {
                    // if (!rows[0]) this.bot.db.query(`INSERT INTO Autorole (roleID, guildID) VALUES ('${role.id}', '${message.guild.id}')`)
                    // else this.bot.db.query(`UPDATE Autorole SET roleID='${role.id}' WHERE guildID='${message.guild.id}'`);
                    // return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.added(role))
                // } else {
                    // return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.notFound)
                // }
     
            }
       })
    }
}