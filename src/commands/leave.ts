import { ICommand } from '../Interfaces/ICommand';

const command: ICommand = {
	name: 'leave',
	description: 'Leave the voice channel',
	aliases: ['l', 'salir', 'desconectar'],
	run: async (client, message, args) => {
		if (client.voiceConnection) {
			client.voiceConnection.destroy();
			client.voiceConnection = null;
		} else {
			message.channel.send('El bot no esta en un canal de voz.');
		}
	},
};

export default command;
