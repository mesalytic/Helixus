const mongoose = require('mongoose');

const MongoModals = require('../structures/DatabaseCollections');
const RpgRepository = require('./databaseRepositories/rpg');

module.exports = class MongoDB {
    constructor(uri) {
        this.uri = uri;

        this.logger = require('./Logger');

        this.Rpg = MongoModals.Rpg;
        this.rpgRepository = new RpgRepository(this.Rpg);
    }

    get repositories() {
        return {
          rpgRepository: this.rpgRepository,
        };
      }

    createConnection() {
        return new Promise((resolve, reject) => {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }, (err) => {
                if (err) {
                    this.logger.error(`[MongoDB] Error connecting to database\n${err}`)

                    return reject(err);
                }
                console.log(`[MongoDB] Connected to Database`)

                return resolve();
            })
        })
    }
}