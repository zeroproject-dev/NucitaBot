import { ICommand } from '../Interfaces/ICommand';

const command: ICommand = {
	name: 'ping',
	description: 'Ping the bot',
	aliases: ['p'],
	run: async (client, message, args) => {
		await message.reply(`Pong! ${client.ws.ping}ms`).then((msg) => {
			setTimeout(() => {
				msg.delete();
			}, 3000);
		});
	},
};

export default command;
