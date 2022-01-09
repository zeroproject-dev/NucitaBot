require('dotenv').config();
const { famele, male } = require('../utils/tts');

module.exports = {
	name: 'messageCreate',
	run(client, message) {
		if (message.author.bot) return;
		if (message.content.startsWith(process.env.VOICE_FEMALE_PREFIX)) {
			if (!message.member.voice.channel)
				return message.channel.send('Ingresa a un canal de voz');

			famele(client, message);
			return;
		}

		if (message.content.startsWith(process.env.VOICE_MALE_PREFIX)) {
			if (!message.member.voice.channel)
				return message.channel.send('Ingresa a un canal de voz');

			male(client, message);
			return;
		}

		if (!message.content.startsWith(process.env.COMMAND_PREFIX)) return;

		let [cmdname, ...cmdargs] = message.content
			.slice(prefix.length)
			.trim()
			.split(/\s+/);

		const cmd =
			client.commands.get(cmdname) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(cmdname)
			);

		if (!cmd) return;
		cmd.run(client, message, cmdargs);
	},
};
