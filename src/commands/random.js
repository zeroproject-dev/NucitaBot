module.exports = {
	name: 'random',
	desc: 'Selecciona una opción random',
	usage: '',
	aliases: ['r'],
	isPrivate: false,
	guildOnly: false,
	category: 'utilitis',
	isOwner: true,
	run: async (client, message, args) => {
		let random = Math.floor(Math.random() * args.length);
		if (args.length === 0)
			return message.channel.send('Debes ingresar al menos una opción');
		message.channel.send(`Ganador!: ${random + 1} ${args[random]}`);
	},
};
