module.exports.run = async (bot, message, args, con) => {
  const reason = args.join(" ") || bot.lang.membres.afk.noreason;

  try {
    con.query(
      `SELECT * FROM Afk WHERE userID = '${message.author.id}'`,
      (err, rows) => {
        if (rows.length < 1) {
          message.reply(`${bot.lang.membres.afk.nowafk} : ${reason}`);
          con.query(
            `INSERT INTO Afk (userID, reason) VALUES ('${message.author.id}', '${reason}')`,
          );
        } else {
          message.reply(bot.lang.membres.afk.notafk);
          con.query(`DELETE FROM Afk WHERE userID='${message.author.id}'`);
        }
      },
    );
  } catch (err) {
    throw err;
  }


};
module.exports.help = {
  name: "afk",
  helpcaté: "membres",
  catégorie: "Membres",
};
