const { ShardingManager } = require('discord.js');
const config = require('./config.json');

const os = require('os');

const Manager = new ShardingManager("./index.js", {
    totalShards: "auto",
    token: config.token,
    shardArgs: ["--trace-warning"],
});

if (os.platform() === "win32") { /* */ }
else {
    const AutoPoster = require('topgg-autoposter');

    const ap = AutoPoster(config.topgg, Manager);
}

Manager.spawn();