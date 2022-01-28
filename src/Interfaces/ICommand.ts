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

// import {
// 	ChatInputApplicationCommandData,
// 	CommandInteraction,
// 	CommandInteractionOptionResolver,
// 	GuildMember,
// 	PermissionResolvable,
// } from 'discord.js';
// import { ExtendedClient } from '../structures/Client';

// export interface ExtendedInteraction extends CommandInteraction {
// 	member: GuildMember;
// }

// interface RunOptions {
// 	client: ExtendedClient;
// 	interaction: ExtendedInteraction;
// 	args: CommandInteractionOptionResolver;
// }

// type RunFunction = (options: RunOptions) => any;

// export type CommandType = {
// 	userPermissions?: PermissionResolvable[];
// 	run: RunFunction;
// } & ChatInputApplicationCommandData;
