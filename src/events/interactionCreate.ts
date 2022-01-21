import { ExtendedInteraction } from './../typings/Command';
import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '..';
import { Event } from '../structures/Event';

export default new Event('interactionCreate', async (interaction) => {
	// Chat Input Commands
	if (interaction.isCommand()) {
		await interaction.deferReply();
		const command = client.commands.get(interaction.commandName);
		if (!command) return interaction.followUp('Command not found');

		command.run({
			args: interaction.options as CommandInteractionOptionResolver,
			client,
			interaction: interaction as ExtendedInteraction,
		});
	}
});

// require('dotenv').config();
// const { famele, male } = require('../utils/tts');

// module.exports = {
// 	name: 'messageCreate',
// 	run(client, message) {
// 		if (message.author.bot) return;
// 		if (message.content.startsWith(process.env.VOICE_FEMALE_PREFIX)) {
// 			if (!message.member.voice.channel)
// 				return message.channel.send('Ingresa a un canal de voz');

// 			famele(client, message);
// 			return;
// 		}

// 		if (message.content.startsWith(process.env.VOICE_MALE_PREFIX)) {
// 			if (!message.member.voice.channel)
// 				return message.channel.send('Ingresa a un canal de voz');

// 			male(client, message);
// 			return;
// 		}

// 		if (!message.content.startsWith(process.env.COMMAND_PREFIX)) return;

// 		let [cmdname, ...cmdargs] = message.content
// 			.slice(process.env.COMMAND_PREFIX.length)
// 			.trim()
// 			.split(/\s+/);

// 		const cmd =
// 			client.commands.get(cmdname) ||
// 			client.commands.find(
// 				(cmd) => cmd.aliases && cmd.aliases.includes(cmdname)
// 			);

// 		if (!cmd) return;
// 		cmd.run(client, message, cmdargs);
// 	},
// };
