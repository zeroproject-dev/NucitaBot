import { ExtendedClient } from './../structures/Client';
import { Message } from 'discord.js';
import { IEvent } from './../Interfaces/IEvent';
import { Tts, TTSProviders } from '../utils/tts';
import { ICommand } from '../Interfaces/ICommand';

const event: IEvent = {
	name: 'messageCreate',
	run: async (client: ExtendedClient, message: Message) => {
		if (message.author.bot) return;

		const firstLetter = message.content.charAt(0);
		const tts: Tts =
			firstLetter === process.env.VOICE_FEMALE_PREFIX ||
			firstLetter === process.env.VOICE_MALE_PREFIX
				? new Tts(message)
				: null;

		switch (firstLetter) {
			case process.env.COMMAND_PREFIX:
				const args = message.content
					.slice(process.env.COMMAND_PREFIX.length)
					.trim()
					.split(/ +/g);

				const cmd = args.shift().toLowerCase();
				if (!cmd) return;
				const command = client.commands.get(cmd) || client.aliases.get(cmd);
				if (command) (command as ICommand).run(client, message, args);
				break;
			case process.env.VOICE_FEMALE_PREFIX:
				tts?.speak(TTSProviders.gtts);
				break;
			case process.env.VOICE_MALE_PREFIX:
				tts?.speak(TTSProviders.azure);
				break;
			default:
				return;
		}
	},
};

export default event;
