import { ExtendedClient } from '../structures/Client';
import { Message } from 'discord.js';

interface Run {
	(client: ExtendedClient, message: Message, args: string[]): any;
}

export interface ICommand {
	name: string;
	description?: string;
	aliases?: string[];
	run: Run;
}
