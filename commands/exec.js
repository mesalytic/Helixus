module.exports.run = async (bot, message, args) => {
  const exec = require("child_process").exec;

  if (message.author.id !== "604779545018761237") return message.reply("non");
  message.delete();
  exec(`${args.join(" ")}`, (error, stdout) => {
    const response = error || stdout;
    message.channel
      .send(`Executé: ${args.join(" ")}\n${response}`, {
        code: "asciidoc",
        split: "\n"
      })
      .catch(console.error);
  });
};
module.exports.help = {
  name: "exec",
  catégorie: "Gestion Bot"
};
