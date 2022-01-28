require('dotenv').config();
import { Intents } from 'discord.js';
import { ExtendedClient } from './structures/Client';

export const client = new ExtendedClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

client.start();
