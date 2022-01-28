import { ICommand } from '../Interfaces/ICommand';
import { Together } from '../structures/Together';

const command: ICommand = {
	name: 'together',
	description: 'Create a activitie together',
	aliases: ['t'],
	run: async (client, message, args) => {
		const together = new Together(client, message);
		if (args[0].toLowerCase() === 'list' || args[0].toLowerCase() === 'l') {
			together.getList(message);
		} else {
			together.createInvite(args[0].toLowerCase());
		}
	},
};

export default command;
