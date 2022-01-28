import { IEvent } from '../Interfaces/IEvent';

const event: IEvent = {
	name: 'ready',
	run: (client, args) => {
		console.log(`${client.user.tag} is ready!`);
	},
};

export default event;
