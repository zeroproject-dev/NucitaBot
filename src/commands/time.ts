import { Timer } from './../structures/Timer';
import { ICommand } from 'Interfaces/ICommand';

const time: ICommand = {
	name: 'time',
	aliases: ['time', 'ti'],
	description: 'set the time to notify',
	run: async (client, message, args) => {
		const timer = new Timer(message);
		if (args[0].toLowerCase() === 'stop') {
			timer.stop();
			return;
		}

		const type = args[0].at(-1).toLowerCase();
		const time = parseInt(args[0].slice(0, -1));

		if (isNaN(time))
			return message
				.reply('Ingrese un número válido')
				.then((m) => setTimeout(m.delete.bind(m), 5000));

		timer.start(type, time);
	},
};

export default time;
