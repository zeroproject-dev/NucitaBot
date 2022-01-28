import { ExtendedClient } from '../structures/Client';
import { ClientEvents } from 'discord.js';

interface Run {
	(client: ExtendedClient, ...args: any[]): any;
}

export interface IEvent {
	name: keyof ClientEvents;
	run: Run;
}
