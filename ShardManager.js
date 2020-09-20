const { ShardingManager } = require('discord.js');
const config = require('./config.json');

const Manager = new ShardingManager("./index.js", {
    totalShards: "auto",
    token: config.token,
    shardArgs: ["--trace-warning"],
});
Manager.spawn();