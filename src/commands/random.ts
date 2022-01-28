import { ICommand } from '../Interfaces/ICommand';

const command: ICommand = {
	name: 'random',
	description: 'Generate a random Winner from a list of options',
	aliases: ['r'],
	run: async (client, message, args) => {
		let random = Math.floor(Math.random() * args.length);
		if (args.length === 0)
			return message.channel.send('Debes ingresar al menos una opción');

		message.channel.send({
			embeds: [
				{
					title: 'Ganador',
					type: 'rich',
					description: args[random],
					color: 10181046,
				},
			],
		});
	},
};

export default command;
