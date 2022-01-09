require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Intents, Collection } = require('discord.js');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

client.commands = new Collection();

// Commands
commands = fs.readdirSync(path.join(__dirname, 'commands/'));

commands.map((file) => {
	const cmd = require(path.join(__dirname, 'commands', file));
	client.commands.set(cmd.name, cmd);
});

// Events
events = fs.readdirSync(path.join(__dirname, 'events'));
events.map((file) => {
	const event = require(path.join(__dirname, 'events', file));
	client.on(event.name, (...args) => event.run(client, ...args));
});

client.login(process.env.DISCORD_TOKEN);
