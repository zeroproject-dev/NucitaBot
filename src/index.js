const { DISCORD_TOKEN: token, prefix } = require('../config.json');
const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
	console.log(`Login as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	let [cmdname, ...cmdargs] = message.content
		.slice(prefix.length)
		.trim()
		.split(/\s+/);

	if (cmdname === 'ping') {
		console.log(cmdargs);
		await message.channel.send('Pong!');
	}
});

client.login(token);
