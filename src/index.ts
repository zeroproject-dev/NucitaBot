require('dotenv').config();
import { GatewayIntentBits } from 'discord.js';
import { ExtendedClient } from './structures/Client';

export const client = new ExtendedClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
	],
});

client.start();
