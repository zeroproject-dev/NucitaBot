module.exports = {
	name: 'leave',
	desc: 'Salir del chat de voz',
	usage: '',
	aliases: ['salir', 'quit'],
	isPrivate: false,
	guildOnly: false,
	category: 'voice',
	isOwner: true,
	run: async (client, message, args) => {
		if (client.customConnection) {
			await client.customConnection.destroy();
			client.customConnection = null;
		} else {
			message.channel.send('El bot no esta en un canal de voz.');
		}
	},
};
