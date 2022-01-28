import { ICommand } from '../Interfaces/ICommand';

const command: ICommand = {
	name: 'ping',
	description: 'Ping the bot',
	aliases: ['p'],
	run: async (client, message, args) => {
		await message.channel.send(`Pong! ${client.ws.ping}ms`);
	},
};

export default command;
